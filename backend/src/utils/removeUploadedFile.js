import fs from "node:fs/promises";

const removeUploadedFile = async (file) => {
  if (!file) return;

  try {
    await fs.unlink(file.path);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Could not delete uploaded file:", file.path, error);
    }
  }
};

export { removeUploadedFile };