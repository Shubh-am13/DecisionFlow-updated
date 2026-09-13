import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../src/app';

const runTests = async () => {
  console.log('🚀 Starting Automated Backend Verification...\n');

  let mongod: MongoMemoryServer | null = null;
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: any) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      if (detail) console.error('     Detail:', detail);
      failed++;
    }
  };

  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('[Test DB] Connected to MongoMemoryServer\n');

    // 1. Health Check
    console.log('--- Testing System Endpoints ---');
    const healthRes = await request(app).get('/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'healthy', 'GET /health returns healthy');

    const rootRes = await request(app).get('/');
    assert(rootRes.status === 200 && rootRes.body.name === 'CrowdWise API', 'GET / returns API metadata');

    // 2. Authentication - Registration
    console.log('\n--- Testing Authentication Endpoints ---');
    const userPayload = {
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123',
    };

    const registerRes = await request(app).post('/register').send(userPayload);
    assert(registerRes.status === 201, 'POST /register returns 201 Created', registerRes.body);
    assert(!!registerRes.body.token, 'POST /register returns JWT token');
    assert(registerRes.body.user.email === 'student@example.com', 'POST /register returns user data');
    assert(!registerRes.body.user.password, 'POST /register does not expose password hash');

    const authToken = registerRes.body.token;

    // Duplicate Registration
    const dupRegisterRes = await request(app).post('/register').send(userPayload);
    assert(dupRegisterRes.status === 409, 'POST /register returns 409 for duplicate email');

    // Short password
    const shortPassRes = await request(app).post('/register').send({
      name: 'Invalid User',
      email: 'invalid@example.com',
      password: '123',
    });
    assert(shortPassRes.status === 400, 'POST /register returns 400 for password < 6 chars');

    // 3. Authentication - Login
    const loginRes = await request(app).post('/login').send({
      email: 'student@example.com',
      password: 'password123',
    });
    assert(loginRes.status === 200, 'POST /login returns 200 with valid credentials');
    assert(!!loginRes.body.token, 'POST /login returns JWT token');

    const badLoginRes = await request(app).post('/login').send({
      email: 'student@example.com',
      password: 'wrongpassword',
    });
    assert(badLoginRes.status === 401, 'POST /login returns 401 for incorrect password');

    // /api/auth alias
    const apiAuthLoginRes = await request(app).post('/api/auth/login').send({
      email: 'student@example.com',
      password: 'password123',
    });
    assert(apiAuthLoginRes.status === 200, 'POST /api/auth/login alias works');

    // 4. verifyToken Middleware
    console.log('\n--- Testing verifyToken Middleware ---');
    const noTokenMe = await request(app).get('/me');
    assert(noTokenMe.status === 401, 'GET /me without token returns 401 Unauthorized');

    const invalidTokenMe = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer invalid.token.payload');
    assert(invalidTokenMe.status === 401, 'GET /me with invalid token returns 401');

    const validTokenMe = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${authToken}`);
    assert(validTokenMe.status === 200 && validTokenMe.body.user.email === 'student@example.com', 'GET /me with valid token returns user');

    // 5. Dilemmas Endpoints
    console.log('\n--- Testing Dilemma Endpoints ---');
    const unauthorizedCreate = await request(app).post('/dilemmas').send({
      title: 'Should we switch to microservices?',
      description: 'Evaluating monolithic vs microservice architecture for scaling.',
    });
    assert(unauthorizedCreate.status === 401, 'POST /dilemmas without token returns 401');

    const createDilemmaRes = await request(app)
      .post('/dilemmas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Should we switch to microservices?',
        description: 'Evaluating monolithic vs microservice architecture for scaling.',
        aiSummary: 'Pending analysis',
      });
    assert(createDilemmaRes.status === 201, 'POST /dilemmas with token creates dilemma (201)');
    assert(createDilemmaRes.body.dilemma.title === 'Should we switch to microservices?', 'Dilemma has expected title');

    const dilemmaId = createDilemmaRes.body.dilemma._id;

    // Fetch dilemmas
    const listRes = await request(app).get('/dilemmas');
    assert(listRes.status === 200 && listRes.body.dilemmas.length === 1, 'GET /dilemmas returns dilemma list');
    assert(listRes.body.dilemmas[0].author.email === 'student@example.com', 'Dilemma author is populated');

    // Fetch dilemma by ID
    const singleRes = await request(app).get(`/dilemmas/${dilemmaId}`);
    assert(singleRes.status === 200 && singleRes.body.dilemma._id === dilemmaId, 'GET /dilemmas/:id returns dilemma');

    // Add Comment
    console.log('\n--- Testing Comment Endpoints ---');
    const unauthorizedComment = await request(app)
      .post(`/dilemmas/${dilemmaId}/comments`)
      .send({ text: 'Start with a modular monolith first!' });
    assert(unauthorizedComment.status === 401, 'POST /dilemmas/:id/comments without token returns 401');

    const addCommentRes = await request(app)
      .post(`/dilemmas/${dilemmaId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ text: 'Start with a modular monolith first!' });
    assert(addCommentRes.status === 201, 'POST /dilemmas/:id/comments with token adds comment (201)');
    assert(addCommentRes.body.comment.text === 'Start with a modular monolith first!', 'Comment text is recorded accurately');
    assert(addCommentRes.body.comment.userName === 'Test Student', 'Comment user name is populated');

    // Add Vote
    const voteRes = await request(app)
      .post(`/dilemmas/${dilemmaId}/vote`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ option: 'monolith' });
    assert(voteRes.status === 200, 'POST /dilemmas/:id/vote records vote');
    assert(voteRes.body.votesCount === 1, 'Vote count updated to 1');

    console.log('\n========================================');
    console.log(`Total tests run: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log('========================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  }
};

runTests();
