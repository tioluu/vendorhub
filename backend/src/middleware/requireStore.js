import prisma from "../../lib/prisma.js";

const requireStore = async (req, res, next) => {
  try {
    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id,
      },
    });

    if (!storeCheck) {
      return res
        .status(404)
        .json({ message: "Store not found. Create a store first." });
    }

    req.store = storeCheck;
    next();
  } catch (error) {
    next(error);
  }
};

export { requireStore };
