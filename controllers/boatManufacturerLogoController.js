const multer = require("multer");
const path = require("path");
const { upload, uploadsDir } = require("../lib/upload.js");
const boatManufacturerLogo = require("../models/concrete/boatManufacturersLogo.js");
const res = require("express/lib/response.js");

//COMMANDS
// add a new logo
// createLogo_post fonksiyonu içinde
const createLogo_post = async function (req, res) {
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

    let image = "";

    if (req.savedImage && req.savedImage.length > 0) {
      image = path.join(req.savedImage.join(","));
    }

    const newLogo = new boatManufacturerLogo({
      fileName: image,
    });

    const existingLogo = await boatManufacturerLogo.findOne({
      fileName: image,
    });

    if (!image) {
      return res
        .status(403)
        .json({ error: "Enter an image." });
    }

    if (existingLogo) {
      return res.status(403).json({ error: "This image already exists." });
    } else {
      const savedLogo = await newLogo.save();
      return res.status(200).json(savedLogo);
    }
  } catch (err) {
    console.error("Caught an error : ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// update a logo
const updateLogo_put = async (req, res) => {
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

    const logoId = req.params.id;

    let image = "";

    if (req.savedImage && req.savedImage.length > 0) {
      image = path.join(req.savedImage.join(","));
    }

    const existingLogo = await boatManufacturerLogo.findOne({
        _id: logoId
    });

    const checkFileNameExists = await boatManufacturerLogo.findOne({
        fileName: image
    });

    if (!existingLogo) {
        return res.status(404).json({ error: "Logo not found" });
    }

    if (existingLogo.isDeleted) {
        return res.status(403).json({
            error: "You are not authorized to update this logo because it is deleted."
        });
    }

    if (checkFileNameExists && !existingLogo.fileName) {
        return res.status(403).json({
            error: "This image is already in use, please use a different image."
        });
    }

    if (existingLogo) {
        existingLogo.fileName = image;

        const savedLogo = await existingLogo.save();
        return res.status(200).json(savedLogo);
    } else {
        return res.status(403).json(err);
    }

  } catch (err) {
    console.error("Caught an error : ", err);
    return res.status(200).json({ error: "Internal server error." });
  }
};

// delete a logo
const deleteLogo_delete = async (req, res) => {
    try {
        const logoId = req.params.id;
        const existingLogo = await boatManufacturerLogo.findOne({
            _id: logoId
        });

        if (!existingLogo) {
            return res.status(404).json({ error: "Logo not found." });
        }

        if (existingLogo.isDeleted) {
            return res.status(403).json({ error: "You can not delete this logo, because this logo already deleted." });
        }

        if (existingLogo) {
            existingLogo.isDeleted = true;
            await existingLogo.save();
            return res.status(200).json({ message: "Logo deleted successfully." });
        } else {
            return res.status(403).json({ err });
        }
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// QUERIES
//get all logo
const getAllLogo_get = async (req, res) => {
  try {
    const logos = await boatManufacturerLogo.find({ isDeleted: false });
    return res.status(200).json(logos);
  } catch (err) {
    console.error("")
    return res.status(500).json({ error: "Internal server error." });
  }
}

// get logo by id
const getImageById_get = async (req, res) => {
  try {
    const logoId = req.params.id;
    const logo = await boatManufacturerLogo.findOne({
      _id : logoId
    });

    if (!logo) {
      return res.status(404).json({ error: "Logo not found" });
    }

    if (logo.isDeleted) {
      return res.status(403).json({ error: "Logo not found, because it is deleted " })
    }

    if (logo) {
      const imagePath = uploadsDir+logo.fileName;
      res.status(200).sendFile(imagePath);
    }
  } catch (err) {
    console.error("Caught an error: ",err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createLogo_post,
  updateLogo_put,
  deleteLogo_delete,
  getAllLogo_get,
  getImageById_get
};
