import prisma from "../../lib/prisma.js";

const viewStore = async (req, res) => {
  const store = await prisma.store.findMany({
  });

  if (!store) {
    return res.status(404).json({ 
      message: "Store not found" })
  };
  res.json(store)

}

const createStore = async (req, res) => {
  try{
    const store = await prisma.store.create({
      data: {
        name: req.body.name,
        userId: req.user.id
      }
  });

  res.status(201).json({
    message: "Store created successfully",
    store
  });

  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message
  });
}
};

const deleteStore = async (req, res) => {
    try{
       const store = await prisma.store.delete({
        where: {
            name: req.body.name,
            userId: req.user.id
        }
    }); 

    res.status(201).json({message: "Store deleted successfully"});

    } catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message
  });
} 
};

export {viewStore};
export {createStore};
export {deleteStore};