import prisma from "../../lib/prisma.js";

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string") {
      return res.status(400).json({
        message: "Category name must be a text",
      });
    }

    const cleanName = name.trim().replace(/\s+/g, " ");

    if (!cleanName) {
      return res.status(400).json({ message: "Add category name to body." });
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        storeId: req.store.id,
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
        storeId: req.store.id,
      },
    });

    res.status(201).json({
      message: "Category created",
      category,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: `A category with this name ${req.body.name} already exists in your store.`,
      });
    }

    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await prisma.category.delete({
      where: {
        id: id,
        storeId: req.store.id,
      },
    });

    return res.status(200).json({
      message: "Category deleted",
      category,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: `Category ${req.params.id} not found`,
      });
    }

    next(error);
  }
};

const viewCategory = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        storeId: req.store.id,
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export { createCategory };
export { viewCategory };
export { deleteCategory };
