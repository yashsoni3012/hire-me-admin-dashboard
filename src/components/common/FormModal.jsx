// import { useState, useEffect } from 'react'
// import Modal from './Modal'
// import Button from './Button'
// import Input from './Input'
// import FileUpload from './FileUpload'

// const FormModal = ({
//     isOpen,
//     onClose,
//     onSubmit,
//     title,
//     fields = [],
//     initialData = {},
//     loading = false,
//     submitLabel = 'Save',
//     size = 'sm',
//     validationRules = {},
// }) => {
//     const [formData, setFormData] = useState(initialData)
//     const [errors, setErrors] = useState({})
//     const [touched, setTouched] = useState({})
//     const [fileUploads, setFileUploads] = useState({})

//     useEffect(() => {
//         if (isOpen) {
//             setFormData(initialData)
//             setErrors({})
//             setTouched({})
//             setFileUploads({})
//         }
//     }, [isOpen, initialData])

//     const validateField = (name, value) => {
//         const rules = validationRules[name]
//         if (!rules) return ''

//         if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
//             return rules.requiredMessage || `${name} is required`
//         }

//         if (rules.minLength && value && value.length < rules.minLength) {
//             return rules.minLengthMessage || `${name} must be at least ${rules.minLength} characters`
//         }

//         if (rules.maxLength && value && value.length > rules.maxLength) {
//             return rules.maxLengthMessage || `${name} must be at most ${rules.maxLength} characters`
//         }

//         if (rules.email && value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
//             return rules.emailMessage || 'Please enter a valid email address'
//         }

//         if (rules.pattern && value && !rules.pattern.test(value)) {
//             return rules.patternMessage || `${name} is invalid`
//         }

//         if (rules.custom && value) {
//             const customError = rules.custom(value, formData)
//             if (customError) return customError
//         }

//         return ''
//     }

//     const handleChange = (name, value) => {
//         // Handle file upload
//         if (value instanceof File || value === null) {
//             setFileUploads(prev => ({ ...prev, [name]: value }))
//         }

//         setFormData(prev => ({ ...prev, [name]: value }))
//         setTouched(prev => ({ ...prev, [name]: true }))

//         const error = validateField(name, value)
//         setErrors(prev => ({ ...prev, [name]: error }))
//     }

//     const handleBlur = (name) => {
//         setTouched(prev => ({ ...prev, [name]: true }))
//         const value = formData[name]
//         const error = validateField(name, value)
//         setErrors(prev => ({ ...prev, [name]: error }))
//     }

//     const validateForm = () => {
//         const newErrors = {}
//         let isValid = true

//         fields.forEach(field => {
//             const value = formData[field.name]
//             const error = validateField(field.name, value)
//             if (error) {
//                 newErrors[field.name] = error
//                 isValid = false
//             }
//         })

//         setErrors(newErrors)
//         setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}))
//         return isValid
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()

//         if (!validateForm()) {
//             const firstErrorField = document.querySelector('.field-error')
//             if (firstErrorField) {
//                 firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
//             }
//             return
//         }

//         // Prepare form data with files
//         const submitData = { ...formData }

//         // Add file uploads to form data
//         Object.keys(fileUploads).forEach(key => {
//             if (fileUploads[key] instanceof File) {
//                 submitData[`${key}File`] = fileUploads[key]
//             }
//         })

//         onSubmit(submitData)
//     }

//     const renderField = (field) => {
//         const value = formData[field.name] || ''
//         const error = errors[field.name]
//         const isTouched = touched[field.name]
//         const hasError = isTouched && !!error
//         const isDisabled = field.disabled || false

//         const commonProps = {
//             id: field.name,
//             name: field.name,
//             value: value,
//             onBlur: () => handleBlur(field.name),
//             disabled: isDisabled,
//             className: `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${hasError
//                     ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
//                     : 'border-gray-200 focus:ring-2 focus:ring-[#4529f7] focus:border-transparent'
//                 } ${isDisabled
//                     ? 'bg-gray-100 cursor-not-allowed'
//                     : 'bg-white'
//                 }`,
//         }

//         const labelClasses = `block text-sm font-medium text-gray-700 mb-1`

//         switch (field.type) {
//             case 'file':
//                 return (
//                     <div key={field.name} className="mb-4 field-error">
//                         <FileUpload
//                             label={field.label}
//                             required={field.required}
//                             accept={field.accept || "image/*"}
//                             maxSize={field.maxSize || 5}
//                             value={value}
//                             onChange={(file) => handleChange(field.name, file)}
//                             error={hasError ? error : ""}
//                             help={field.help}
//                             placeholder={field.placeholder || "Click or drag to upload"}
//                         />
//                     </div>
//                 )

//             case 'radio':
//                 return (
//                     <div key={field.name} className="mb-4">
//                         <label className={labelClasses}>
//                             {field.label}
//                             {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <div className="flex items-center gap-6">
//                             {field.options.map((option) => (
//                                 <label key={option.value} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="radio"
//                                         name={field.name}
//                                         value={option.value}
//                                         checked={value === option.value}
//                                         onChange={(e) => handleChange(field.name, e.target.value)}
//                                         onBlur={() => handleBlur(field.name)}
//                                         className={`w-4 h-4 border-gray-300 focus:ring-2 ${field.color || 'text-[#2c0eee] focus:ring-[#4529f7]'}`}
//                                     />
//                                     <span className="text-sm text-gray-700">{option.label}</span>
//                                 </label>
//                             ))}
//                         </div>
//                         {hasError && (
//                             <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
//                                 <span className="text-red-500">●</span> {error}
//                             </p>
//                         )}
//                     </div>
//                 )

//             case 'checkbox':
//                 return (
//                     <div key={field.name} className="mb-4">
//                         <label className="flex items-center gap-3 cursor-pointer">
//                             <input
//                                 type="checkbox"
//                                 checked={value}
//                                 onChange={(e) => handleChange(field.name, e.target.checked)}
//                                 onBlur={() => handleBlur(field.name)}
//                                 className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${field.color || 'text-[#2c0eee] focus:ring-[#4529f7]'}`}
//                             />
//                             <span className="text-sm font-medium text-gray-700">
//                                 {field.label}
//                                 {field.required && <span className="text-red-500 ml-1">*</span>}
//                             </span>
//                         </label>
//                         {field.help && (
//                             <p className="text-xs text-gray-400 mt-1 ml-7">{field.help}</p>
//                         )}
//                         {hasError && (
//                             <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 ml-7">
//                                 <span className="text-red-500">●</span> {error}
//                             </p>
//                         )}
//                     </div>
//                 )

//             case 'select':
//                 return (
//                     <div key={field.name} className="mb-4 field-error">
//                         <label className={labelClasses}>
//                             {field.label}
//                             {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <select
//                             {...commonProps}
//                             onChange={(e) => handleChange(field.name, e.target.value)}
//                         >
//                             <option value="">Select {field.label}</option>
//                             {field.options.map((option) => (
//                                 <option key={option.value} value={option.value}>
//                                     {option.label}
//                                 </option>
//                             ))}
//                         </select>
//                         {hasError && (
//                             <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
//                                 <span className="text-red-500">●</span> {error}
//                             </p>
//                         )}
//                         {field.help && !hasError && (
//                             <p className="mt-1 text-xs text-gray-400">{field.help}</p>
//                         )}
//                     </div>
//                 )

//             case 'textarea':
//                 return (
//                     <div key={field.name} className="mb-4 field-error">
//                         <label className={labelClasses}>
//                             {field.label}
//                             {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <textarea
//                             {...commonProps}
//                             rows={field.rows || 3}
//                             placeholder={field.placeholder}
//                             onChange={(e) => handleChange(field.name, e.target.value)}
//                         />
//                         {hasError && (
//                             <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
//                                 <span className="text-red-500">●</span> {error}
//                             </p>
//                         )}
//                         {field.help && !hasError && (
//                             <p className="mt-1 text-xs text-gray-400">{field.help}</p>
//                         )}
//                     </div>
//                 )

//             default:
//                 return (
//                     <div key={field.name} className="mb-4 field-error">
//                         <label className={labelClasses}>
//                             {field.label}
//                             {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <input
//                             {...commonProps}
//                             type={field.type || 'text'}
//                             placeholder={field.placeholder}
//                             onChange={(e) => handleChange(field.name, e.target.value)}
//                         />
//                         {hasError && (
//                             <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
//                                 <span className="text-red-500">●</span> {error}
//                             </p>
//                         )}
//                         {field.help && !hasError && (
//                             <p className="mt-1 text-xs text-gray-400">{field.help}</p>
//                         )}
//                     </div>
//                 )
//         }
//     }

//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 {fields.map((field) => renderField(field))}

//                 <div className="flex gap-3 pt-2 border-t border-gray-100 mt-4">
//                     <Button
//                         type="button"
//                         variant="secondary"
//                         className="flex-1"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         type="submit"
//                         className="flex-1"
//                         loading={loading}
//                     >
//                         {submitLabel}
//                     </Button>
//                 </div>
//             </form>
//         </Modal>
//     )
// }

// export default FormModal



import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import FileUpload from './FileUpload'

const FormModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    fields = [],
    initialData = {},
    loading = false,
    submitLabel = 'Save',
    size = 'sm',
    validationRules = {},
    existingFile = null,
    existingImage = null, // Add this prop for existing image preview
}) => {
    const [formData, setFormData] = useState(initialData)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [fileUploads, setFileUploads] = useState({})
    const [imagePreview, setImagePreview] = useState(existingImage)
    const [pdfFileInfo, setPdfFileInfo] = useState(null)

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData)
            setErrors({})
            setTouched({})
            setFileUploads({})
            setImagePreview(existingImage)
            if (existingFile && typeof existingFile === 'string') {
                // Extract filename from URL
                const fileName = existingFile.split('/').pop() || 'Current PDF'
                setPdfFileInfo({ name: fileName, url: existingFile })
            } else {
                setPdfFileInfo(null)
            }
        }
    }, [isOpen, initialData, existingImage])

    const validateField = (name, value) => {
        const rules = validationRules[name]
        if (!rules) return ''

        if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
            return rules.requiredMessage || `${name} is required`
        }

        if (rules.minLength && value && value.length < rules.minLength) {
            return rules.minLengthMessage || `${name} must be at least ${rules.minLength} characters`
        }

        if (rules.maxLength && value && value.length > rules.maxLength) {
            return rules.maxLengthMessage || `${name} must be at most ${rules.maxLength} characters`
        }

        if (rules.email && value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return rules.emailMessage || 'Please enter a valid email address'
        }

        if (rules.pattern && value && !rules.pattern.test(value)) {
            return rules.patternMessage || `${name} is invalid`
        }

        if (rules.custom && value) {
            const customError = rules.custom(value, formData)
            if (customError) return customError
        }

        return ''
    }

    const handleChange = (name, value) => {
        // Handle file upload
        if (value instanceof File) {
            setFileUploads(prev => ({ ...prev, [name]: value }))
            // Create preview for image files
            if (value.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    setImagePreview(event.target.result)
                }
                reader.readAsDataURL(value)
            }
            else if (value.type === 'application/pdf') {
                // CHANGE 4: Handle PDF file info
                setPdfFileInfo({ name: value.name, size: value.size })
            }
        } else if (value === null) {
            // Handle file removal
            setFileUploads(prev => ({ ...prev, [name]: null }))
            setImagePreview(null)
            setPdfFileInfo(null)
        }

        setFormData(prev => ({ ...prev, [name]: value }))
        setTouched(prev => ({ ...prev, [name]: true }))

        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }))
        const value = formData[name]
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const validateForm = () => {
        const newErrors = {}
        let isValid = true

        fields.forEach(field => {
            const value = formData[field.name]
            const error = validateField(field.name, value)
            if (error) {
                newErrors[field.name] = error
                isValid = false
            }
        })

        setErrors(newErrors)
        setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}))
        return isValid
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            const firstErrorField = document.querySelector('.field-error')
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            return
        }

        // Prepare form data with files
        const submitData = { ...formData }

        // Add file uploads to form data
        Object.keys(fileUploads).forEach(key => {
            if (fileUploads[key] instanceof File) {
                submitData[`${key}File`] = fileUploads[key]
            }
        })

        onSubmit(submitData)
    }
    const getFileTypeLabel = (fileName) => {
        if (!fileName) return 'File'
        const ext = fileName.split('.').pop()?.toLowerCase()
        if (ext === 'pdf') return 'PDF Document'
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return 'Image'
        return 'File'
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return ''
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
    const renderField = (field) => {
        const value = formData[field.name] || ''
        const error = errors[field.name]
        const isTouched = touched[field.name]
        const hasError = isTouched && !!error
        const isDisabled = field.disabled || false

        // Check if this is a file field with existing image
        const isFileField = field.type === 'file'
        const existingImageUrl = field.existingImage || (isFileField && imagePreview)
        const hasExistingFile = field.existingFile || existingFile || (isFileField && pdfFileInfo)

        const commonProps = {
            id: field.name,
            name: field.name,
            value: value,
            onBlur: () => handleBlur(field.name),
            disabled: isDisabled,
            className: `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${hasError
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-200 focus:ring-2 focus:ring-[#4529f7] focus:border-transparent'
                } ${isDisabled
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'bg-white'
                }`,
        }

        const labelClasses = `block text-sm font-medium text-gray-700 mb-1`

        switch (field.type) {
            case 'file':
                // return (
                //     <div key={field.name} className="mb-4 field-error">
                //         <FileUpload
                //             label={field.label}
                //             required={field.required}
                //             accept={field.accept || "image/*"}
                //             maxSize={field.maxSize || 5}
                //             value={value}
                //             existingImage={existingImageUrl}
                //             onChange={(file) => handleChange(field.name, file)}
                //             error={hasError ? error : ""}
                //             help={field.help}
                //             placeholder={field.placeholder || "Click or drag to upload"}
                //         />
                //     </div>
                // )

                return (
                    <div key={field.name} className="mb-4 field-error">
                        {/* CHANGE 10: Show existing file preview for PDFs and other files */}
                        {hasExistingFile && !value && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-[#4529f7]">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        {typeof hasExistingFile === 'string' && hasExistingFile.endsWith('.pdf') ? (
                                            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700">
                                            {getFileTypeLabel(pdfFileInfo?.name || hasExistingFile)}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="truncate">
                                                {pdfFileInfo?.name || (typeof hasExistingFile === 'string' ? hasExistingFile.split('/').pop() : 'Current File')}
                                            </span>
                                            {pdfFileInfo?.size && (
                                                <span>• {formatFileSize(pdfFileInfo.size)}</span>
                                            )}
                                        </div>
                                        <a
                                            href={typeof hasExistingFile === 'string' ? hasExistingFile : existingFile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-1 text-xs text-[#2c0eee] hover:text-[#2c0eee] hover:underline"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            View Current File
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // CHANGE 11: Clear the existing file when user wants to remove it
                                            handleChange(field.name, null)
                                            setPdfFileInfo(null)
                                            // Also clear the field value in formData
                                            setFormData(prev => ({ ...prev, [field.name]: null }))
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove current file (will keep it)"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CHANGE 12: Show selected file info */}
                        {value && value instanceof File && (
                            <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        {value.type === 'application/pdf' ? (
                                            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        ) : value.type.startsWith('image/') ? (
                                            <svg className="w-10 h-10 text-[#4529f7]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-green-700">New file selected</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="truncate">{value.name}</span>
                                            <span>• {formatFileSize(value.size)}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleChange(field.name, null)
                                            setFormData(prev => ({ ...prev, [field.name]: null }))
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CHANGE 13: File upload input with proper styling */}
                        <div className="relative">
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${hasError
                                ? 'border-red-300 bg-red-50 hover:bg-red-100'
                                : hasExistingFile || value
                                    ? 'border-green-300 bg-green-50 hover:bg-green-100'
                                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                }`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {field.accept || 'Any file'} (Max {field.maxSize || 5}MB)
                                    </p>
                                    {hasExistingFile && !value && (
                                        <p className="text-xs text-[#4529f7] mt-1">Current file will be replaced</p>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept={field.accept || "*/*"}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null
                                        handleChange(field.name, file)
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>
                        </div>

                        {hasError && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <span className="text-red-500">●</span> {error}
                            </p>
                        )}
                        {field.help && !hasError && (
                            <p className="mt-1 text-xs text-gray-400">{field.help}</p>
                        )}
                    </div>
                )

            case 'radio':
                return (
                    <div key={field.name} className="mb-4">
                        <label className={labelClasses}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="flex items-center gap-6">
                            {field.options.map((option) => (
                                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={field.name}
                                        value={option.value}
                                        checked={value === option.value}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        onBlur={() => handleBlur(field.name)}
                                        className={`w-4 h-4 border-gray-300 focus:ring-2 ${field.color || 'text-[#2c0eee] focus:ring-[#4529f7]'}`}
                                    />
                                    <span className="text-sm text-gray-700">{option.label}</span>
                                </label>
                            ))}
                        </div>
                        {hasError && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <span className="text-red-500">●</span> {error}
                            </p>
                        )}
                    </div>
                )

            case 'checkbox':
                return (
                    <div key={field.name} className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                                onBlur={() => handleBlur(field.name)}
                                className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${field.color || 'text-[#2c0eee] focus:ring-[#4529f7]'}`}
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                        </label>
                        {field.help && (
                            <p className="text-xs text-gray-400 mt-1 ml-7">{field.help}</p>
                        )}
                        {hasError && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 ml-7">
                                <span className="text-red-500">●</span> {error}
                            </p>
                        )}
                    </div>
                )

            case 'select':
                return (
                    <div key={field.name} className="mb-4 field-error">
                        <label className={labelClasses}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                            {...commonProps}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {hasError && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <span className="text-red-500">●</span> {error}
                            </p>
                        )}
                        {field.help && !hasError && (
                            <p className="mt-1 text-xs text-gray-400">{field.help}</p>
                        )}
                    </div>
                )

            case 'textarea':
                return (
                    <div key={field.name} className="mb-4 field-error">
                        <label className={labelClasses}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            {...commonProps}
                            rows={field.rows || 3}
                            placeholder={field.placeholder}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                        {hasError && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <span className="text-red-500">●</span> {error}
                            </p>
                        )}
                        {field.help && !hasError && (
                            <p className="mt-1 text-xs text-gray-400">{field.help}</p>
                        )}
                    </div>
                )

            default:
                return (
                    <div key={field.name} className="mb-4 field-error">
                        <label className={labelClasses}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            {...commonProps}
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                        {hasError && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <span className="text-red-500">●</span> {error}
                            </p>
                        )}
                        {field.help && !hasError && (
                            <p className="mt-1 text-xs text-gray-400">{field.help}</p>
                        )}
                    </div>
                )
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => renderField(field))}

                <div className="flex gap-3 pt-2 border-t border-gray-100 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        loading={loading}
                    >
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default FormModal