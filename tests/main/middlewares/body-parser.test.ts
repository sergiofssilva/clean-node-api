import { setupApp } from '@/main/config/app'
import type { Express } from 'express'
import request from 'supertest'

let app: Express

describe('Body Parser Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Sergio' })
      .expect({ name: 'Sergio' })
  })
})
