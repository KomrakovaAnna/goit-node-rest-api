import HttpError from '../helpers/HttpError.js';
import * as contactsService from '../services/contactsServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

export const getContactsController = ctrlWrapper(async (req, res) => {
  const data = await contactsService.getContacts();
  res.json(data);
});

export const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.json(contact);
});

export const createContactController = ctrlWrapper(async (req, res) => {
  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);
});

export const updateContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.updateContactById(id, req.body);

  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.json(contact);
});

export const deleteContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.deleteContact(id);

  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(contact);
});
