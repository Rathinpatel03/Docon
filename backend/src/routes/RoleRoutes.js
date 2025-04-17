const routes = require("express").Router()
const roleController= require("../controllers/RoleController")

routes.get("/roles",roleController.getAllRoles)
routes.post("/role",roleController.addRole)
module.exports= routes