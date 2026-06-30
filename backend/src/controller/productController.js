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
        userId: req.user.id
      }
    });

    if (!store) {
      res.status(404).json({ message: "Store not found"})
    }

    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        price: req.body.price,
        storeId: store.id
      }
    });

  res.json(product)

  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message
  });
}
};

const deleteProduct = async (req, res) => {

  try{
    const store = await prisma.store.findUnique({
      where: {
      userId: req.user.id
      }
    });

    if (!store) {
      return res.status(404).json({message: "Product not found or store does not exist"})
    };

    const product = await prisma.product.findFirst({
      where: {
        id: Number(req.params.id),
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
    message: error.message
  });
}
};

export {viewProduct};
export {createProduct};
export {deleteProduct};