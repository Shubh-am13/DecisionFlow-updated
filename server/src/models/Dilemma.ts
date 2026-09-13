import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IVote {
  user: mongoose.Types.ObjectId;
  option?: string;
  createdAt: Date;
}

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName?: string;
  text: string;
  createdAt: Date;
}

export interface IOption {
  id: string;
  label: string;
  votes: number;
}

export interface IAIInsight {
  icon: string;
  iconColorClass: string;
  topic: string;
  summary: string;
}

export interface IDilemma extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  author: mongoose.Types.ObjectId;
  options: IOption[];
  votes: IVote[];
  comments: IComment[];
  aiSummary: string;
  aiConfidence: string;
  aiInsights: IAIInsight[];
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    option: {
      type: String,
      default: 'upvote',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text cannot be empty'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const optionSchema = new Schema<IOption>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    votes: { type: Number, default: 0 },
  },
  { _id: false }
);

const aiInsightSchema = new Schema<IAIInsight>(
  {
    icon: { type: String, default: 'trending_up' },
    iconColorClass: { type: String, default: 'text-ai-iridescent-blue' },
    topic: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { _id: false }
);

const dilemmaSchema = new Schema<IDilemma>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
    },
    category: {
      type: String,
      default: 'Career & Life',
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    options: {
      type: [optionSchema],
      default: [
        { id: 'A', label: 'Option A', votes: 0 },
        { id: 'B', label: 'Option B', votes: 0 },
      ],
    },
    votes: {
      type: [voteSchema],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    aiSummary: {
      type: String,
      default: '',
      trim: true,
    },
    aiConfidence: {
      type: String,
      default: '94% Confidence',
    },
    aiInsights: {
      type: [aiInsightSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Dilemma: Model<IDilemma> = mongoose.model<IDilemma>('Dilemma', dilemmaSchema);
export default Dilemma;
