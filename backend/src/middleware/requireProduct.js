import prisma from "../../lib/prisma.js";

const requireProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid product ID" })
        }
        const productCheck = await prisma.product.findUnique({
            where: {
                id: id,
                storeId: req.store.id,
                archived: false
            }
        })

        if (!productCheck) {
            return res.status(404).json({ message: "Product not found." })
        }

        req.product = productCheck
        next()
    } catch (error) {
        next(error)
    }
}

export { requireProduct };