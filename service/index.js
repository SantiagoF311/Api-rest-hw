const contactModel = require("./schemas/contacts");

const listContacts = async (userId) => {
  try {
    const result = await contactModel.find({ owner: userId });
    return result;
  } catch (error) {
    console.error("Error in listContacts:", error);
    throw new Error("Error reading contacts from the database");
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await contactModel.findById(contactId);

    if (!contact) {
      throw new Error(`Contact with ID ${contactId} not found`);
    }

    return contact;
  } catch (error) {
    throw new Error(
      `Error finding contact by ID in the database: ${error.message}`
    );
  }
};

const removeContact = async (contactId) => {
  try {
    return await contactModel.findByIdAndDelete(contactId);
  } catch (error) {
    console.error("Error removing contact:", error);
    throw new Error("Error removing contact from the database");
  }
};

const addContact = async (body) => {
  try {
    return await contactModel.create(body);
  } catch (error) {
    throw new Error("Error adding contact to the database");
  }
};

const updateContact = async (contactId, body) => {
  try {
    return await contactModel.findByIdAndUpdate(contactId, body, { new: true });
  } catch (error) {
    throw new Error("Error updating contact in the database");
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const updatedContact = await contactModel.findByIdAndUpdate(
      contactId,
      { $set: { favorite: body.favorite } },
      { new: true }
    );

    if (!updatedContact) {
      return { status: 404, message: "Not found" };
    }

    return { status: 200, contact: updatedContact };
  } catch (error) {
    return { status: 500, message: "Internal Server Error" };
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
