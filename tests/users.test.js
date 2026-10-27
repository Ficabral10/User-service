const request = require('supertest');

jest.mock('../config/database', () => ({ define: jest.fn() }));
jest.mock('../src/services/firebase', () => ({}));

jest.mock('../src/models/userModel', () => ({
    create: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({})),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
}));

const User = require('../src/models/userModel');
const firebaseAuth = require('firebase/auth');
const app = require('../server');

const newUser = { firstName: 'Ana', lastName: 'Silva', email: 'ana@example.com', password: 'secret123' };

beforeEach(() => jest.clearAllMocks());

test('GET /health reports ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
});

test('POST /users creates the profile without storing the password', async () => {
    User.create.mockResolvedValue({ id: 1, firstName: 'Ana', lastName: 'Silva', email: 'ana@example.com' });
    firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({});

    const res = await request(app).post('/users').send(newUser);

    expect(res.status).toBe(201);
    expect(User.create).toHaveBeenCalledWith({ email: 'ana@example.com', firstName: 'Ana', lastName: 'Silva' });
});

test('POST /users rejects an invalid email or short password', async () => {
    const res = await request(app).post('/users').send({ ...newUser, email: 'not-an-email', password: '123' });
    expect(res.status).toBe(422);
    expect(User.create).not.toHaveBeenCalled();
});

test('POST /users rolls back the profile when Firebase fails', async () => {
    User.create.mockResolvedValue({ id: 7 });
    const err = new Error('email already in use');
    err.name = 'FirebaseError';
    err.code = 'auth/email-already-in-use';
    firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(err);

    const res = await request(app).post('/users').send(newUser);

    expect(res.status).toBe(500);
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: 7 } });
});

test('POST /users/login returns the profile on success', async () => {
    firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'abc' } });
    User.findOne.mockResolvedValue({ id: 1, email: 'ana@example.com' });

    const res = await request(app).post('/users/login').send({ email: 'ana@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.uid).toBe('abc');
});

test('POST /users/login returns 401 for wrong credentials', async () => {
    const err = new Error('bad');
    err.code = 'auth/invalid-credential';
    firebaseAuth.signInWithEmailAndPassword.mockRejectedValue(err);

    const res = await request(app).post('/users/login').send({ email: 'ana@example.com', password: 'nope' });

    expect(res.status).toBe(401);
});
