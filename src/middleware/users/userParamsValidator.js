const Validator = require('fastest-validator');

const v = new Validator();

const createUserCheck = v.compile({
    firstName: { type: 'string', empty: false },
    lastName: { type: 'string', empty: false },
    email: { type: 'email' },
    password: { type: 'string', min: 6 },
});

const loginCheck = v.compile({
    email: { type: 'email' },
    password: { type: 'string', empty: false },
});

function validate(check) {
    return (req, res, next) => {
        const result = check(req.body || {});
        if (result !== true) {
            return res.status(422).json({ errors: result });
        }
        next();
    };
}

module.exports = {
    createUser: validate(createUserCheck),
    login: validate(loginCheck),
};
