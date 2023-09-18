const Router = require("express");
const {
  createManufacturer_post,
  getImageByManufacturer_get,
  updateManufacturer_put,
  deleteManufacturer_delete,
  getAllManufacturers_get,
  getManufacturerByManufacturerCode_get,
} = require("../controllers/boatManufacturerController.js");

const router = Router();

router.post("/manufacturer/add", createManufacturer_post);
router.put("/manufacturer/update/:id", updateManufacturer_put);
router.delete("/manufacturer/delete/:id", deleteManufacturer_delete);

router.get("/manufacturer/getall", getAllManufacturers_get);
router.get("/manufacturer/getone/:id", getManufacturerByManufacturerCode_get);
router.get("/manufacturer/getoneimage/:id", getImageByManufacturer_get);

module.exports = router;
