const createRouter = require("../utils");
const UserController = require("../../controllers/users/userController");
const paramsValidator = require("../../middleware/users/userParamsValidator");

const router = createRouter();

router.post('/', paramsValidator.createUser, async (req, res) => {
    return UserController.create(req, res);
});

router.post('/info', paramsValidator.findByEmail, async (req, res) => {
    return UserController.findByEmail(req, res);
});

module.exports = router;
