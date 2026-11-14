import prisma from "../../lib/prisma.js";

const viewStores = async (req, res) => {
  const store = await prisma.store.findMany({
  });

  if (!store) {
    return res.status(404).json({ 
      message: "No Store found" })
  };
  res.json(store)

};

const viewStoreById = async (req, res, next) => {
  try{
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid store ID"})
    }

    const store = await prisma.store.findUnique({
    where: {
      id: id
    }
  });
 
    if (!store) {
      return res.status(404).json ({
        message: "Store Not Found"
      })
    };
    
    res.json(store)

  } catch (error) {
    next(error)
}
};

const createStore = async (req, res) => {
  try{
    const store = await prisma.store.create({
      data: {
        name: req.body.name,
        vendorId: req.vendor.id
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

const deleteStore = async (req, res, next) => {
    try{
       const storeExist = await prisma.store.findUnique({
        where: {
            vendorId: req.vendor.id
        }
    }); 
    if (!storeExist) {
      return res.status(404).json({ message: "Store not found, check if it exists."});
    }

    const checkOrder = await prisma.order.count({
      where: {
        storeId: storeExist.id
      } 
    })
    if (checkOrder > 0) {
      return res.status(409).json({ message: "This store has orders and can not be deleted. Unpublish it instead"})
    }
  
    await prisma.store.delete({
      where: {
        id: storeExist.id
      }
    })
    res.status(200).json({message: "Store deleted successfully"});

    } catch (error) {
      if (error.code === 'P2003') {
        return res.status(409).json({ message: "This store has orders and can not be deleted. Unpublish it instead."});
    }
    next(error)
}
};

const publishStore = async (req, res, next) => {
  try{
    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });
    if (!storeCheck) {
      return res.status(404).json({ message: "Store not found. Create a store before publishing it."});
    }

    if (storeCheck.status === "PUBLISHED") {
      return res.status(200).json({ message: "Store is already published"});
    } else if (storeCheck.status === "DRAFT") {
      await prisma.store.update ({
        where: {
          id: storeCheck.id,
        },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date()
          }
      });
      return res.status(200).json({ message: "Store has been published"});

  } else {
    return res.status(409).json({ message: "The store has been suspended by the Admin."});
  }
} catch (error) {
  next(error)
}
};

const unpublishStore = async (req, res, next) => {
  try{
    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });
    if (!storeCheck) {
      return res.status(404).json({ message: "Store not found. Create a store before unpublishing it."});
    }

    if (storeCheck.status !== "PUBLISHED") {
      return res.status(200).json({ message: "Store is already unpublished"});
    } else {
      await prisma.store.update ({
        where: {
          id: storeCheck.id,
        },
          data: {
            status: "DRAFT",
            publishedAt: new Date()
          }
      });

      res.status(200).json({ message: "Store has been unpublished"})
    }
  } catch (error) {
    next(error)
  }
};

const customizeStore = async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
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
        vendorId: req.vendor.id
      },
      data: {
        fontFamily, 
        backgroundColor, 
        foregroundColor
      }
    })

    res.json(updatedStore)

  } catch (error) {
    next(error)
  }
};


export {viewStores};
export {viewStoreById};
export {createStore};
export {deleteStore};
export {customizeStore};
export {unpublishStore};
export {publishStore};