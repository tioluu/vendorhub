import prisma from "../../lib/prisma.js";

const createCategory = async (req, res) => {
    const category = await prisma.category.create({
        data: {
            name: req.body.name
        }
    });

    res.status(201).json({
        message: "Category created",
        category
    });
};

const viewCategory = async (req, res) => {
    const category = await prisma.category.findMany();
    res.status(200).json(category)
};

export {createCategory};
export {viewCategory};