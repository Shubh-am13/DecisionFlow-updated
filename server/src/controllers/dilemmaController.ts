import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Dilemma from '../models/Dilemma';
import User from '../models/User';
import { generateAIConsensus } from '../services/geminiService';

export const createDilemma = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required to create a dilemma.',
      });
      return;
    }

    const { title, description, category, options, aiSummary, aiConfidence, aiInsights } = req.body;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
      return;
    }

    const formattedOptions = Array.isArray(options) && options.length > 0
      ? options
      : [
          { id: 'A', label: 'Option A', votes: 0 },
          { id: 'B', label: 'Option B', votes: 0 },
        ];

    // If no AI insights provided, generate them via Gemini!
    let generatedAi = { confidence: aiConfidence || '92% Confidence', insights: aiInsights || [] };
    if (!aiInsights || aiInsights.length === 0) {
      generatedAi = await generateAIConsensus({
        title,
        description,
        options: formattedOptions,
      });
    }

    const dilemma = await Dilemma.create({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Career & Life',
      author: req.user.userId,
      options: formattedOptions,
      aiSummary: typeof aiSummary === 'string' ? aiSummary.trim() : '',
      aiConfidence: generatedAi.confidence,
      aiInsights: generatedAi.insights,
      votes: [],
      comments: [],
    });

    await dilemma.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Dilemma created successfully.',
      dilemma,
    });
  } catch (error) {
    next(error);
  }
};

export const getDilemmas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await Dilemma.countDocuments();

    // Auto-seed if database is currently empty
    if (count === 0) {
      await seedInitialDilemmas();
    }

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 50));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (req.query.search) {
      const searchRegex = new RegExp(String(req.query.search).trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }, { category: searchRegex }];
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [dilemmas, total] = await Promise.all([
      Dilemma.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email')
        .populate('comments.user', 'name')
        .lean(),
      Dilemma.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: dilemmas.length,
      dilemmas,
    });
  } catch (error) {
    next(error);
  }
};

export const getDilemmaById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const dilemma = await Dilemma.findById(id)
      .populate('author', 'name email')
      .populate('comments.user', 'name');

    if (!dilemma) {
      res.status(404).json({
        success: false,
        message: 'Dilemma not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      dilemma,
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required to post comments.',
      });
      return;
    }

    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty.',
      });
      return;
    }

    const dilemma = await Dilemma.findById(id);
    if (!dilemma) {
      res.status(404).json({
        success: false,
        message: 'Dilemma not found.',
      });
      return;
    }

    const user = await User.findById(req.user.userId);
    const userName = user ? user.name : 'Anonymous';

    const newComment = {
      user: new mongoose.Types.ObjectId(req.user.userId),
      userName,
      text: text.trim(),
      createdAt: new Date(),
    };

    dilemma.comments.push(newComment);
    await dilemma.save();

    await dilemma.populate('comments.user', 'name');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comment: dilemma.comments[dilemma.comments.length - 1],
      dilemma,
    });
  } catch (error) {
    next(error);
  }
};

export const voteDilemma = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required to vote.',
      });
      return;
    }

    const { id } = req.params;
    const { option } = req.body; // e.g. "A", "B", or option label

    const dilemma = await Dilemma.findById(id);
    if (!dilemma) {
      res.status(404).json({
        success: false,
        message: 'Dilemma not found.',
      });
      return;
    }

    const existingVoteIndex = dilemma.votes.findIndex(
      (v) => v.user.toString() === req.user!.userId
    );

    const voteOption = (option || 'A').trim();

    if (existingVoteIndex > -1) {
      const oldOption = dilemma.votes[existingVoteIndex].option;
      if (oldOption === voteOption) {
        // Toggle off / remove vote
        dilemma.votes.splice(existingVoteIndex, 1);
        // decrement in options array
        const opt = dilemma.options.find((o) => o.id === voteOption || o.label === voteOption);
        if (opt) opt.votes = Math.max(0, opt.votes - 1);
      } else {
        // Switch option
        dilemma.votes[existingVoteIndex].option = voteOption;
        dilemma.votes[existingVoteIndex].createdAt = new Date();
        const oldOpt = dilemma.options.find((o) => o.id === oldOption || o.label === oldOption);
        if (oldOpt) oldOpt.votes = Math.max(0, oldOpt.votes - 1);
        const newOpt = dilemma.options.find((o) => o.id === voteOption || o.label === voteOption);
        if (newOpt) newOpt.votes += 1;
      }
    } else {
      dilemma.votes.push({
        user: new mongoose.Types.ObjectId(req.user.userId),
        option: voteOption,
        createdAt: new Date(),
      });
      const opt = dilemma.options.find((o) => o.id === voteOption || o.label === voteOption);
      if (opt) opt.votes += 1;
    }

    await dilemma.save();

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully.',
      votesCount: dilemma.votes.length,
      options: dilemma.options,
      votes: dilemma.votes,
    });
  } catch (error) {
    next(error);
  }
};

export const triggerAIConsensus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const dilemma = await Dilemma.findById(id);

    if (!dilemma) {
      res.status(404).json({
        success: false,
        message: 'Dilemma not found.',
      });
      return;
    }

    const result = await generateAIConsensus({
      title: dilemma.title,
      description: dilemma.description,
      options: dilemma.options,
      comments: dilemma.comments,
    });

    dilemma.aiConfidence = result.confidence;
    dilemma.aiInsights = result.insights;
    await dilemma.save();

    res.status(200).json({
      success: true,
      aiConfidence: dilemma.aiConfidence,
      aiInsights: dilemma.aiInsights,
    });
  } catch (error) {
    next(error);
  }
};

// Seed initial dilemmas if collection is empty
const seedInitialDilemmas = async (): Promise<void> => {
  let user = await User.findOne({ email: 'sarah@example.com' });
  if (!user) {
    user = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: 'demoPassword123',
    });
  }

  await Dilemma.create([
    {
      title: 'Should I take the job in Chicago or stay near family?',
      description:
        'Offered an associate product design role ($78k + relocation) in Chicago. Torn between building my career independence and missing weekly family dinners back home in Michigan.',
      category: 'Career & Life',
      author: user._id,
      options: [
        { id: 'A', label: 'Move to Chicago', votes: 1420 },
        { id: 'B', label: 'Stay near family', votes: 668 },
      ],
      aiConfidence: '94% Confidence',
      aiInsights: [
        {
          icon: 'trending_up',
          iconColorClass: 'text-ai-iridescent-blue',
          topic: 'Career momentum:',
          summary:
            'Voters overwhelmingly note that relocating in your 20s accelerates long-term growth and confidence, with home only a short train ride away.',
        },
        {
          icon: 'calendar_month',
          iconColorClass: 'text-ai-iridescent-purple',
          topic: 'Transition timeline:',
          summary:
            'Several alumni recommend a 1-year personal commitment test to build financial savings before deciding whether to stay permanent.',
        },
      ],
      comments: [
        {
          user: user._id,
          userName: 'Marcus Vance',
          text: 'Made this exact move from Grand Rapids to River North 4 years ago. Chicago is practically neighborly to MI. An Amtrak Wolverine ticket gets you home in under four hours anytime you crave home-cooked food. Go for it!',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000),
        },
        {
          user: user._id,
          userName: 'Elena Rostova',
          text: "Frame it as an experiment rather than a final verdict. Agree with your family upfront on designated holiday and weekend visits so nobody feels neglected. You will regret the risks you didn't take.",
          createdAt: new Date(Date.now() - 1 * 3600 * 1000),
        },
      ],
    },
    {
      title: 'Should our team migrate from REST to GraphQL for our mobile app?',
      description:
        'Our iOS and Android teams are requesting customized queries to reduce battery and payload overhead, but our backend team is worried about complex resolver caching.',
      category: 'Engineering & Architecture',
      author: user._id,
      options: [
        { id: 'A', label: 'Adopt GraphQL with Apollo', votes: 890 },
        { id: 'B', label: 'Stay with REST + OpenAPI', votes: 742 },
      ],
      aiConfidence: '91% Confidence',
      aiInsights: [
        {
          icon: 'trending_up',
          iconColorClass: 'text-ai-iridescent-blue',
          topic: 'Client velocity:',
          summary: 'Mobile engineers report 3x faster iteration speed when composing exact data requirements per screen.',
        },
        {
          icon: 'balance',
          iconColorClass: 'text-ai-iridescent-purple',
          topic: 'Backend maintenance:',
          summary: 'Teams warn that query complexity analysis and caching middleware require significant engineering investment.',
        },
      ],
      comments: [],
    },
    {
      title: 'Rent in downtown high-rise vs. buy suburban condo with 30-year fixed?',
      description:
        'Currently saving $2.5k/month. Wondering if buying now in the suburbs locks in equity or if renting downtown provides superior lifestyle during prime networking years.',
      category: 'Finance & Relocation',
      author: user._id,
      options: [
        { id: 'A', label: 'Rent Downtown', votes: 1105 },
        { id: 'B', label: 'Buy Suburban Condo', votes: 940 },
      ],
      aiConfidence: '89% Confidence',
      aiInsights: [
        {
          icon: 'trending_up',
          iconColorClass: 'text-ai-iridescent-blue',
          topic: 'Opportunity liquidity:',
          summary: 'Maintaining liquid capital enables taking early startup equity bets and rapid job mobility without home selling friction.',
        },
      ],
      comments: [],
    },
  ]);
};
