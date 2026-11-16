import type { Request, Response } from 'express';

interface Product {
  id: number;
  name: string;
  price: number;
}

// Data awal produk yang disimpan di dalam memory array
const products: Product[] = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

// GET /products - Mendapatkan seluruh produk
export function getAllProducts(req: Request, res: Response) {
  res.status(200).json(products);
}

// GET /products/:id - Mendapatkan produk berdasarkan ID
export function getProductById(req: Request, res: Response) {
  const productId = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  return res.status(200).json(product);
}

// POST /products - Menambahkan produk baru
export function createProduct(req: Request, res: Response) {
  const { name, price } = req.body;

  if (!name || typeof price !== 'number') {
    return res.status(400).json({ message: 'Name dan price harus diisi dengan benar' });
  }

  // Generate ID baru (ID terbesar + 1)
  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  const newProduct: Product = {
    id: newId,
    name,
    price,
  };

  products.push(newProduct);

  return res.status(201).json(newProduct);
}