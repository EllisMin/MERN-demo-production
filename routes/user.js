const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

// GET /user
router.get("/user", userController.getUsers);
// POST /user
router.post("/user", userController.postUser);
// DELETE /user/:userId
router.delete("/user/:userId", userController.deleteUser);

module.exports = router;
