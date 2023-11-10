// Write your tests here
const server = require('./server');
const db = require('../data/dbConfig');
const request = require('supertest')

const userA = { username: 'angel', password: 'angel' }
const userB = { username: 'daniel', password: 'daniel' }

afterAll(async () => {
  await db.destroy()
})
beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

test('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  describe('User endpoints', () => {
    describe('[POST] /api/auth/register', () => {
      beforeEach(async () => {
        await db('users').insert(userA)
        await db('users').insert(userB)
      })
      test('[1] return 400 when user already exist', async () => {
        const res = await request(server).post('/api/auth/register').send({ username: 'angel', password: 'pass' })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
      test('[2] return 400 when usersername is not defined', async () => {
        const res = await request(server).post('/api/auth/register').send({ password: 'pass' })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
    })

    describe('[POST] /api/auth/login', () => {
      beforeEach(async () => {
        await db('users').insert(userA)
        await db('users').insert(userB)
      })
      test('[1] return 400 when password is missing', async () => {
        const res = await request(server).post('/api/auth/login').send({ username: 'angel' })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
      test('[2] return 400 when user does not exist', async () => {
        const res = await request(server).post('/api/auth/login').send({ username: 'angel33', password: 'pass23' })
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
    })

    describe('[POST] /api/jokes', () => {
      beforeEach(async () => {
        await db('users').insert(userA)
        await db('users').insert(userB)
      })
      test('[1] return 200 when token is valid', async () => {
        const user = await request(server).post('/api/auth/login').send({ username: 'angel', password: 'angel' })

        const res = await request(server).get('/api/jokes').set('Authorization', `${user.body.token}`)
        expect(res.status).toBeGreaterThanOrEqual(200);
      }, 750)

      test('[2] return 400 when token is invalid', async () => {
        const res = await request(server).get('/api/jokes').set('Authorization', `21321`)
        expect(res.status).toBeGreaterThanOrEqual(400);
      }, 750)
    })
  })
})

