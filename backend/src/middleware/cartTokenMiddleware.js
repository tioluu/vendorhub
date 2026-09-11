import prisma from "../../lib/prisma.js";
import { hashCartToken } from "../utils/cartTokenGen.js";

const attachCart = async (req, res, next) => {
    req.cart = null;
    try{
        const raw = req.cookies.cart_token;

    if (raw) {
        const cart = await prisma.cart.findUnique({
            where: {tokenHash: hashCartToken(raw)},
            include: {items: {
                include: {
                    product: true
                }
            }
        }
        });

        if (cart) req.cart = cart
    }

    next();

    } catch (err) {
        next (err);
    }
};