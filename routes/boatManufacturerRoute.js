const Router = require("express");
const {
  createManufacturer_post,
  getImageByManufacturer_get,
  updateManufacturer_put,
  deleteManufacturer_delete,
  getAllManufacturers_get,
  getManufacturerDetails,
  getManufacturerByManufacturerId_get,
} = require("../controllers/boatManufacturerController.js");

const router = Router();

router.post("/manufacturer", createManufacturer_post);
router.put("/manufacturer/:id", updateManufacturer_put);
router.delete("/manufacturer/:id", deleteManufacturer_delete);

router.get("/manufacturer", getAllManufacturers_get);
router.get("/manufacturerdetails", getManufacturerDetails);
router.get("/manufacturer/:id", getManufacturerByManufacturerId_get);
router.get("/manufacturerimage/:id", getImageByManufacturer_get);

module.exports = router;
