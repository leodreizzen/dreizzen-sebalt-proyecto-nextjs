
import React, {useMemo} from 'react'
import {Accept, useDropzone} from 'react-dropzone'


const baseStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export default function FileDropzone({drop, accept}: {drop: (files: File) => void, accept: Accept}) {
    const allowedExtensions = Object.values(accept).flat();


    function onDrop(files: File[]) {
        const allowedFiles = files.filter(file => allowedExtensions.includes("." + file.name.split('.').pop()!))
        if(allowedFiles.length > 0)
            drop(allowedFiles[0])
    }

    const {getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, isDragActive} = useDropzone({onDropAccepted: files => onDrop(files), accept: accept})

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <div {...getRootProps({style})}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drop your files here, or click to select files</p>
            }
        </div>
    )
}