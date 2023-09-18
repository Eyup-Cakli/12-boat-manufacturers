const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { upload, uploadsDir } = require("../lib/upload.js");
const boatManufacturer = require("../models/concrete/boatManufacturer.js");

// COMMANDS
// add a new manufacturer
const createManufacturer_post = async function (req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ error: "Multer-induced error output when loading image" });
        } else if (err) {
          return res.status(500).json({ error: "Error loading image", err });
        }
        resolve();
      });
    });

    const manufacturerName = req.body.manufacturerName;
    const manufacturerWebSite = req.body.manufacturerWebSite;
    const filePath = uploadsDir;

    let image = "";

    if (req.savedImage && req.savedImage.length > 0) {
      image = path.join(req.savedImage.join(",")); //req.savedImage.join(',')
    }

    const newManufacturer = new boatManufacturer({
      filePath: filePath,
      fileName: image,
      manufacturerName: manufacturerName,
      manufacturerWebSite: manufacturerWebSite,
    });

    const existingManufacturer = await boatManufacturer.findOne({
      manufacturerName: manufacturerName,
      manufacturerWebSite: manufacturerWebSite,
      fileName: image,
    });

    if (!manufacturerName) {
      return res
        .status(403)
        .json({ error: "Enter a manufacturer name." });
    }

    if (existingManufacturer) {
      return res
        .status(403)
        .json({ error: "This manufacturer already exists." });
    } else {
      const savedManufacturer = await newManufacturer.save();
      return res.status(200).json(savedManufacturer);
    }
  } catch (err) {
    console.error("Caught an error: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// update a manufacturer
const updateManufacturer_put = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ error: "Multer-induced error output when loading image" });
        } else if (err) {
          return res.status(500).json({ error: "Error loading image" });
        }
        resolve();
      });
    });

    const manufacturerCode = req.params.id;
    const newManufacturerName = req.body.manufacturerName;
    const newManufacturerWebSite = req.body.manufacturerWebSite;
    const filePath = uploadsDir;

    if (!newManufacturerName) {
      return res
        .status(403)
        .json({ error: "Manufacturer name can not be empty." });
    }

    const existingManufacturer = await boatManufacturer.findOne({
      manufacturerCode: manufacturerCode,
    });
    const checkManufacturerNameExists = await boatManufacturer.findOne({
      manufacturerName: newManufacturerName,
    });

    if (!existingManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    if (existingManufacturer.isDeleted) {
      return res.status(403).json({
        error:
          "You are not authorized to update this manufacturer because it is deleted. ",
      });
    }

    if (checkManufacturerNameExists && !existingManufacturer.manufacturerName) {
      return res.status(403).json({
        error:
          "This manufacturer name is already in use, please use a different manufacturer name",
      });
    }

    let image = null;
    if (req.savedImage && req.savedImage.length > 0) {
      image = path.join(req.savedImage.join(","));
    }

    if (existingManufacturer) {
      existingManufacturer.filePath = filePath;
      existingManufacturer.fileName = image;
      existingManufacturer.manufacturerName = newManufacturerName;
      existingManufacturer.manufacturerWebSite = newManufacturerWebSite;

      const savedManufacturer = await existingManufacturer.save();
      return res.status(200).json(savedManufacturer);
    } else {
      return res.status(403).json(err);
    }
  } catch (err) {
    console.error("Caught an error: " + err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// delete a manufacturer
const deleteManufacturer_delete = async (req, res) => {
  try {
    const manufacturerCode = req.params.id;
    const existingManufacturer = await boatManufacturer.findOne(
      manufacturerCode
    );

    if (!existingManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    if (existingManufacturer.isDeleted) {
      return res.status(403).json({ error: "You can not delete this manufacturer, beacause this manufacturer already deleted." });
    }

    if (existingManufacturer) {
      existingManufacturer.isDeleted = true;
      await existingManufacturer.save();
      return res
        .status(200)
        .json({ message: "Manufacturer deleted successfully" });
    } else {
      return res.status(403).json({ err });
    }
  } catch (err) {
    console.error("Caught an error: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// QUERIES
// get all manufacturers
const getAllManufacturers_get = async (req, res) => {
  try {
    const manufacturers = await boatManufacturer.find({ isDeleted: false });
    res.status(200).json(manufacturers);
  } catch (err) {
    console.error("Caught an error: " + err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get manufacturer by manufacturerCode
const getManufacturerByManufacturerCode_get = async (req, res) => {
  try {
    const manufacturerCode = req.params.id;
    const manufacturer = await boatManufacturer.findOne({
      manufacturerCode: manufacturerCode,
    });

    if (!manufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    if (manufacturer.isDeleted) {
      return res.status(404).json({ error: "manufacturer deleted" });
    }
    return res.status(200).json(manufacturer);
  } catch (err) {
    console.error("Caught an error: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get image by manufacturer
const getImageByManufacturer_get = async (req, res) => {
  try {
    const manufacturerCode = req.params.id;
    const manufacturer = await boatManufacturer.findOne({
      manufacturerCode: manufacturerCode,
    });
    const imagePath = manufacturer.filePath + manufacturer.fileName;
    res.status(200).sendFile(imagePath);
  } catch (err) {
    console.error("Caught an error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createManufacturer_post,
  updateManufacturer_put,
  deleteManufacturer_delete,
  getAllManufacturers_get,
  getManufacturerByManufacturerCode_get,
  getImageByManufacturer_get,
};
