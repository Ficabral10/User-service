const User = require('../../models/userModel');
const app = require('../../services/firebase');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

const auth = getAuth(app);

class UserController {
    // Creates the profile in Postgres, then the login in Firebase.
    // Passwords live only in Firebase; if Firebase rejects the user, the profile row is rolled back.
    async create(req, res) {
        const { email, password, firstName, lastName } = req.body;
        let user;
        try {
            user = await User.create({ email, firstName, lastName });
            await createUserWithEmailAndPassword(auth, email, password);
            return res.status(201).json(user);
        } catch (error) {
            if (user && error.name && error.name.includes('Firebase')) {
                await User.destroy({ where: { id: user.id } });
            }
            const status = error.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
            return res.status(status).json({ error: error.code || error.message });
        }
    }

    // Signs the user in with Firebase and returns their stored profile.
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const profile = await User.findOne({ where: { email } });
            return res.status(200).json({ uid: credential.user.uid, profile });
        } catch (error) {
            const isAuthError = error.code && error.code.startsWith('auth/');
            return res.status(isAuthError ? 401 : 500).json({ error: error.code || error.message });
        }
    }
}

module.exports = new UserController();
