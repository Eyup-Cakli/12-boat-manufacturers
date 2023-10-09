const Router = require("express");
const {
    createLogo_post,
    updateLogo_put,
    deleteLogo_delete,
    getAllLogo_get,
    getImageById_get
} = require("../controllers/boatManufacturerLogoController");

const router = Router();

router.post("/logo/add", createLogo_post);
router.put("/logo/update/:id", updateLogo_put);
router.delete("/logo/delete/:id", deleteLogo_delete);
router.get("/logo/getall", getAllLogo_get);
router.get("/logo/getlogo/:id", getImageById_get);

module.exports = router;