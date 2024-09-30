function loggingMiddleware() {
  return async (req, res, next) => {
    console.log(`${req.method} ${req.params}`);
    const result = await next();
    console.log(result);
    return result;
  };
}

module.exports = loggingMiddleware;