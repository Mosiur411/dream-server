const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { getAuth } = require("firebase-admin/auth");
const admin = require('firebase-admin');
const { EmployeeModel } = require("../model/employee.model");

const checkAuthEmployee = async (_id) => {
    try {
        const user = await EmployeeModel.findById(_id)
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

const employeeSignup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const createAccount = await admin.auth().createUser({
            email: email,
            password: password,
        })
        if (createAccount?.uid) {
            const user = await EmployeeModel({ ...req.body, uid: createAccount.uid, role: 'employee', shop_id: '6473fc5a588aeda1918dc642' })
            await user.save()
            return res.status(200).json({ user })
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const employeeUpdate = async (req, res) => {
    try {
        const { _id, approved } = req.body;
        const firebaseUser = await checkAuthEmployee(_id)
        const info = { approved: approved };
        let user = await EmployeeModel.updateMany({ _id: _id }, { $set: info }, {
            runValidators: true,
        })
        if (user) {
            await getAuth().setCustomUserClaims(firebaseUser.uid, { ...firebaseUser.customClaims, approved: user.approved, _id: _id, shop_id: user?.shop_id })
            return res.status(200).json({ user })
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
}

module.exports = { employeeSignup, employeeUpdate }