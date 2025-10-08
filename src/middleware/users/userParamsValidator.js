const Validator = require('fastest-validator');
const v = new Validator();

class UserParamsValidator {
    createUser(req, res, next) {
        const schema = {
            firstName: "string",
            lastName: "string",
            email: "string"
        };
        const check = v.compile(schema);
        if (check(req.body).length) {
            return res.status(422).json(check(req.body));
        } else {
            next();
        }
    };

    findByEmail(req, res, next) {
        const schema = {
            email: "string",
            password: "string"
        };
        const check = v.compile(schema);
        if (check(req.body).length) {
            return res.status(422).json(check(req.body));
        } else {
            next();
        }
    };
}

module.exports = new UserParamsValidator();
