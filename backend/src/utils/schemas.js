const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const employeeSchema = Joi.object({
  nip: Joi.string().required(),
  fullName: Joi.string().required(),
  position: Joi.string().required(),
  division: Joi.string().required(),
  isActive: Joi.boolean().required(),
});

const assignmentSchema = Joi.object({
  letterNumber: Joi.string().required(),
  letterDate: Joi.date().required(),
  activityName: Joi.string().required(),
  location: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  teamName: Joi.string().required(),
  leaderId: Joi.number().integer().required(),
  memberIds: Joi.array().items(Joi.number().integer()).min(1).required(),
  status: Joi.string().valid('Perencanaan', 'Berjalan', 'Selesai', 'Dibatalkan').required(),
  overrideConflict: Joi.boolean().optional(),
});

module.exports = {
  loginSchema,
  employeeSchema,
  assignmentSchema,
};
