const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json ({ message: "sum ain't right!"});
};

const notFound = (req, res, next) => {
  console.log(`Route not found. Method used is ${req.method} and request Url is ${req.originalUrl}`)
  res.status(404).json ({ message: "check the method or url"})
}

export {errorHandler};
export {notFound};
