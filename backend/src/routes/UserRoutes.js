const routes = require("express").Router()

const userController = require("../controllers/UserController")

routes.post("/user",userController.signup);
routes.get("/users",userController.getAllUsers);
routes.delete("/user/:id",userController.deleteUserById);
routes.post("/user/login",userController.loginUser);
routes.get("/users/role/:roleId", userController.getUsersByRoleId);
routes.post('/forgotpassword', userController.forgotPassword);
routes.get('/users/:id', userController.getUserById);

routes.post("/user/resetpassword",userController.resetpassword);

module.exports = routes