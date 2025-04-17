const cloundinary = require("cloudinary").v2;


const uploadFileToCloudinary = async (file) => {

        cloundinary.config({
        cloud_name:"",
        api_key:"",
        api_secret:""
    })

    const cloundinaryResponse = await cloundinary.uploader.upload(file.path);
    return cloundinaryResponse;



};
module.exports = {
    uploadFileToCloudinary
}