const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Safely update validated data
    Object.assign(req[source], value);

    next();
  };
};

export default validate;
