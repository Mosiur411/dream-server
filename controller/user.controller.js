const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { getAuth } = require("firebase-admin/auth");
const admin = require('firebase-admin');

const { UserModel } = require("../model/user.model");

/* =============== Check Auth =============== */
const checkAuth = async (_id) => {
    try {
        const user = await UserModel.findById(_id)
        const firebaseUser = await getAuth().getUserByEmail(user?.email)
        if (!firebaseUser?.uid) {
            return res.status(401).json({ error: 'Unauthorized User' })
        }
        return firebaseUser
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        throw new Error(errorMessage)
    }
}

const userSignup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const createAccount = await admin.auth().createUser({
            email: email,
            password: password,
        })
        if (createAccount?.uid) {
            const user = await UserModel({ ...req.body, uid: createAccount.uid, role: 'admin' })
            await user.save()
            return res.status(200).json({ user })
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/* ===================  user handel ===================  */

const userGet = async (req, res) => {
    const { _id } = req.user;
    if (!_id) return res.status(401).json({ error: 'Unauthorized User' })
    /* data get user  */
    const user = await UserModel.findById(_id);
    return res.status(200).json({ user })

}
const userUpdate = async (req, res) => {
    const data = req.body;
    const { _id } = req.user;
    if (!data) return res.status(401).json({ error: 'Not Data Update' })
    /* data Update user  */
    const user = await UserModel.updateMany({ _id: _id }, { $set: data }, {
        runValidators: true,
    })
    return res.status(200).json({ user })

}



/* admin work */
const userGetAdmin = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search;
    const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    const search = new RegExp(sanitizedSearchQuery, 'i');

    try {
        const totalUser = await UserModel.countDocuments();
        let totalPages = Math.ceil(totalUser / limit);
        const skip = (page - 1) * limit;

        if (searchQuery && search) {
            const isNumber = /^\d+$/.test(searchQuery);
            const query = {
                $or: [
                    { email: { $regex: search } },
                    { shop: { $regex: search } },
                    { uid: { $regex: search } },
                    { country: { $regex: search } },
                ],
            };

            if (isNumber) {
                query.$or.push({ number: { $regex: searchQuery } });
            }

            const user = await UserModel.find(query)
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit);

            totalPages = Math.ceil(user.length / limit);
            return res.status(200).json({ user, totalPages });
        }

        const user = await UserModel.find({})
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(201).json({ user, totalPages });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
}

const userUpdateAdmin = async (req, res) => {
    try {
        const { _id, approved } = req.body;
        const firebaseUser = await checkAuth(_id)
        const info = { approved: approved };
        let user = await UserModel.findOneAndUpdate({ _id: _id }, { $set: info }, {
            runValidators: true,
        })
        if (user) {
            console.log(user)
            const result = await getAuth().setCustomUserClaims(firebaseUser.uid, { ...firebaseUser.customClaims, approved: user.approved, shop: _id, role: user?.role })
            console.log(result)
            return res.status(200).json({ user })
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
}
const userDeleteAdmin = async (req, res) => {
    try {
        const { _id } = req.query;
        const firebaseUser = await checkAuth(_id)
        if (firebaseUser) {
            const userId = firebaseUser?.uid;
            const deleteFirebase = admin.auth().deleteUser(userId)
            if (deleteFirebase) {
                const user = await UserModel.deleteOne({ _id: _id })
                return res.status(201).json({ user })
            }
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
}
module.exports = {
    userSignup, userGetAdmin, userUpdateAdmin, userDeleteAdmin,
    /* user  */
    userGet,
    checkAuth,
    userUpdate
}