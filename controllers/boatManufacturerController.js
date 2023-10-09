const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { upload, uploadsDir } = require("../lib/upload.js");
const boatManufacturer = require("../models/concrete/boatManufacturer.js");
const boatManufacturerLogo = require("../models/concrete/boatManufacturersLogo.js");

// COMMANDS
// add a new manufacturer and logo
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

    let image = "";

    if (req.savedImage && req.savedImage.length > 0) {
      image = path.join(req.savedImage.join(","));
    }

    const newLogo = new boatManufacturerLogo({
      fileName: image,
    });

    const savedLogo = await newLogo.save();

    const newManufacturer = new boatManufacturer({
      logoId: savedLogo._id, // logoId'yi yeni logo ObjectId ile ayarlayın
      manufacturerName: manufacturerName,
      manufacturerWebSite: manufacturerWebSite,
    });

    const existingManufacturer = await boatManufacturer.findOne({
      manufacturerName: manufacturerName,
      manufacturerWebSite: manufacturerWebSite
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
      return res.status(200).json({ savedLogo, savedManufacturer });
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

    const manufacturerid = req.params.id;
    const newManufacturerName = req.body.manufacturerName;
    const newManufacturerWebSite = req.body.manufacturerWebSite;
    if (!newManufacturerName) {
      return res
        .status(403)
        .json({ error: "Manufacturer name can not be empty." });
    }

    const existingManufacturer = await boatManufacturer.findOne({
      _id: manufacturerid,
    });

    const manufacturerLogoId = existingManufacturer.logoId; 

    const existingLogo = await boatManufacturerLogo.findOne({
      _id: manufacturerLogoId
    });

    const checkManufacturerNameExists = await boatManufacturer.findOne({
      manufacturerName: newManufacturerName,
    });

    let image = null;
    if (req.savedImage && req.savedImage.length > 0) {
      image = path.join(req.savedImage.join(","));
    }

    const checkFileNameExists = await boatManufacturerLogo.findOne({
      fileName: image,
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

    if (checkFileNameExists) {
      return res.status(403).json({
        error: "This logo is already in use, please use a different logo.",
      })
    }

    if (checkManufacturerNameExists && !existingManufacturer.manufacturerName) {
      return res.status(403).json({
        error:
          "This manufacturer name is already in use, please use a different manufacturer name",
      });
    }

    if (!existingLogo) {
      const newLogo = new boatManufacturerLogo({
        fileName: image
      })
      await newLogo.save();

      existingManufacturer.manufacturerName = newManufacturerName;
      existingManufacturer.manufacturerWebSite = newManufacturerWebSite;
    }

    if (existingManufacturer && existingLogo) {
      existingManufacturer.manufacturerName = newManufacturerName;
      existingManufacturer.manufacturerWebSite = newManufacturerWebSite;

      existingLogo.fileName = image;

      const savedLogo = await existingLogo.save();
      const savedManufacturer = await existingManufacturer.save();
      return res.status(200).json({ savedManufacturer, savedLogo });
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
    const manufacturerId = req.params.id;
    const existingManufacturer = await boatManufacturer.findOne({
      _id: manufacturerId
    });

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

// get manufacturer by manufacturerId
const getManufacturerByManufacturerCode_get = async (req, res) => {
  try {
    const manufacturerId = req.params.id;
    const manufacturer = await boatManufacturer.findOne({
      _id: manufacturerId,
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
    const manufacturerId = req.params.id;
    const manufacturer = await boatManufacturer.findOne({
      _id: manufacturerId,
    });
    const logoId = manufacturer.logoId;

    const logo = await boatManufacturerLogo.findOne(
      logoId
    );
    const imagePath = uploadsDir+logo.fileName;
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
