var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var User = require("../controllers/User");

router.get('/', HomeController.index);
router.post('/user', User.create);

module.exports = router;