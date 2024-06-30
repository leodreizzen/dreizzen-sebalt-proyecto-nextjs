import { Cloudinary } from "@cloudinary/url-gen/index";

export default function getCloudinary(){
    return new Cloudinary({
        cloud: {
            cloudName: "dsafymqfc"
        }
    })
}