import prisma from "../../lib/prisma.js";

const viewProduct = async (req, res) => {
  const {storeName} = req.body
  const product = await prisma.product.findMany({
    where: {
        store: {
          name: storeName
        }
      }
  });
  console.log(product)
   res.json(product)
}

const createProduct = async (req, res, next) => {
  try{
    const store = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found. Create a store before adding a product"})
    }

    const { name, price, categories, description } = req.body;

    if (!Number.isInteger(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive whole number"})
    }

    const cleanName = name?.trim().replace(/\s+/g, ' ');

    if(!cleanName) {
      return res.status(400).json({ message: "Add product name to body"})
    }
    const existingProduct = await prisma.product.findFirst({
    where: {
    storeId: store.id,
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

if (categoryIds.length > 0) {
  const categoryCheck = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
      storeId: store.id
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
  storeId: store.id
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
};
};

const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded. Send it in a form field called 'image'"});
    }

    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!storeCheck) {
      return res.status(404).json({
        message: "Store not found. Create a store before uploading images for a product"})
    };

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product ID"})
    }

    const productCheck = await prisma.product.findFirst({
      where: {
        id: id,
        storeId: storeCheck.id,
        archived: false
      }
    });

    if (!productCheck) {
      return res.status(404).json({ message: "Product not found"});
    }

    const image = await prisma.image.create({
      data: {
        url: `/uploads/${req.file.filename}`,
        productId: productCheck.id
      }
    });

    return res.status(201).json({ message: "Image uploaded", image });

  } catch (error) {
    next(error)
  }
};

const editProduct = async (req, res, next) => {
  try {
    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!storeCheck) {
      return res.status(404).json({
        message: "Store not found. Create a store before editing products"})
    };

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product ID"})
    }

    const productCheck = await prisma.product.findFirst({
      where: {
        id: id,
        storeId: store.id,
        archived: false
      }
    })

    if (!productCheck) {
      return res.status(404).json({ message: "Product not found"});
    }

    const {name, price, categories, description} = req.body

    const data = { name, price, description };

    if (Array.isArray(categories)) {
      const categoryIds = [...new Set(categories)];

      if (categoryIds.length > 0) {
        const categoryCheck = await prisma.category.findMany({
          where: {
            id: { in: categoryIds },
            storeId: store.id
          }
        });

        if (categoryCheck.length !== categoryIds.length) {
          return res.status(400).json({ message: "One or more categories don't exist in your store" });
        }
      }

      data.categories = { set: categoryIds.map(id => ({ id })) };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data
    });

    res.json(updatedProduct)

  } catch (error) {
    next(error)
  }
};

const publishProduct = async (req, res, next) => {
  try{
    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });
    if (!storeCheck) {
      return res.status(404).json({ message: "Store not found. Create a store before publishing a product."});
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product ID"})
    }
    const productCheck = await prisma.product.findFirst({
      where: {
        id: id,
        storeId: storeCheck.id
      }
    });
    if (!productCheck) {
      return res.status(404).json({ message: "Product not found"})
    }

    if (productCheck.status === "PUBLISHED") {
      return res.status(200).json({ message: "Product is already published"});
    } else if (productCheck.status === "DRAFT") {
      await prisma.product.update ({
        where: {
          id: productCheck.id,
        },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date()
          }
      });
      return res.status(200).json({ message: "Product has been published"});

  } else {
    return res.status(409).json({ message: "The product has been suspended by the Admin."});
  }
} catch (error) {
  next(error)
}
};

const unpublishProduct = async (req, res, next) => {
  try{
    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });
    if (!storeCheck) {
      return res.status(404).json({ message: "Store not found. Create a store before unpublishing a product."});
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product ID"})
    }
    const productCheck = await prisma.product.findFirst({
      where: {
        id: id,
        storeId: storeCheck.id
      }
    });
    if (!productCheck) {
      return res.status(404).json({ message: "Product not found"})
    }

    if (productCheck.status === "DRAFT") {
      return res.status(200).json({ message: "Product has already been unpublished"});
    } else if (productCheck.status === "PUBLISHED") {
      await prisma.product.update ({
        where: {
          id: productCheck.id,
        },
          data: {
            status: "DRAFT",
            publishedAt: null
          }
      });
      return res.status(200).json({ message: "Product has been unpublished"});

    } else {
      return res.status(409).json({ message: "The product has been suspended by the Admin."});
  }
  } catch (error) {
    next(error)
  }
};

const deleteProduct = async (req, res, next) => {
  try{
    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!storeCheck) {
      return res.status(404).json({message: "Store not found. Create a store before deleting a product."})
    };

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product ID"})
    }

    const productCheck = await prisma.product.findFirst({
      where: {
        id: id,
        storeId: storeCheck.id,
        archived: false
    }
  });

  if (!productCheck) {
    return res.status(404).json({ message: "Product not found"})
  };

  await prisma.product.update({
    where: {
      id: productCheck.id,
      storeId: storeCheck.id
    },
    data: {
      archived: true,
      status: "DRAFT",
      publishedAt: null
    }
  })

  return res.status(200).json({ message: "Product deleted"})

} catch (error) {
  next(error)
}
};

export {viewProduct};
export {createProduct};
export {uploadProductImage};
export {deleteProduct};
export {editProduct};
export {publishProduct};
export {unpublishProduct};