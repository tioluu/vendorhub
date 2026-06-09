import prisma from "../../lib/prisma.js";

const vendors = async (req, res) => {
    const vendor = await prisma.vendor.findMany();

    res.json(vendor);
};

export {vendors};