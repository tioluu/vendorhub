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

const deleteCategory = async (req, res) => {
    try{
        const category = await prisma.category.delete ({
            where: {
                id: Number(req.params.id)
            }
        });

        return res.status(200).json ({
            message: "Category deleted",
            category
        });

    } catch (error) {
        res.status(404).json ({
            message: "Category not found"
        });
    }
};

const viewCategory = async (req, res) => {
    const category = await prisma.category.findMany();
    res.status(200).json(category)
};

export {createCategory};
export {viewCategory};
export {deleteCategory};