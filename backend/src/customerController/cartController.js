import prisma from "../../lib/prisma.js";

const viewCart = async (req, res) => {
    try{
        const cart = await prisma.cart.findUnique({
        where: {
            userId: req.user.id
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!cart) {
        return res.status(200).json({
            message: "No item in cart"
        })
    }

    res.json(cart)

    } catch (error) {
        console.error(error)

        res.status(500).json({
        message: "Something went wrong"
  });
}
};

const addToCart = async (req, res) => {
    
}
export {viewCart};