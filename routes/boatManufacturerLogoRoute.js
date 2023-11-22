const Router = require("express");
const {
    createLogo_post,
    updateLogo_put,
    deleteLogo_delete,
    getAllLogo_get,
    getImageById_get
} = require("../controllers/boatManufacturerLogoController");

const router = Router();

router.post("/logo", createLogo_post);
router.put("/logo/:id", updateLogo_put);
router.delete("/logo/:id", deleteLogo_delete);
router.get("/logo", getAllLogo_get);
router.get("/logo/:id", getImageById_get);

module.exports = router;