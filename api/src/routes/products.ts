import { Hono } from 'hono'
import { Env } from '../index'
import { ProductController } from '../controllers/ProductController'

export const productRouter = new Hono<{ Bindings: Env }>()

// Initialize controller
let productController: ProductController

productRouter.use('*', async (c, next) => {
  if (!productController) {
    productController = new ProductController(c.env.DB, c.env.JWT_SECRET || 'fallback-secret')
  }
  await next()
})

// Routes
productRouter.get('/', (c) => productController.getProducts(c))
productRouter.get('/:id', (c) => productController.getProduct(c))
productRouter.post('/', (c) => productController.createProduct(c))
productRouter.put('/:id', (c) => productController.updateProduct(c))
productRouter.delete('/:id', (c) => productController.deleteProduct(c))