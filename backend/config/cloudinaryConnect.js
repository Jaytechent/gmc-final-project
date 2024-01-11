const cloudinary = require("cloudinary").v2;

const connectToCloudinary = () => {
  return cloudinary.config({
    cloud_name: "dkpw7sieh",
    api_key: "564558243798843",
    api_secret: "RwnxFaBHA3fed5CEBmBU_3cHR2w",
  });
};

module.exports = { connectToCloudinary };
