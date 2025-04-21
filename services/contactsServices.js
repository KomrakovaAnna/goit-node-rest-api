import Contact from '../db/models/Contact.js';

export const getContacts = query =>
  Contact.findAll({
    where: query,
  });

export const getContactById = id => Contact.findByPk(id);
export const getContact = query =>
  Contact.findOne({
    where: query,
  });

export const addContact = contact => Contact.create(contact);

export const updateContact = async (query, data) => {
  const contact = await getContact(query);
  if (!contact) return null;
  return contact.update(data, {
    returning: true,
  });
};

export const updateStatusContact = async (query, body) => {
  const contact = await getContact(query);
  if (!contact) return null;
  return contact.update(body, {
    returning: true,
  });
};

export const deleteContact = query =>
  Contact.destroy({
    where: query,
  });
