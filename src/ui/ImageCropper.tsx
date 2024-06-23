import {Cropper, CropperRef} from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import {useState} from "react";


export default function ImageCropper({className, src, onCrop}: { className?:string, src: string, onCrop: (blob: Blob) => void }) {
    const [originalImage] = useState<string | null>(src)

    const onChange = (cropper: CropperRef) => {
        const canvas = cropper.getCanvas()
        canvas?.toBlob((blob) => {
                if (blob) {
                    onCrop(blob)
                }
            }
        )
    }

    return (
        <Cropper

            className={className}
            src={originalImage}
            onChange={onChange}
            stencilProps={{
                aspectRatio: 16/9,
                resizeable: false
            }
            }
        />
    )
}