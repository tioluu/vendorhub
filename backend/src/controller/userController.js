import prisma from "../../lib/prisma.js";

const user = async (req, res) => {
    try {
        const users = await prisma.user.findMany();

    res.json(users);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};



export {user};