const roleModel = require("../models/RoleModel");

const getAllRoles = async (req,res) => {

    const roles = await roleModel.find()
    res.json({
        message: "role fetched successfully",
        data:roles
    });
};

const addRole = async(req,res) => {
 const savedRole = await roleModel.create(res.body)
   
    res.json({
        message: "role created",
        data:savedRole
    });
};

module.exports ={
    getAllRoles,addRole
};