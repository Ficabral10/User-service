const User = require('../../models/userModel');
const app = require('../../services/firebase');
const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} = require("firebase/auth");
const auth = getAuth(app);

class UserController {
    async create(req, res) {
        let createInDatabase;
        try {
            const {email, password, firstName, lastName} = req.body;
            createInDatabase = await User.create({
                email, password, firstName, lastName
            });
            await this.createUserInFirebase(email, password);
            return res.status(201).json(createInDatabase);
        } catch (error) {
            if (error.name.includes('Firebase')) {
                await User.destroy({where: {id: createInDatabase.id}});
            }
            return res.status(500).json(error);
        }
    }


    async findByEmail(req, res) {
        try {
            const user = await this.findInFirebase(req.body.email, req.body.password);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async createUserInFirebase(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    async findInFirebase(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }
}

module.exports = new UserController();
