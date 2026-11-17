const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  if (err.name === "MulterError") {
    status = 400;
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      err.message = `Unexpected field '${err.field}'. Send the image in a field called 'image'.`;
    }
  }

  let message;
  if (status < 500) {
    message = err.message;
  } else if (process.env.NODE_ENV === "development") {
    message = err.message;
  } else {
    message = "sum ain't right!";
  }

  if (status >= 500) {
    console.error(err.stack);
  }

  res.status(status).json({ message });
};

const notFound = (req, res, next) => {
  console.log(`Route not found. Method used is ${req.method} and request Url is ${req.originalUrl}`)
  res.status(404).json({ message: "check the method or url" })
}

export { errorHandler };
export { notFound };
