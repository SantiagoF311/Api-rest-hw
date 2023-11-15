const contacts = require("../service/index");
const contactModel = require("../service/schemas/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const contact = await contacts.listContacts();
    res.json({
      status: "succes",
      code: 200,
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await contacts.getContactById(contactId);
    if (contact) {
      res.json({
        status: "succes",
        code: 200,
        data: {
          contact,
        },
      });
    } else return res.status(404).json({ message: "Contact not found" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactModel.validateAdd(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await contacts.removeContact(contactId);

    if (contact) {
      res.json({
        status: "succes",
        code: 200,
        message: "Contact deleted",
        data: {
          contact,
        },
      });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error("Error in deleteContact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const body = req.body;

    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ message: "El cuerpo de la solicitud no puede estar vacío." });
    }

    if ("favorite" in body) {
      return res
        .status(400)
        .json({
          message: "No se permite actualizar el campo 'favorite' en esta ruta.",
        });
    }

    const { error } = contactModel.validateUpdate(body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedContact = await contacts.updateContact(contactId, body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Contacto no encontrado" });
    }

    res.json({
      message: "Contacto actualizado correctamente:",
      updatedContact,
    });
  } catch (error) {
    console.error("Error en updateContact:", error);

    if (error.isJoi) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "Contacto no encontrado") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Error interno del servidor" });
  }
};



const updateStatusContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const body = req.body;

    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ message: "El cuerpo de la solicitud no puede estar vacío." });
    }

    const allowedFields = ["favorite"];
    const invalidFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({
          message: `No se permiten cambios en los campos: ${invalidFields.join(
            ", "
          )}`,
        });
    }

    const updatedStatus = await contacts.updateStatusContact(contactId, body);

    if (updatedStatus.status === 404) {
      return res.status(404).json({ message: "Contacto no encontrado" });
    }

    if (updatedStatus.status === 200) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact: updatedStatus.contact,
        },
      });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  } catch (error) {
    console.error("Error en updateStatusContact:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
