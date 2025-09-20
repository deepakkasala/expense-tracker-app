const express = require("express");
const { loginUser, registerUser, getUserInfo } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/get-user-info", protect, getUserInfo);
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded!" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ success: true, imageUrl });
});

module.exports = router;
