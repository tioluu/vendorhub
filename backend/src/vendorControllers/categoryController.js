import prisma from "../../lib/prisma.js";

const createCategory = async (req, res, next) => {
try{
    const store = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id
      }
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found. Create a store before adding category"})
    }
    const { name} = req.body;

    const cleanName = name?.trim().replace(/\s+/g, ' ');

    if (!cleanName) {
        return res.status(400).json({ message: "Add category name to body."})
    }

    const existingCategory = await prisma.category.findFirst({
    where: {
    storeId: store.id,
    name: {
      equals: cleanName,
      mode: "insensitive",
    },
  },
});

if (existingCategory) {
  return res.status(409).json({
    message: "A category with this name already exists in your store.",
  });
}
  
const category = await prisma.category.create({
    data: {
        name: cleanName,
        storeId: store.id
        }
    });

    res.status(201).json({
        message: "Category created",
        category
    });

} catch (error) {
  if (error.code === 'P2002') {
    return res.status(409).json({
      message: `A category with this name ${req.body.name} already exists in your store.`
    });
  }

  next(error);
}
};

const deleteCategory = async (req, res, next) => {
    try{
        const store = await prisma.store.findUnique ({
            where: {
                vendorId: req.vendor.id
            }
        });

        if (!store) {
            return res.status(404).json({ message: "Store not found. Create a store before managing categories"})
        };
        
        const category = await prisma.category.delete ({
            where: {
                id: Number(req.params.id),
                storeId: store.id
            }
        });

        return res.status(200).json ({
            message: "Category deleted",
            category
        });

    } catch (error) {
    if (error.code === 'P2025') {
    return res.status(404).json({
      message: `Category ${req.params.id} not found`
    });
  }

  next(error);
}
};

const viewCategory = async ( req, res, next ) => {
    try{
        const store = await prisma.store.findUnique ({
            where: {
                vendorId: req.vendor.id
            }
        });

        if (!store) {
            return res.status(404).json({ message: "Store not found. Create a store before managing categories"})
        };

        const categories = await prisma.category.findMany({
            where: {
                storeId: store.id
            }
        });

        res.status(200).json(categories)

    } catch (error) {
        next(error)
    }
    
    
};

export {createCategory};
export {viewCategory};
export {deleteCategory};