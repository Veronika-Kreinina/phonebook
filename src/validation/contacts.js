import Joi from 'joi';

import { typeList } from '../constants/contacts.js';

export const createContactShema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.number().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .min(3)
    .max(25),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeList)
    .required(),
  photo: Joi.string().uri().allow('').optional(),
});

export const updateContactShema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .min(3)
    .max(25),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
  photo: Joi.string().uri().allow('').optional(),
});
