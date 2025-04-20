import fs from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('db', 'contacts.json');
const updateContacts = contacts =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const getContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
};

export const getContactById = async contactId => {
  const contacts = await getContacts();
  const result = contacts.find(contact => contact.id === contactId);
  return result || null;
};

export async function addContact({ name, email, phone }) {
  const contacts = await getContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);

  return newContact;
}

export const updateContactById = async (contactId, contact) => {
  const contacts = await getContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...contact };

  await updateContacts(contacts);

  return contacts[index];
};

export async function deleteContact(contactId) {
  const contacts = await getContacts();
  const contact = contacts.findIndex(contact => contact.id === contactId);
  if (contact === -1) return null;
  const [result] = contacts.splice(contact, 1);
  await updateContacts(contacts);
  return result;
}
