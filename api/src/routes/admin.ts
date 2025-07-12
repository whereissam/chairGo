import { Hono } from 'hono'
import { Env } from '../index'
import { AdminController } from '../controllers/AdminController'

export const adminRouter = new Hono<{ Bindings: Env }>()

// Initialize controller
let adminController: AdminController

adminRouter.use('*', async (c, next) => {
  if (!adminController) {
    adminController = new AdminController(c.env.DB, c.env.JWT_SECRET || 'fallback-secret')
  }
  await next()
})

// Routes
adminRouter.get('/dashboard', (c) => adminController.getDashboard(c))
adminRouter.get('/users', (c) => adminController.getUsers(c))
adminRouter.put('/users/:id/role', (c) => adminController.updateUserRole(c))
adminRouter.delete('/users/:id', (c) => adminController.deleteUser(c))
adminRouter.post('/products/bulk-update', (c) => adminController.bulkUpdateProducts(c))