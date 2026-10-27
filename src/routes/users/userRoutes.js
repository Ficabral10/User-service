const createRouter = require('../utils');
const UserController = require('../../controllers/users/userController');
const paramsValidator = require('../../middleware/users/userParamsValidator');

const router = createRouter();

router.post('/', paramsValidator.createUser, (req, res) => UserController.create(req, res));
router.post('/login', paramsValidator.login, (req, res) => UserController.login(req, res));

module.exports = router;
