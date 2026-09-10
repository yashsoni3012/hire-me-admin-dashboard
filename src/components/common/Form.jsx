import React from "react";
import Button from "./Button";
import { MdClose } from "react-icons/md";

const Form = ({
  title,
  subtitle,
  children,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  icon: Icon,
  className = "",
  isEdit = false,
  showCancel = true,
  formRef,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
    >
      {/* Header */}
      {(title || subtitle || Icon) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5">
            {Icon && (
              <div className="w-11 h-11 rounded-2xl bg-[#2c0eee] flex items-center justify-center text-white shadow-lg shadow-[#4529f7]">
                <Icon size={24} />
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-xl font-bold text-gray-900">
                  {isEdit ? `Edit ${title}` : `Add ${title}`}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {onCancel && showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <MdClose size={20} />
            </button>
          )}
        </div>
      )}

      {/* Form */}
      <form ref={formRef} onSubmit={onSubmit} {...props}>
        {children}

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-100 mt-6">
          <Button type="submit" loading={loading} variant="primary">
            {loading ? "Saving..." : isEdit ? "Update" : submitLabel}
          </Button>
          {onCancel && showCancel && (
            <Button variant="secondary" type="button" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
