import express from 'express';
import productRoutes from './routes/product.routes.js';

const app = express();

// Middleware parsing JSON body
app.use(express.json());

// Routing produk
app.use('/products', productRoutes);

export default app;