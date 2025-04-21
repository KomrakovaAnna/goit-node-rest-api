import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

export const getContactsController = ctrlWrapper(async (req, res) => {
  const { id: owner } = req.user;
  const data = await contactsService.getContacts({ owner });
  res.json(data);
});

export const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await contactsService.getContact({ id, owner });

  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.json(contact);
});

export const createContactController = ctrlWrapper(async (req, res) => {
  const { id: owner } = req.user;

  const newContact = await contactsService.addContact({ ...req.body, owner });
  res.status(201).json(newContact);
});

export const updateContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  6;
  const { id: owner } = req.user;
  const contact = await contactsService.updateContact({ id, owner }, req.body);

  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.json(contact);
});

export const updateStatusContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await contactsService.updateStatusContact(
    { id, owner },
    req.body
  );

  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(contact);
});

export const deleteContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await contactsService.deleteContact({ id, owner });

  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(contact);
});
