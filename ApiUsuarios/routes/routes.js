var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var User = require("../controllers/User");

router.get('/', HomeController.index);
router.post('/user', User.create);
router.get('/user', User.index);
router.get('/user/:id', User.id);
router.put('/edit', User.edit);
router.delete('/user/:id', User.remove);
router.post('/recoverpassword', User.recoverPassword);
router.post('/changepassword', User.changePassword);

module.exports = router;