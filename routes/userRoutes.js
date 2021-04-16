const express = require("express");
const router = express.Router();
// Import validator
const userValidator = require('../middlewares/validators/userValidator');

// Import controller
const userController = require('../controllers/userController');

// Import auth (middleware)
const auth = require("../middlewares/auth");

// Get all user data
router.get("/", auth.admin, userController.getAll);

// Get one user
router.get("/:id", auth.admin, userValidator.getOne, userController.getOne);

// Create user
router.post("/", auth.admin, userValidator.create, userController.create);

// Update user
router.put("/:id", auth.admin, userValidator.update, userController.update);

// Delete user
router.delete("/:id", auth.admin, userValidator.delete, userController.delete);

module.exports = router;