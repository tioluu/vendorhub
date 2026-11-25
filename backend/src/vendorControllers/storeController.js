import prisma from "../../lib/prisma.js";
import { validateStoreName } from "../utils/validateStoreName.js";
import { isAllowedFont, isHexColor } from "../utils/storeTheme.js";
import { removeUploadedFile } from "../utils/removeUploadedFile.js";
import path from "node:path";

const viewStores = async (req, res, next) => {
  try {
    const store = await prisma.store.findMany({});

    if (store.length === 0) {
      return res.status(404).json({
        message: "No Store found",
      });
    }
    res.json(store);
  } catch (error) {
    next(error);
  }
};

const viewStoreById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    const store = await prisma.store.findUnique({
      where: {
        id: id,
      },
    });

    if (!store) {
      return res.status(404).json({
        message: "Store Not Found",
      });
    }

    res.json(store);
  } catch (error) {
    next(error);
  }
};

const createStore = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Store name must be text" });
    }

    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleanName) {
      return res.status(400).json({ message: "Store name is required" });
    }

    const nameError = validateStoreName(cleanName);
    if (nameError) {
      return res.status(400).json({ message: nameError });
    }

    const storeCheck = await prisma.store.findUnique({
      where: {
        vendorId: req.vendor.id,
      },
    });
    if (storeCheck) {
      return res.status(409).json({ message: "You already have a store" });
    }

    const nameExist = await prisma.store.findUnique({
      where: {
        name: cleanName,
      },
    });
    if (nameExist) {
      return res
        .status(409)
        .json({ message: "This store name already exists" });
    }

    const store = await prisma.store.create({
      data: {
        name: cleanName,
        vendorId: req.vendor.id,
      },
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message:
          "A store with this name already exists, or you already have a store.",
      });
    }
    next(error);
  }
};

const deleteStore = async (req, res, next) => {
  try {
    const checkOrder = await prisma.order.count({
      where: {
        storeId: req.store.id,
      },
    });
    if (checkOrder > 0) {
      return res.status(409).json({
        message:
          "This store has orders and can not be deleted. Unpublish it instead",
      });
    }

    await prisma.store.delete({
      where: {
        id: req.store.id,
      },
    });
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(409).json({
        message:
          "This store has orders and can not be deleted. Unpublish it instead.",
      });
    }
    next(error);
  }
};

const publishStore = async (req, res, next) => {
  try {
    if (req.store.status === "PUBLISHED") {
      return res.status(200).json({ message: "Store is already published" });
    } else if (req.store.status === "DRAFT") {
      await prisma.store.update({
        where: {
          id: req.store.id,
        },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });
      return res.status(200).json({ message: "Store has been published" });
    } else {
      return res
        .status(409)
        .json({ message: "The store has been suspended by the Admin." });
    }
  } catch (error) {
    next(error);
  }
};

const unpublishStore = async (req, res, next) => {
  try {
    if (req.store.status === "DRAFT") {
      return res
        .status(200)
        .json({ message: "Store has already been unpublished" });
    } else if (req.store.status === "PUBLISHED") {
      await prisma.store.update({
        where: {
          id: req.store.id,
        },
        data: {
          status: "DRAFT",
          publishedAt: null,
        },
      });
      return res.status(200).json({ message: "Store has been unpublished" });
    } else {
      return res
        .status(409)
        .json({ message: "The Store has been suspended by the Admin." });
    }
  } catch (error) {
    next(error);
  }
};

const customizeStore = async (req, res, next) => {
  try {
    const { fontFamily, backgroundColor, foregroundColor } = req.body;

    const data = {};

    if (fontFamily !== undefined) {
      if (!isAllowedFont(fontFamily)) {
        return res.status(400).json({
          message: "Font not supported at this time",
        });
      }
      data.fontFamily = fontFamily;
    }

    if (backgroundColor !== undefined) {
      if (!isHexColor(backgroundColor)) {
        return res.status(400).json({
          message: "Background color must be a hex code like #1a2b3c",
        });
      }
      data.backgroundColor = backgroundColor;
    }

    if (foregroundColor !== undefined) {
      if (!isHexColor(foregroundColor)) {
        return res.status(400).json({
          message: "Foreground color must be a hex code like #1a2b3c",
        });
      }
      data.foregroundColor = foregroundColor;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Send at least one field to update",
      });
    }

    const updatedStore = await prisma.store.update({
      where: {
        id: req.store.id,
      },
      data,
    });

    res.json(updatedStore);
  } catch (error) {
    next(error);
  }
};

const uploadStoreBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Upload a banner image to continue." });
    }
    const oldBanner = req.store.bannerUrl;
    const banner = await prisma.store.update({
      where: {
        id: req.store.id,
      },
      data: {
        bannerUrl: `/uploads/${req.file.filename}`,
      },
    });
    if (oldBanner) {
      await removeUploadedFile({
        path: path.join("uploads", path.basename(oldBanner)),
      });
    }
    res
      .status(200)
      .json({ message: "Banner uploaded", bannerUrl: banner.bannerUrl });
  } catch (error) {
    await removeUploadedFile(req.file);
    next(error);
  }
};

export { viewStores };
export { viewStoreById };
export { createStore };
export { deleteStore };
export { customizeStore };
export { unpublishStore };
export { publishStore };
export { uploadStoreBanner };
