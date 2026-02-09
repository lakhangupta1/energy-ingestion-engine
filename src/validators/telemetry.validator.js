const Joi = require('joi');

const meterSchema = Joi.object({
  meterId: Joi.string().trim(),
  kwhConsumedAc: Joi.number().positive(),
  voltage: Joi.number().positive(),
  timestamp: Joi.date().iso()
})
  .min(1)          // at least one field must be present
  .unknown(false); // reject extra fields


const vehicleSchema = Joi.object({
  vehicleId: Joi.string().trim(),
  soc: Joi.number().min(0).max(100),
  kwhDeliveredDc: Joi.number().positive(),
  batteryTemp: Joi.number(),
  timestamp: Joi.date().iso()
})
  .min(1)          // at least one field must be present
  .unknown(false); // reject extra fields


module.exports = {
  meterSchema,
  vehicleSchema
};
