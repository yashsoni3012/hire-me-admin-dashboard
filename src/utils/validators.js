export const required = (v) => !v ? 'This field is required' : undefined
export const email = (v) => v && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v) ? 'Enter a valid email' : undefined
export const minLength = (min) => (v) => v && v.length < min ? `Min ${min} characters required` : undefined
export const maxLength = (max) => (v) => v && v.length > max ? `Max ${max} characters allowed` : undefined
export const phone = (v) => v && !/^[6-9]\d{9}$/.test(v) ? 'Enter a valid 10-digit phone number' : undefined
