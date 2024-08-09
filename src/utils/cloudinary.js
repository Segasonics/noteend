import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });
    
    // Upload an image

    const uploadOnCloudinary=async(localeFilePath)=>{
       try {
         if(!localeFilePath) return null;
      const result = await cloudinary.uploader
        .upload(
            localeFilePath,{
             resource_type:"auto"
            }
        )
        console.log("Cloudinary result",result.url)
        fs.unlinkSync(localeFilePath)
        return result
       } catch (error) {
        fs.unlinkSync(localeFilePath)
        return null;
       }
      
    }
    
    export { uploadOnCloudinary}