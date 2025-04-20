import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
  updateStatusContactController,
} from '../controllers/contactsControllers.js';

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from '../schemas/contactsSchemas.js';
import validateBody from '../decorators/validateBody.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getContactsController);

contactsRouter.get('/:id', getContactByIdController);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  createContactController
);

contactsRouter.put(
  '/:id',
  validateBody(updateContactSchema),
  updateContactController
);

contactsRouter.delete('/:id', deleteContactController);

contactsRouter.patch(
  '/:id',
  validateBody(updateStatusContactSchema),
  updateStatusContactController
);

export default contactsRouter;
