const express = require("express");
const multer = require("multer");
const { processCsvImport } = require("../services/importService");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await processCsvImport(req.file);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    res.status(500).json({
      error: "Import failed",
      details: error.message,
    });
  }
});

module.exports = router;