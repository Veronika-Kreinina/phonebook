import createHttpError from 'http-errors';

import {
  addContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateContact,
} from '../services/contacts.js';

import { sortByKeys } from '../db/models/Contacts.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { saveFileToUploads } from '../utils/saveToUploads.js';

export const getContactsController = async (req, res) => {
  console.log(req.user);

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByKeys);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId: req.user.id,
    filter,
  });

  if (!contacts) {
    throw new createHttpError(404, `Contact not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getOneContact(contactId, req.user.id);

  if (!contact) {
    throw new createHttpError(404, `Contact with id:${contactId} not found`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  let photo;

  if (req.file) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file);
      photo = result;
    } else {
      photo = await saveFileToUploads(req.file);
    }
  }

  const contact = await addContact({
    ...req.body,
    userId: req.user.id,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: contact,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  let photo;

  if (req.file) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file);
      photo = result;
    } else {
      photo = await saveFileToUploads(req.file);
    }
  }

  const updatedData = {
    ...req.body,
    ...(photo && { photo }),
  };

  const { isNew, data } = await updateContact(
    contactId,
    req.user.id,
    updatedData,
    { upsert: true },
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  let photo;


  if (req.file) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file);
      photo = result;
    } else {
      photo = await saveFileToUploads(req.file);
    }
  }

  const updatedData = {
    ...req.body,
    ...(photo && { photo }),
  };

  const result = await updateContact(contactId, req.user.id, updatedData);

  if (!result) {
    throw new createHttpError(404, 'Contact with id:${contactId} not found');
  }
  console.log(result);

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await deleteContact(contactId, req.user.id);
  if (!result) {
    throw new createHttpError(404, 'Contact with id:${contactId} not found');
  }

  res.status(204).send();
};
