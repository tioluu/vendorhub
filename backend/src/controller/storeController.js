import prisma from "../../lib/prisma.js";

const viewStore = async (req, res) => {
  const store = await prisma.store.findMany({
  });

  if (!store) {
    return res.status(404).json({ 
      message: "No Store found" })
  };
  res.json(store)

}

const viewStoreById = async (req, res) => {
  const {id} = req.params;
  try{
    const store = await prisma.store.findUnique({
    where: {
      id: Number (id)
    }
  });
 
    if (!store) {
      return res.status(404).json ({
        message: "Store Not Found"
      })
    };
    
    res.json(store)
    
  } catch (error) {
    console.error(error);

  res.status(500).json({
    message: "SOmething went wrong"
  });
  }
  
};

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
    res.status(400).json({
    message: "Store already exist"
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

const customizeStore = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        userId: req.user.id
      }
    });

    if (!store) {
      return res.status(401).json({
        message: "Store not found"
      })
    };

    const { fontFamily, backgroundColor, foregroundColor} = req.body
    const updatedStore = await prisma.store.update ({
      where: {
        userId: req.user.id
      },
      data: {
        fontFamily, 
        backgroundColor, 
        foregroundColor
      }
    })

    res.json(updatedStore)

  } catch (error) {
    console.error(error);

    res.status(500).json({
    message: "Something went wrong"
  });
  }
};


export {viewStore};
export {viewStoreById};
export {createStore};
export {deleteStore};
export {customizeStore};