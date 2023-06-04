const { default: mongoose } = require("mongoose");
const { UserModel } = require("../../../model/user.model");
const { Roles } = require("../../../utils/constants");

const userAdminRole = async (req, res) => {
    const email = req.query
    if (!email) return res.status(401).json({ error: 'Unauthorized User' })
    const user = await UserModel.findOne(email);
    const result = user?.role === Roles.ADMIN
    return res.status(200).json(result)

}
module.exports = { userAdminRole }