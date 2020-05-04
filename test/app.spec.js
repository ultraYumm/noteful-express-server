const app = require('../src/app')

describe('App', () => {
  it('GET / Hello, noteful-express-api!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, noteful-express-api!')
  })
})