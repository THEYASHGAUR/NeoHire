const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      return await Promise.resolve(requestHandler(req, res, next));
    } catch (error) {
      return next(error);
    }
  };
};

export { asyncHandler };
