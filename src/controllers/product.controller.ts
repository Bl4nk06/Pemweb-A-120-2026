import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";

// GET /products
export async function getProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getProducts:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

// GET /products/:id
export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "ID produk harus berupa angka bulat positif" });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ message: "Produk tidak ditemukan" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getProductById:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

// POST /products
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ message: "Nama produk wajib diisi dan harus berupa teks" });
      return;
    }

    if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
      res.status(400).json({ message: "Harga produk wajib diisi dan harus berupa angka >= 0" });
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        price: Math.round(price),
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error createProduct:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

// PUT /products (atau PUT /products/:id)
export async function updateProduct(req: Request, res: Response) {
  try {
    const rawId = req.params.id ?? req.body?.id;
    const id = Number(rawId);
    const { name, price } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "ID produk wajib disertakan dan harus berupa angka bulat positif" });
      return;
    }

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ message: "Nama produk wajib diisi dan harus berupa teks" });
      return;
    }

    if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
      res.status(400).json({ message: "Harga produk wajib diisi dan harus berupa angka >= 0" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        price: Math.round(price),
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).json({ message: "Produk dengan ID tersebut tidak ditemukan" });
      return;
    }
    console.error("Error updateProduct:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

// DELETE /products/:id (atau DELETE /products)
export async function deleteProduct(req: Request, res: Response) {
  try {
    const rawId = req.params.id ?? req.body?.id;
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "ID produk harus berupa angka bulat positif" });
      return;
    }

    const deletedProduct = await prisma.product.delete({ where: { id } });

    res.status(200).json({
      message: "Produk berhasil dihapus",
      data: deletedProduct,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).json({ message: "Produk dengan ID tersebut tidak ditemukan" });
      return;
    }
    console.error("Error deleteProduct:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}