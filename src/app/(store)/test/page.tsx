"use client"
import {uploadFeaturedTagImage} from "@/lib/clientActions";

export default function Page() {

    // function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    //     if(event.target.files !== null)
    //         uploadFeaturedTagImage({file: event.target.files[0], alt:""}).then(console.log)
    // }

    return (
        <div className="w-full h-full">
            {/*<input type="file" onChange={handleChange}/>*/}
        </div>
    )
}