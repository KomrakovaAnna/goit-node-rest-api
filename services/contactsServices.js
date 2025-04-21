import Contact from '../db/models/Contact.js';

export const getContacts = () => Contact.findAll();

export const getContactById = id => Contact.findByPk(id);

export const addContact = contact => Contact.create(contact);

export const updateContactById = async (id, data) => {
  const contact = await getContactById(id);
  if (!contact) return null;
  return contact.update(data, {
    returning: true,
  });
};

export const deleteContact = async id => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

export const updateStatusContact = async (contactId, body) => {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  return contact.update(body, {
    returning: true,
  });
};
