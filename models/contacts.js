const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error reading contacts file");
  }
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((c) => c.id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const updateContacts = contacts.filter((c) => c.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(updateContacts, null, 2));
  return contacts.find((c) => c.id === contactId);
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: Date.now().toString(), ...body };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const updatedContactIndex = contacts.findIndex((c) => c.id === contactId);

  if (updatedContactIndex === -1) {
    throw new Error("Contact not found");
  }

  if (body.name) contacts[updatedContactIndex].name = body.name;
  if (body.email) contacts[updatedContactIndex].email = body.email;
  if (body.phone) contacts[updatedContactIndex].phone = body.phone;

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[updatedContactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
