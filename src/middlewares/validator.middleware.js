export const validateSchema = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.issues) {
      return res.status(400).json(error.issues.map((error) => error.message));
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
