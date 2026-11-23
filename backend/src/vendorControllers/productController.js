import prisma from "../../lib/prisma.js";

const viewProduct = async (req, res) => {
  const { storeName } = req.body
  const product = await prisma.product.findMany({
    where: {
      store: {
        name: storeName
      }
    }
  });
  console.log(product)
  res.json(product)
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, categories, description } = req.body;

    if (typeof name !== "string") {
      return res.status(400).json({
        message: "Product name must be text"
      });
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Product description must be text"
        });
      }
    }

    const cleanName = name.trim().replace(/\s+/g, ' ');

    if (!cleanName) {
      return res.status(400).json({ message: "Add product name to body" });
    }

    if (!Number.isInteger(price) || price <= 0) {
      return res.status(400).json({
        message: "Price must be a positive whole number"
      });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        storeId: req.store.id,
        name: {
          equals: cleanName,
          mode: "insensitive",
        },
      },
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "A product with this name already exists in your store.",
      });
    }

    const categoryIds = Array.isArray(categories) ? [...new Set(categories)] : [];

    if (!categoryIds.every(id => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: "Category IDs must be positive whole numbers"
      });
    }

    if (categoryIds.length > 0) {
      const categoryCheck = await prisma.category.findMany({
        where: {
          id: { in: categoryIds },
          storeId: req.store.id
        }
      });

      if (categoryCheck.length !== categoryIds.length) {
        return res.status(400).json({ message: "One or more categories don't exist in your store" });
      }
    }

    const data = {
      name: cleanName,
      price,
      description,
      storeId: req.store.id
    };

    if (categoryIds.length > 0) {
      data.categories = { connect: categoryIds.map(id => ({ id })) };
    }

    const product = await prisma.product.create({ data });

    res.status(201).json(product)

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: "A product with this name already exists in your store."
      });
    }

    next(error);
  }
};

const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded. Send it in a form field called 'image'" });
    }

    const image = await prisma.image.create({
      data: {
        url: `/uploads/${req.file.filename}`,
        productId: req.product.id
      }
    });

    return res.status(201).json({ message: "Image uploaded", image });

  } catch (error) {
    next(error)
  }
};

const editProduct = async (req, res, next) => {
  try {
    const { name, price, categories, description } = req.body

    const data = {};

    if (name !== undefined) {
      if (typeof name !== "string") {
        return res.status(400).json({ message: "Product name must be text" });
      }
      const cleanName = name.trim().replace(/\s+/g, ' ');

      if (!cleanName) {
        return res.status(400).json({ message: "Add product name to body" });
      }

      const existingProductName = await prisma.product.findFirst({
        where: {
          storeId: req.store.id,
          id: { not: req.product.id },
          name: {
            equals: cleanName,
            mode: "insensitive",
          },
        },
      });

      if (existingProductName) {
        return res.status(409).json({
          message: "A product with this name already exists in your store.",
        });
      }
      data.name = cleanName;
    }

    if (price !== undefined) {
      if (!Number.isInteger(price) || price <= 0) {
        return res.status(400).json({
          message: "Price must be a positive whole number"
        });
      }
      data.price = price;
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({ message: "Description must be text" });
      }
      data.description = description;
    }

    if (categories !== undefined) {
      if (!Array.isArray(categories)) {
        return res.status(400).json({
          message: "Category must be in form of an array"
        });
      }

      if (!categories.every(id => Number.isInteger(id) && id > 0)) {
        return res.status(400).json({
          message: "Category IDs must be positive whole numbers"
        });
      }

      const categoryIds = [...new Set(categories)];

      const categoryCheck = await prisma.category.findMany({
        where: {
          id: { in: categoryIds },
          storeId: req.store.id
        }
      });

      if (categoryCheck.length !== categoryIds.length) {
        return res.status(400).json({ message: "One or more categories don't exist in your store" });
      }

      data.categories = { set: categoryIds.map(id => ({ id })) };
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Send at least one field to update"
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.product.id },
      data
    });

    res.json(updatedProduct);

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: "A product with this name already exists in your store."
      });
    }

    next(error)
  }
};

const publishProduct = async (req, res, next) => {
  try {
    if (req.product.status === "PUBLISHED") {
      return res.status(200).json({ message: "Product is already published" });
    } else if (req.product.status === "DRAFT") {
      await prisma.product.update({
        where: {
          id: req.product.id,
        },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date()
        }
      });
      return res.status(200).json({ message: "Product has been published" });

    } else {
      return res.status(409).json({ message: "The product has been suspended by the Admin." });
    }
  } catch (error) {
    next(error)
  }
};

const unpublishProduct = async (req, res, next) => {
  try {
    if (req.product.status === "DRAFT") {
      return res.status(200).json({ message: "Product has already been unpublished" });
    }
    else if (req.product.status === "PUBLISHED") {
      await prisma.product.update({
        where: {
          id: req.product.id,
        },
        data: {
          status: "DRAFT",
          publishedAt: null
        }
      });
      return res.status(200).json({ message: "Product has been unpublished" });

    } else {
      return res.status(409).json({ message: "The product has been suspended by the Admin." });
    }
  } catch (error) {
    next(error)
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.update({
      where: {
        id: req.product.id,
        storeId: req.store.id
      },
      data: {
        archived: true,
        status: "DRAFT",
        publishedAt: null,
        name: `${req.product.name} [archived ${req.product.id}]`
      }
    })

    return res.status(200).json({ message: "Product deleted" })

  } catch (error) {
    next(error)
  }
};

export { viewProduct };
export { createProduct };
export { uploadProductImage };
export { deleteProduct };
export { editProduct };
export { publishProduct };
export { unpublishProduct };