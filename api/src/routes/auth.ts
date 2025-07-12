import { Hono } from 'hono'
import { Env } from '../index'
import { AuthController } from '../controllers/AuthController'

export const authRouter = new Hono<{ Bindings: Env }>()

// Initialize controller
let authController: AuthController

authRouter.use('*', async (c, next) => {
  if (!authController) {
    authController = new AuthController(c.env.DB, c.env.JWT_SECRET || 'fallback-secret')
  }
  await next()
})

// Routes
authRouter.post('/login', (c) => authController.login(c))
authRouter.post('/register', (c) => authController.register(c))
authRouter.get('/verify', (c) => authController.verify(c))
authRouter.post('/logout', (c) => authController.logout(c))