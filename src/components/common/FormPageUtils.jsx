// components/common/FormPageUtils.jsx
import React from 'react';

// Status badge component for view mode
export const ViewBadge = ({ active, activeLabel = "Active", inactiveLabel = "Inactive", className = "" }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
            } ${className}`}
    >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? "bg-green-500" : "bg-gray-400"}`} />
        {active ? activeLabel : inactiveLabel}
    </span>
);

// Trending badge component for view mode
export const ViewTrendingBadge = ({ isTrending, className = "" }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isTrending ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"
            } ${className}`}
    >
        {isTrending ? "⭐ Trending" : "Not Trending"}
    </span>
);

// Image preview component
export const ImagePreview = ({ src, alt = "Image", className = "", onClick = null }) => {
    if (!src) return null;
    return (
        <div className={`relative group cursor-pointer ${className}`}>
            <img
                src={src}
                alt={alt}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">📄</div>';
                }}
            />
            {onClick && (
                <button
                    onClick={onClick}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
                >
                    <span className="text-sm">View</span>
                </button>
            )}
        </div>
    );
};

// Section divider
export const FormSection = ({ title, children, className = "" }) => (
    <div className={`mb-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h3>
        {children}
    </div>
);

// Helper to format file size
export const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Helper to get file type icon
export const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return '🖼️';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['mp4', 'avi', 'mov'].includes(ext)) return '🎬';
    if (['mp3', 'wav'].includes(ext)) return '🎵';
    return '📄';
};