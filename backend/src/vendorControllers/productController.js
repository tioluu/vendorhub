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

const createProduct = async (req, res) => {
  try{
    const store = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found"})
    }

    const { name, price, categories, description } = req.body;

    if (!Number .isInteger(price) || price <= 0) {
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
  console.error(error);

  if (error.code === 'P2002') {
    return res.status(409).json({
      message: "A product with this name already exists in your store."
    })
  }

  res.status(500).json({
    message: "Something went wrong"
  });
}
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

    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
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

const deleteProduct = async (req, res) => {

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
  console.error(error);

  res.status(500).json({
    message: "SOmething went wrong"
  });
}
};

export {viewProduct};
export {createProduct};
export {deleteProduct};
export {editProduct};