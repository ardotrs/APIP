module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      message: 'Validasi gagal',
      details: error.details.map((detail) => detail.message),
    });
  }

  return next();
};
