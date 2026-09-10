// import React, { useState, useRef } from "react";
// import { MdCloudUpload, MdClose, MdInsertPhoto } from "react-icons/md";

// const FileUpload = ({
//     value,
//     onChange,
//     label = "Upload File",
//     accept = "image/*",
//     maxSize = 5, // MB
//     preview = true,
//     className = "",
//     error = "",
//     required = false,
//     help = "",
//     placeholder = "Click or drag to upload",
// }) => {
//     const [dragActive, setDragActive] = useState(false);
//     const [fileError, setFileError] = useState("");
//     const inputRef = useRef(null);

//     const handleFileChange = (file) => {
//         setFileError("");

//         if (!file) {
//             onChange(null);
//             return;
//         }

//         // Check file size
//         if (file.size > maxSize * 1024 * 1024) {
//             setFileError(`File size must be less than ${maxSize}MB`);
//             return;
//         }

//         // Check file type
//         if (accept && !file.type.match(accept.replace(/\*/g, '.*'))) {
//             setFileError(`File type not supported. Please upload ${accept}`);
//             return;
//         }

//         onChange(file);
//     };

//     const handleDrag = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (e.type === "dragenter" || e.type === "dragover") {
//             setDragActive(true);
//         } else if (e.type === "dragleave") {
//             setDragActive(false);
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);

//         const files = e.dataTransfer.files;
//         if (files && files[0]) {
//             handleFileChange(files[0]);
//         }
//     };

//     const handleClick = () => {
//         inputRef.current?.click();
//     };

//     const handleRemove = () => {
//         onChange(null);
//         if (inputRef.current) {
//             inputRef.current.value = "";
//         }
//     };

//     const getFilePreview = () => {
//         if (!value) return null;
//         if (typeof value === "string") {
//             return value;
//         }
//         if (value instanceof File) {
//             return URL.createObjectURL(value);
//         }
//         return null;
//     };

//     const isFileObject = value instanceof File;
//     const previewUrl = getFilePreview();

//     return (
//         <div className={`${className}`}>
//             {label && (
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {label}
//                     {required && <span className="text-red-500 ml-1">*</span>}
//                 </label>
//             )}

//             {previewUrl ? (
//                 <div className="relative inline-block">
//                     <div className="relative group">
//                         <img
//                             src={previewUrl}
//                             alt="Upload preview"
//                             className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
//                         />
//                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
//                             <button
//                                 type="button"
//                                 onClick={handleClick}
//                                 className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors"
//                                 title="Change image"
//                             >
//                                 <MdInsertPhoto size={16} />
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={handleRemove}
//                                 className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-colors"
//                                 title="Remove image"
//                             >
//                                 <MdClose size={16} />
//                             </button>
//                         </div>
//                     </div>
//                     {isFileObject && (
//                         <p className="text-xs text-gray-400 mt-1">
//                             {value.name} ({(value.size / 1024).toFixed(1)} KB)
//                         </p>
//                     )}
//                 </div>
//             ) : (
//                 <div
//                     onClick={handleClick}
//                     onDragEnter={handleDrag}
//                     onDragLeave={handleDrag}
//                     onDragOver={handleDrag}
//                     onDrop={handleDrop}
//                     className={`
//             relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
//             transition-colors duration-200
//             ${dragActive ? "border-[#2c0eee] bg-blue-50" : "border-gray-300 hover:border-gray-400"}
//             ${error || fileError ? "border-red-500 bg-red-50" : ""}
//           `}
//                 >
//                     <input
//                         ref={inputRef}
//                         type="file"
//                         accept={accept}
//                         onChange={(e) => {
//                             if (e.target.files && e.target.files[0]) {
//                                 handleFileChange(e.target.files[0]);
//                             }
//                         }}
//                         className="hidden"
//                     />

//                     <div className="flex flex-col items-center gap-2">
//                         <MdCloudUpload
//                             size={40}
//                             className={dragActive ? "text-[#2c0eee]" : "text-gray-400"}
//                         />
//                         <p className="text-sm text-gray-600">
//                             {dragActive ? "Drop your file here" : placeholder}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                             {accept.replace(/\*/g, '').toUpperCase()} up to {maxSize}MB
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {(error || fileError) && (
//                 <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
//                     <span className="text-red-500">●</span> {error || fileError}
//                 </p>
//             )}

//             {help && !error && !fileError && (
//                 <p className="mt-1 text-xs text-gray-400">{help}</p>
//             )}
//         </div>
//     );
// };

// export default FileUpload;


import React, { useState, useRef } from "react";
import { MdCloudUpload, MdClose, MdInsertPhoto } from "react-icons/md";

const FileUpload = ({
    value,
    onChange,
    label = "Upload File",
    accept = "image/*",
    maxSize = 5, // MB
    preview = true,
    className = "",
    error = "",
    required = false,
    help = "",
    placeholder = "Click or drag to upload",
    existingImage = null, // Add this prop
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileError, setFileError] = useState("");
    const [previewUrl, setPreviewUrl] = useState(existingImage);
    const inputRef = useRef(null);

    const handleFileChange = (file) => {
        setFileError("");

        if (!file) {
            onChange(null);
            setPreviewUrl(existingImage || null);
            return;
        }

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            setFileError(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Check file type
        if (accept && !file.type.match(accept.replace(/\*/g, '.*'))) {
            setFileError(`File type not supported. Please upload ${accept}`);
            return;
        }

        // Create preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        }

        onChange(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileChange(files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemove = () => {
        onChange(null);
        setPreviewUrl(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const isFileObject = value instanceof File;
    const displayPreview = previewUrl || (isFileObject ? URL.createObjectURL(value) : null);

    return (
        <div className={`${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {displayPreview ? (
                <div className="relative inline-block">
                    <div className="relative group">
                        <img
                            src={displayPreview}
                            alt="Upload preview"
                            className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors"
                                title="Change image"
                            >
                                <MdInsertPhoto size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-colors"
                                title="Remove image"
                            >
                                <MdClose size={16} />
                            </button>
                        </div>
                    </div>
                    {isFileObject && (
                        <p className="text-xs text-gray-400 mt-1">
                            {value.name} ({(value.size / 1024).toFixed(1)} KB)
                        </p>
                    )}
                    {existingImage && !isFileObject && (
                        <p className="text-xs text-gray-400 mt-1">Current image</p>
                    )}
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
            transition-colors duration-200
            ${dragActive ? "border-[#2c0eee] bg-blue-50" : "border-gray-300 hover:border-gray-400"}
            ${error || fileError ? "border-red-500 bg-red-50" : ""}
          `}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFileChange(e.target.files[0]);
                            }
                        }}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center gap-2">
                        <MdCloudUpload
                            size={40}
                            className={dragActive ? "text-[#2c0eee]" : "text-gray-400"}
                        />
                        <p className="text-sm text-gray-600">
                            {dragActive ? "Drop your file here" : placeholder}
                        </p>
                        <p className="text-xs text-gray-400">
                            {accept.replace(/\*/g, '').toUpperCase()} up to {maxSize}MB
                        </p>
                    </div>
                </div>
            )}

            {(error || fileError) && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span className="text-red-500">●</span> {error || fileError}
                </p>
            )}

            {help && !error && !fileError && (
                <p className="mt-1 text-xs text-gray-400">{help}</p>
            )}
        </div>
    );
};

export default FileUpload;