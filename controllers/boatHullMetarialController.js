const boatHullMetarial = require("../models/concrete/boatHullMetarial.js");

//COMMANDS
// add a new hull metarial
const createBoatHullMetarial_post = async (req, res) => {
    try {
        const boatHullMetarialName = req.body.boatHullMetarialName;

        const newBoatHullMetarial = new boatHullMetarial({
            boatHullMetarialName: boatHullMetarialName
        });

        const checkBoatHullMetarialNameExists = await boatHullMetarial.findOne({
            boatHullMetarialName: boatHullMetarialName
        });

        if (!boatHullMetarialName) {
            return res.status(403).json({ error: "Enter a boat hull metarial name." });
        }

        if (checkBoatHullMetarialNameExists) {
            return res.status(403).json({ error: "This hull metarial name already exists." });
        } else {
            const savedBoatHullMetarial = await newBoatHullMetarial.save();
            return res.status(200).json(savedBoatHullMetarial);
        }
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// update a hull metarial
const updateBoatHullMetarial_put = async (req, res) => {
    try {
        const boatHullMetarialId = req.params.id;
        const newBoatHullMetarialName = req.body.boatHullMetarialName;

        if (!newBoatHullMetarialName) {
            return  res.status(403).json({ error: "Hull metarial name can not be empty." });
        }

        const existingBoatHullMetarial = await boatHullMetarial.findOne({
            _id: boatHullMetarialId
        });

        const checkBoatHullMetarialNameExists = await boatHullMetarial.findOne({
            boatHullMetarialName: newBoatHullMetarialName
        });

        if (!existingBoatHullMetarial) {
            return res.status(404).json({ error: "Boat hull metarial not found" });
        }

        if (existingBoatHullMetarial.isDeleted) {
            return res.status(403).json({
                error: "You are not authorized to update this hull metarial because it is deleted."
            })
        }

        if (checkBoatHullMetarialNameExists && !existingBoatHullMetarial.boatHullMetarialName) {
            return req.status(403).json({
                error: "This boat hull metarial name already in use, please use a different hull metarşal name."
            });
        }

        if (existingBoatHullMetarial) {
            existingBoatHullMetarial.boatHullMetarialName = newBoatHullMetarialName;

            const savedBoatHullMetarial = await existingBoatHullMetarial.save();
            return res.status(200).json(savedBoatHullMetarial);
        }
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// delete a boat hull metarial
const deleteBoatHullMetarial_delete = async (req, res) => {
    try {
        const boatHullMetarialId = req.params.id;
        const existingBoatHullMetarial = await boatHullMetarial.findOne({
            _id: boatHullMetarialId
        });

        if (!existingBoatHullMetarial) {
            return res.status(404).json({ error: "Boat hull metarial not found" });
        }

        if (existingBoatHullMetarial.isDeleted) {
            return res.status(403).json({ error: "This boat hull metarial already deleted." });
        }

        if (existingBoatHullMetarial) {
            existingBoatHullMetarial.isDeleted = true;
            await existingBoatHullMetarial.save();
            return res.status(200).json({ message: "Boat hull metarial deleted successfully" });
        } 
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// QUERIES
// get all boat hull metarials
const getAllBoatHull_metarials_get = async (req, res) => {
    try {
        const boatHullMetarials = await boatHullMetarial.find({
            isDeleted: false
        });
        return res.status(200).json(boatHullMetarials);
    } catch (err) {
        console.err("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// get hull metarials by id
const getBoatHullMetarialById_get = async(req, res) => {
    try {
        const boatHullMetarialId = req.params.id;
        const hullMetaeial = await boatHullMetarial.findOne({
            _id:  boatHullMetarialId
        });

        if (!hullMetaeial) {
            return res.status(404). json({ error: "Hull metarial not found" });
        }

        if (hullMetaeial.isDeleted) {
            return res.status(403).json({ error: "Hull metarial deleted" });
        } else {
            return res.status(200).json(hullMetaeial);
        }
    } catch (err) {
        console.err("Caught an error: ", err);
        return res.status(500).json({error: "Internal server error."});
    }
}

module.exports = {
    createBoatHullMetarial_post,
    updateBoatHullMetarial_put,
    deleteBoatHullMetarial_delete,
    getAllBoatHull_metarials_get,
    getBoatHullMetarialById_get
};