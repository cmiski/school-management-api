import AppError from "../utils/AppError.js";

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data);

    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    // safely update validated data
    Object.assign(req[source], value);

    next();
  };
};

export default validate;
