const Joi = require('joi');

const meterSchema = Joi.object({
  meterId: Joi.string().required(),
  kwhConsumedAc: Joi.number().required(),
  voltage: Joi.number().required(),
  timestamp: Joi.date().required()
});

const vehicleSchema = Joi.object({
  vehicleId: Joi.string().required(),
  soc: Joi.number().required(),
  kwhDeliveredDc: Joi.number().required(),
  batteryTemp: Joi.number().required(),
  timestamp: Joi.date().required()
});

module.exports = {
  meterSchema,
  vehicleSchema
};
