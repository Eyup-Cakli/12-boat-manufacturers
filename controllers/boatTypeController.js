const boatType = require("../models/concrete/boatType.js");

//COMMANDS
// add a new type
const createType_post = async (req, res) => {
  try {
    const typeName = req.body.typeName;

    const newType = new boatType({
        typeName: typeName
    });

    const existingType = await boatType.findOne({
        typeName: typeName
    });

    if (!typeName) {
        return res.status(403).json({ error: "Enter a type name." });
    }

    if (existingType) {
        return res.status(403).json({ error: "This type already exists." });
    } else {
        const savedType = await newType.save();
        return res.status(200).json(savedType);
    }
  } catch (err) {
    console.error("Caught an error: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// update a type
const updateType_put = async (req, res) => {
    try {
        const typeId = req.params.id;
        const newTypeName = req.body.typeName;

        if(!newTypeName){
            return res.status(403).json({ error: "Type name can not be empty." });
        };

        const existingType = await boatType.findOne({
            _id: typeId
        });

        const checkTypeNameExists = await boatType.findOne({
            typeName: newTypeName
        });

        if (!existingType) {
            return res.status(404).json({ error: "Type not found" });
        };

        if (existingType.isDeleted) {
            return res.status(403).json({
                error: "You are not authorized to update this type because it is deleted.",
            });
        }

        if (checkTypeNameExists && !existingType.typeName) {
            return req.status(403).json({
                error: "This type name is already in use, please use a different manufacturer name",
            });
        }

        if (existingType) {
            existingType.typeName = newTypeName;

            const savedType = await existingType.save();
            return res.status(200).json(savedType);
        } else {
            return res.status(403).json(err);
        };
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// delete a type
const deleteType_delete = async (req, res) => {
    try {
        const typeId = req.params.id;

        const existingType = await boatType.findOne({
            _id: typeId
        });

        if (!existingType) {
            return res.status(404).json({ error: "Type not found." });
        }

        if (existingType.isDeleted) {
            return res.status(403).json({ err });
        }

        if (existingType) {
            existingType.isDeleted = true;
            await existingType.save();
            return res.status(200).json({ message: "Type deleted successfully." });
        }
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//QUERIES
//get all types
const getAllTypes_get = async (req, res) => {
    try {
        const types = await boatType.find({
            isDeleted: false
        });
        res.status(200).json(types);
    } catch (err) {
        console.error("Caught an error: " + err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//get type by id
const getTypeById_get = async (req, res) => {
    try {
        const typeId = req.params.id;
        const type = await boatType.findOne({
            _id: typeId
        });
        
        if (!type) {
            return res.status(404).json({ error: "Type not found." });
        }

        if (type.isDeleted) {
            return res.status(403).json({ error: "Type deleted" });
        }
        return res.status(200).json(type);
    } catch (err) {
        console.err("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    createType_post,
    updateType_put,
    deleteType_delete,
    getAllTypes_get,
    getTypeById_get
};