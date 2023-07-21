import express, { type Express } from 'express'
import { resolve } from 'path'

export default (app: Express): void => {
  app.use('/static', express.static(resolve(__dirname, '../../')))
}
