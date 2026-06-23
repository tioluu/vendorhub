import prisma from "../../lib/prisma.js";

const viewStore = async (req, res) => {
  const store = await prisma.store.findMany({
  });

  if (!store) {
    return res.status(404).json({ "message": "Store not found" })
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

  res.status(201).json({message: "Store created successfully"})

  } catch {
    res.status(400).json({message: "Store already exist"})
  };
  
};

const deleteStore = async (req, res) => {
    try{
       const store = await prisma.store.delete({
        where: {
            name: req.body.name,
            userId: req.user.id
        }
    }); 

    res.status(201).json({message: "Store deleted successfully"})

    } catch (error) {
    res.status(404).json({message: "Store not found"});

} 
};

export {viewStore};
export {createStore};
export {deleteStore};