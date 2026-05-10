const errorMiddleware = (err, req, res, next) => {
  const isMalformedJson =
    (err instanceof SyntaxError &&
      err.status === 400 &&
      Object.prototype.hasOwnProperty.call(err, "body")) ||
    err.type === "entity.parse.failed";

  if (isMalformedJson) {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Malformed JSON payload",
    });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      status: "fail",
      message: "School already exists with same name, address and coordinates",
    });
  }

  const isLockError =
    err.code === "ER_LOCK_DEADLOCK" ||
    err.code === "ER_LOCK_WAIT_TIMEOUT" ||
    err.errno === 1213 ||
    err.errno === 1205;

  if (isLockError) {
    return res.status(503).json({
      success: false,
      status: "error",
      message: "Database is busy. Please retry your request.",
    });
  }

  if (err.code === "INVALID_DB_DATA") {
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Invalid data found in database",
    });
  }

  err.statusCode = err.statusCode || 500;

  err.status = err.status || "error";

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
