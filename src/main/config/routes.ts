import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // eslint-disable-next-line n/no-path-concat
  readdirSync(join(__dirname, '../routes')).map(async file => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import (`../routes/${file}`)).default(router)
    }
  })
}
