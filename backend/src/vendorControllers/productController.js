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

    const product = await prisma.product.create({
      data: {
        name: cleanName,
        price,
        description,
        storeId: store.id,
        categories: {
          connect: categories.map(id => ({ id}))
        }
      }
    });

  res.json(product)

  } catch (error) {
  if (error.code === 'P2002') {
    return res.status(409).json({
      message: "A product with this name already exists in your store."
    });
  }

  next(error);
};
};

const editProduct = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!store) {
      return res.status(404).json({
        message: "Product not found or store does not exist"})
    };

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product ID"})
    }

    const product = await prisma.product.findFirst({
      where: {
        id: id,
        storeId: store.id
      }
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found"});
    }

    const {name, price, categories, description} = req.body

    const data = { name, price, description };
    if (categories) {
      data.categories = { connect: categories.map(id => ({ id }))}
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data
    });

    res.json(updatedProduct)

  } catch (error) {
    console.error(error);

  res.status(500).json({
    message: "Something went wrong"
  });
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
            publishedAt: new Date()
          }
      });
      return res.status(200).json({ message: "Store has been unpublished"});

    } else {
      return res.status(409).json({ message: "The store has been suspended by the Admin."});
  }
  } catch (error) {
    next(error)
  }
};

const deleteProduct = async (req, res, next) => {

  try{
    const store = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!store) {
      return res.status(404).json({message: "Product not found or store does not exist"})
    };

    const { id } = req.params; 
    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        storeId: store.id
    }
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found"})
  };

  await prisma.product.delete({
    where: {
      id: product.id
    }
  })

  res.status(200).json({ message: "Product deleted"})

} catch (error) {
  next(error)
}
};

export {viewProduct};
export {createProduct};
export {deleteProduct};
export {editProduct};
export {publishProduct};
export {unpublishProduct};