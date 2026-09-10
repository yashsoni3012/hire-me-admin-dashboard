
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import { Editor } from "@tinymce/tinymce-react";
// import FormPage from "../../components/common/FormPage";
// import { ViewBadge } from "../../components/common/FormPageUtils";
// import { cmsPageService } from "../../services/cmsPage.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";
// import { useAuth } from "../../context/AuthContext";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// // TinyMCE cloud API key (same as AddBlog.jsx)
// const TINYMCE_API_KEY = "bm6x4a0l27d8s6wee3a7ischv36uaemzvva438l0m6llfl6d";

// // ─── Static Page Type options ───────────────────────────────────
// const PAGE_TYPE_OPTIONS = [
//   { value: "static_page", label: "Static Page" },
//   { value: "legal_page", label: "Legal Page" },
//   { value: "help_page", label: "Help Page" },
//   { value: "faq_page", label: "FAQ Page" },
//   { value: "landing_page", label: "Landing Page" },
// ];

// const getPageTypeLabel = (value) => {
//   if (!value) return "—";
//   const match = PAGE_TYPE_OPTIONS.find((opt) => opt.value === value);
//   return match ? match.label : value;
// };

// // Helper to generate slug from title (spaces → hyphens, lowercased, safe)
// const generateSlugFromTitle = (title) => {
//   if (!title) return "";
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "") // remove special chars except space and hyphen
//     .replace(/\s+/g, "-") // spaces → hyphens
//     .replace(/-+/g, "-") // collapse multiple hyphens
//     .replace(/^-|-$/g, "") // trim leading/trailing hyphens
//     .substring(0, 100);
// };

// // Helper to generate slug (fallback, same as above)
// const generateSlug = generateSlugFromTitle;

// // Helper to get full image URL
// const getFullImageUrl = (value) => {
//   if (!value) return null;
//   if (typeof value === "object") {
//     return getFullImageUrl(
//       value.url || value.uri || value.path || value.image || value.banner_image,
//     );
//   }
//   if (typeof value !== "string") return null;
//   if (value.startsWith("http") || value.startsWith("data:image")) return value;
//   if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
//   if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
//   return value;
// };

// const normalizeBannerImage = (value) => {
//   if (!value) return null;
//   if (value instanceof File) return value;
//   if (typeof value === "string") return value.trim() || null;
//   if (typeof value === "object") {
//     return normalizeBannerImage(
//       value.url ||
//         value.uri ||
//         value.path ||
//         value.image ||
//         value.banner_image ||
//         value.file,
//     );
//   }
//   return null;
// };

// const CmsContentView = ({ value }) => {
//   const [viewMode, setViewMode] = useState("text");
//   const content = value || "";

//   return (
//     <div className="space-y-3">
//       <div className="flex gap-1 p-1 w-fit bg-gray-100 rounded-lg">
//         {[
//           ["text", "Text"],
//           ["html", "HTML"],
//         ].map(([tab, label]) => (
//           <button
//             key={tab}
//             type="button"
//             onClick={() => setViewMode(tab)}
//             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
//               viewMode === tab
//                 ? "bg-white text-indigo-600 shadow-sm"
//                 : "text-gray-600 hover:text-gray-900"
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {viewMode === "text" ? (
//         <div
//           className="prose prose-sm max-w-none"
//           dangerouslySetInnerHTML={{ __html: content || "—" }}
//         />
//       ) : (
//         <pre className="w-full min-h-[220px] p-4 overflow-auto whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-700">
//           {content || "<!-- No HTML content -->"}
//         </pre>
//       )}
//     </div>
//   );
// };

// const CmsPageForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const { user } = useAuth();
//   const userId = user?.id;

//   const [mode, setMode] = useState("add");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [userNameCache, setUserNameCache] = useState({});
//   const [pageLoading, setPageLoading] = useState(false);

//   // ─── Slug manual edit flag ──────────────────────────────────────
//   const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

//   // ─── TinyMCE state ──────────────────────────────────────────────
//   const [editorMode, setEditorMode] = useState("rich");
//   const [tinyMceError, setTinyMceError] = useState(false);
//   const editorRef = useRef(null);

//   // ─── Refs for slug communication between page_name and page_slug ──
//   const slugOnChangeRef = useRef(null);
//   const slugValueRef = useRef(null);

//   // ─── Determine mode ─────────────────────────────────────────────
//   useEffect(() => {
//     const path = location.pathname;
//     if (path.includes("/view/")) setMode("view");
//     else if (path.includes("/edit/")) setMode("edit");
//     else setMode("add");
//   }, [location.pathname]);

//   // Reset editor UI whenever record changes
//   useEffect(() => {
//     setEditorMode("rich");
//     setTinyMceError(false);
//     setSlugManuallyEdited(false);
//   }, [mode, id]);

//   // ─── Load users ─────────────────────────────────────────────────
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((id) => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);
//       } catch (error) {
//         console.error("Failed to load users:", error);
//       }
//     };
//     loadUsers();
//   }, []);

//   // ─── Fetch data for edit/view ──────────────────────────────────
//   useEffect(() => {
//     const fetchData = async () => {
//       if ((mode === "edit" || mode === "view") && id) {
//         setPageLoading(true);
//         setData(null);
//         try {
//           let item = location.state?.item;
//           if (!item) {
//             const response = await cmsPageService.getById(id);
//             item = response?.data?.data || response?.data;
//           }
//           if (!item) throw new Error("Page not found");

//           const normalizedData = {
//             id: item.id,
//             page_name: item.page_name || "",
//             page_slug: item.page_slug || "",
//             page_type: item.page_type || "",
//             short_description: item.short_description || "",
//             page_title: item.page_title || "",
//             meta_title: item.meta_title || "",
//             meta_description: item.meta_description || "",
//             meta_keywords: item.meta_keywords || "",
//             banner_image: normalizeBannerImage(item.banner_image),
//             banner_title: item.banner_title || "",
//             banner_subtitle: item.banner_subtitle || "",
//             banner_CTA_button: item.banner_CTA_button || "",
//             content: item.content || "",
//             status: item.status !== undefined ? item.status : 1,
//             is_menu_visible:
//               item.is_menu_visible !== undefined ? item.is_menu_visible : 1,
//             is_footer_visible:
//               item.is_footer_visible !== undefined ? item.is_footer_visible : 1,
//             display_order: item.display_order || 0,
//             created_at: item.created_at || null,
//             updated_at: item.updated_at || null,
//             created_by: item.created_by || null,
//             updated_by: item.updated_by || null,
//           };
//           setData(normalizedData);
//         } catch (error) {
//           console.error("Fetch error:", error);
//           showError("Failed to load CMS page");
//           navigate("/cms-pages");
//         } finally {
//           setPageLoading(false);
//         }
//       }
//     };
//     fetchData();
//   }, [id, mode, location.state, navigate]);

//   // ─── User name helper ──────────────────────────────────────────
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     if (user?.id && Number(user.id) === Number(userId)) return "You";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   const syncEditorContent = (nextValue) => {
//     if (
//       editorRef.current &&
//       typeof editorRef.current.setContent === "function"
//     ) {
//       editorRef.current.setContent(nextValue || "", { format: "html" });
//     }
//   };

//   const changeEditorMode = (nextMode, value, onChange) => {
//     if (nextMode === "html" && editorRef.current) {
//       const currentHtml = editorRef.current.getContent();
//       const currentValue = value || "";
//       if (currentHtml !== currentValue) {
//         onChange(currentHtml);
//       }
//     }

//     if (nextMode === "rich") {
//       setTinyMceError(false);
//       if (editorRef.current) {
//         syncEditorContent(value || "");
//       }
//     }

//     setEditorMode(nextMode);
//   };

//   // ─── Slug auto-generation helper ───────────────────────────────
//   // This will be used inside the `render` of the page_name field
//   const handlePageNameChange = (value, slugOnChange, slugValue) => {
//     // Update the slug only if the user hasn't manually edited it
//     if (!slugManuallyEdited) {
//       const newSlug = generateSlugFromTitle(value);
//       // Only update if different to avoid loops
//       if (newSlug !== slugValue) {
//         slugOnChange(newSlug);
//       }
//     }
//   };

//   // ─── Define fields ──────────────────────────────────────────────
//   const getFields = () => {
//     // ─── Base fields ─────────────────────────────────────────────
//     const baseFields = [
//       {
//         name: "page_name",
//         label: "Page Name",
//         type: "custom",
//         required: true,
//         placeholder: "e.g. About Us",
//         help: "Enter a unique name for the page. Slug will auto-generate.",
//         viewRender: (value) => (
//           <span className="font-medium text-lg">{value}</span>
//         ),
//         render: ({ value, onChange }) => {
//           // In view mode, show plain text
//           if (mode === "view") {
//             return <span className="font-medium text-lg">{value}</span>;
//           }
//           // In add/edit, render input with auto-slug generation
//           return (
//             <input
//               type="text"
//               value={value || ""}
//               onChange={(e) => {
//                 const newVal = e.target.value;
//                 onChange(newVal); // update page_name
//                 // Now also update slug if not manually edited
//                 // We need to access the slug field's onChange.
//                 // We'll use a ref to the slug input's onChange stored in a ref.
//                 if (!slugManuallyEdited && slugOnChangeRef.current) {
//                   const newSlug = generateSlugFromTitle(newVal);
//                   // Only update if different from current slug
//                   const currentSlug = slugValueRef.current;
//                   if (newSlug !== currentSlug) {
//                     slugOnChangeRef.current(newSlug);
//                   }
//                 }
//               }}
//               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//               placeholder="Enter page name"
//             />
//           );
//         },
//       },
//       {
//         name: "page_slug",
//         label: "Page Slug (URL)",
//         type: "custom",
//         required: true,
//         placeholder: "e.g. about-us",
//         help: "Auto-generated from title. Edit manually to override.",
//         viewRender: (value) => (
//           <span className="font-mono text-sm">{value}</span>
//         ),
//         render: ({ value, onChange }) => {
//           // Store the onChange and current value in refs for use by page_name
//           slugOnChangeRef.current = onChange;
//           slugValueRef.current = value;

//           if (mode === "view") {
//             return <span className="font-mono text-sm">{value}</span>;
//           }
//           return (
//             <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
//               <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 border-r border-gray-200 whitespace-nowrap">
//                 /cms/
//               </span>
//               <input
//                 type="text"
//                 value={value || ""}
//                 onChange={(e) => {
//                   // Sanitize: only lowercase, numbers, hyphens
//                   const raw = e.target.value;
//                   const sanitized = raw
//                     .toLowerCase()
//                     .replace(/[^a-z0-9-]/g, "-")
//                     .replace(/-+/g, "-")
//                     .replace(/^-|-$/g, "");
//                   onChange(sanitized);
//                   // Mark as manually edited so auto-generation stops
//                   if (!slugManuallyEdited) {
//                     setSlugManuallyEdited(true);
//                   }
//                 }}
//                 className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all"
//                 placeholder="auto-generated"
//               />
//             </div>
//           );
//         },
//       },
//       // ─── Page Type (static select) ────────────────────────────
//       {
//         name: "page_type",
//         label: "Page Type",
//         type: "custom",
//         required: false,
//         help: "Choose the classification for this page",
//         viewRender: (value) =>
//           value ? (
//             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
//               {getPageTypeLabel(value)}
//             </span>
//           ) : (
//             "—"
//           ),
//         render: ({ value, onChange }) => {
//           if (mode === "view") {
//             return value ? (
//               <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
//                 {getPageTypeLabel(value)}
//               </span>
//             ) : (
//               "—"
//             );
//           }
//           return (
//             <div className="relative">
//               <select
//                 value={value || ""}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
//               >
//                 <option value="">Select page type…</option>
//                 {PAGE_TYPE_OPTIONS.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//               <svg
//                 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           );
//         },
//       },
//       {
//         name: "short_description",
//         label: "Short Description",
//         type: "textarea",
//         rows: 3,
//         required: false,
//         placeholder: "A brief summary of the page content",
//         help: "Used for teasers or excerpts",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "page_title",
//         label: "Page Title (Browser Tab)",
//         type: "text",
//         required: false,
//         placeholder: "e.g. About Our Company",
//         help: "The title displayed in the browser tab",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "meta_title",
//         label: "Meta Title (SEO)",
//         type: "text",
//         required: false,
//         placeholder: "e.g. About Us – Your Company Name",
//         help: "SEO title – keep under 60 characters",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "meta_description",
//         label: "Meta Description (SEO)",
//         type: "textarea",
//         rows: 2,
//         required: false,
//         placeholder: "A compelling description for search engines",
//         help: "SEO description – keep under 160 characters",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "meta_keywords",
//         label: "Meta Keywords",
//         type: "text",
//         required: false,
//         placeholder: "keyword1, keyword2, keyword3",
//         help: "Comma‑separated keywords for SEO",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "banner_image",
//         label: "Banner Image",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload a banner image (PNG, JPG, WEBP) – Max 5MB",
//         placeholder: "Click or drag to upload banner",
//         viewRender: (value) => {
//           if (!value) return <span className="text-gray-400">—</span>;
//           const url = getFullImageUrl(value);
//           if (!url)
//             return <span className="text-gray-400">Invalid image path</span>;
//           return (
//             <div className="relative group inline-block">
//               <img
//                 src={url}
//                 alt="Banner"
//                 className="w-32 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src =
//                     'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="80" viewBox="0 0 128 80"%3E%3Crect width="128" height="80" fill="%23f3f4f6"/%3E%3Ctext x="64" y="45" font-family="sans-serif" font-size="12" fill="%239ca3af" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
//                 }}
//               />
//               <button
//                 onClick={() => window.open(url, "_blank")}
//                 className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-xs"
//               >
//                 View
//               </button>
//             </div>
//           );
//         },
//       },
//       {
//         name: "banner_title",
//         label: "Banner Title",
//         type: "text",
//         required: false,
//         placeholder: "e.g. Welcome to Our Company",
//         help: "Title displayed on the banner",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "banner_subtitle",
//         label: "Banner Subtitle",
//         type: "text",
//         required: false,
//         placeholder: "e.g. We are passionate about...",
//         help: "Subtitle displayed below the banner title",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "banner_CTA_button",
//         label: "Banner CTA Button Text",
//         type: "text",
//         required: false,
//         placeholder: "e.g. Learn More",
//         help: "Call‑to‑action button text on the banner",
//         viewRender: (value) => value || "—",
//       },
//       // ─── Content field (TinyMCE) ──────────────────────────────────
//       {
//         name: "content",
//         label: "Page Content",
//         type: "custom",
//         required: false,
//         help: "Write the main content of the page. HTML supported.",
//         viewRender: (value) => <CmsContentView value={value} />,
//         render: ({ value, onChange }) => {
//           if (mode === "view") {
//             return <CmsContentView value={value} />;
//           }

//           // In edit mode, wait for data to load to avoid empty editor
//           if (mode === "edit" && !data) {
//             return (
//               <div className="w-full h-[220px] flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
//                 Loading content…
//               </div>
//             );
//           }

//           // Key to force remount when content changes
//           const editorKey = `${mode}-${id || "new"}-${data ? "loaded" : "loading"}-${editorMode}`;

//           return (
//             <div className="space-y-3">
//               <div className="flex items-center gap-2">
//                 <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
//                   <button
//                     type="button"
//                     onClick={() => changeEditorMode("rich", value, onChange)}
//                     className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
//                       editorMode === "rich"
//                         ? "bg-white text-indigo-600 shadow-sm"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     Text
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => changeEditorMode("html", value, onChange)}
//                     className={`px-5 py-1.5 text-sm font-medium rounded-md transition-all ${
//                       editorMode === "html"
//                         ? "bg-white text-indigo-600 shadow-sm"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     HTML
//                   </button>
//                 </div>
//               </div>

//               {editorMode === "rich" && !tinyMceError ? (
//                 <div className="border rounded-xl overflow-hidden border-gray-200">
//                   <Editor
//                     key={editorKey}
//                     apiKey={TINYMCE_API_KEY}
//                     onInit={(evt, editor) => {
//                       editorRef.current = editor;
//                     }}
//                     onError={() => {
//                       console.error("TinyMCE failed to load");
//                       setTinyMceError(true);
//                     }}
//                     value={value || ""}
//                     onEditorChange={(content) => onChange(content)}
//                     init={{
//                       height: 500,
//                       menubar: true,
//                       statusbar: true,
//                       plugins: [
//                         "advlist",
//                         "autolink",
//                         "lists",
//                         "link",
//                         "image",
//                         "charmap",
//                         "preview",
//                         "anchor",
//                         "searchreplace",
//                         "visualblocks",
//                         "code",
//                         "fullscreen",
//                         "insertdatetime",
//                         "media",
//                         "table",
//                         "help",
//                         "wordcount",
//                       ],
//                       toolbar:
//                         "file undo redo | bold italic underline strikethrough | " +
//                         "fontfamily fontsize | alignleft aligncenter alignright alignjustify | " +
//                         "bullist numlist outdent indent | link image table | " +
//                         "forecolor backcolor | removeformat code | help",
//                       menu: {
//                         file: {
//                           title: "File",
//                           items: "newdocument restoredraft | preview | print ",
//                         },
//                         edit: {
//                           title: "Edit",
//                           items:
//                             "undo redo | cut copy paste pastetext | selectall ",
//                         },
//                         view: {
//                           title: "View",
//                           items: "visualaid visualblocks | code | fullscreen ",
//                         },
//                         insert: {
//                           title: "Insert",
//                           items: "image link media table | hr | pagebreak ",
//                         },
//                         format: {
//                           title: "Format",
//                           items:
//                             "bold italic underline strikethrough | formats | removeformat ",
//                         },
//                         tools: {
//                           title: "Tools",
//                           items: "searchreplace | spellcheckdialog ",
//                         },
//                         table: {
//                           title: "Table",
//                           items:
//                             "inserttable | cell row column | advtablesort | tableprops deletetable ",
//                         },
//                         help: { title: "Help", items: "help " },
//                       },
//                       content_style:
//                         "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.7; } p { margin: 0 0 10px; } h1, h2, h3, h4, h5, h6 { margin: 0 0 12px; line-height: 1.3; }",
//                       placeholder: "Write the page content here…",
//                       forced_root_block: "p",
//                       verify_html: false,
//                       cleanup: false,
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <textarea
//                   value={value || ""}
//                   onChange={(e) => onChange(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y"
//                   rows={16}
//                   placeholder="<!-- Write HTML here -->"
//                 />
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         name: "status",
//         label: "Status",
//         type: "radio",
//         options: [
//           { value: "active", label: "Active" },
//           { value: "inactive", label: "Inactive" },
//         ],
//         color: "text-[#2c0eee] focus:ring-[#4529f7]",
//         viewRender: (value, row) => {
//           const isActive = row?.status === 1 || row?.status === true;
//           return <ViewBadge active={isActive} />;
//         },
//       },
//       {
//         name: "is_menu_visible",
//         label: "Show in Menu",
//         type: "checkbox",
//         color: "text-blue-500 focus:ring-blue-500",
//         help: "If enabled, this page will appear in the main navigation menu",
//         viewRender: (value) => (
//           <span
//             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//               value ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
//             }`}
//           >
//             <span
//               className={`w-1.5 h-1.5 rounded-full ${value ? "bg-blue-500" : "bg-gray-400"}`}
//             />
//             {value ? "Visible" : "Hidden"}
//           </span>
//         ),
//       },
//       {
//         name: "is_footer_visible",
//         label: "Show in Footer",
//         type: "checkbox",
//         color: "text-green-500 focus:ring-green-500",
//         help: "If enabled, this page will appear in the footer links",
//         viewRender: (value) => (
//           <span
//             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//               value ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
//             }`}
//           >
//             <span
//               className={`w-1.5 h-1.5 rounded-full ${value ? "bg-green-500" : "bg-gray-400"}`}
//             />
//             {value ? "Visible" : "Hidden"}
//           </span>
//         ),
//       },
//       {
//         name: "display_order",
//         label: "Display Order",
//         type: "number",
//         required: false,
//         min: 0,
//         max: 999,
//         step: 1,
//         placeholder: "0",
//         help: "Order in which pages are displayed (lower numbers appear first)",
//         viewRender: (value) => (value !== undefined ? String(value) : "—"),
//       },
//     ];

//     // ─── Audit fields (only in view mode) ─────────────────────────
//     if (mode === "view") {
//       const auditFields = [
//         {
//           name: "created_by",
//           label: "Created By",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => {
//             const name = getUserNameCached(value);
//             return name !== "-" ? name : "System";
//           },
//         },
//         {
//           name: "updated_by",
//           label: "Updated By",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => {
//             if (!value) return "—";
//             const name = getUserNameCached(value);
//             return name !== "-" ? name : "System";
//           },
//         },
//         {
//           name: "created_at",
//           label: "Created At",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => (value ? formatDate(value) : "—"),
//         },
//         {
//           name: "updated_at",
//           label: "Updated At",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => (value ? formatDate(value) : "—"),
//         },
//       ];
//       return [...baseFields, ...auditFields];
//     }

//     return baseFields;
//   };

//   // ─── Validation rules ──────────────────────────────────────────
//   const getValidationRules = () => ({
//     page_name: {
//       required: true,
//       requiredMessage: "Page name is required",
//       minLength: 2,
//       minLengthMessage: "Page name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Page name must be at most 100 characters",
//     },
//     page_slug: {
//       required: true,
//       requiredMessage: "Page slug is required",
//       minLength: 2,
//       minLengthMessage: "Slug must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Slug must be at most 100 characters",
//       pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
//       patternMessage:
//         "Slug can only contain lowercase letters, numbers, and hyphens",
//     },
//   });

//   // ─── Submit ─────────────────────────────────────────────────────
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const submitData = {
//         page_name: formData.page_name,
//         page_slug: formData.page_slug || generateSlug(formData.page_name),
//         page_type: formData.page_type || "",
//         short_description: formData.short_description || "",
//         page_title: formData.page_title || "",
//         meta_title: formData.meta_title || "",
//         meta_description: formData.meta_description || "",
//         meta_keywords: formData.meta_keywords || "",
//         banner_title: formData.banner_title || "",
//         banner_subtitle: formData.banner_subtitle || "",
//         banner_CTA_button: formData.banner_CTA_button || "",
//         content: formData.content || "",
//         status: formData.status === "active" ? 1 : 0,
//         is_menu_visible: formData.is_menu_visible ? 1 : 0,
//         is_footer_visible: formData.is_footer_visible ? 1 : 0,
//         display_order: parseInt(formData.display_order) || 0,
//         updated_by: userId,
//       };

//       const formDataObj = new FormData();
//       Object.keys(submitData).forEach((key) => {
//         formDataObj.append(key, submitData[key]);
//       });

//       const selectedBannerImage = normalizeBannerImage(
//         formData.banner_image instanceof File
//           ? formData.banner_image
//           : formData.banner_imageFile,
//       );
//       const existingBannerImage = normalizeBannerImage(data?.banner_image);

//       if (selectedBannerImage instanceof File) {
//         formDataObj.append(
//           "banner_image",
//           selectedBannerImage,
//           selectedBannerImage.name,
//         );
//       } else if (mode === "edit" && existingBannerImage) {
//         formDataObj.append("banner_image", existingBannerImage);
//       }

//       if (mode === "edit") {
//         await cmsPageService.update(id, formDataObj, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         showSuccess("CMS page updated successfully");
//       } else {
//         await cmsPageService.create(formDataObj, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         showSuccess("CMS page created successfully");
//       }

//       navigate("/cms-pages");
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error?.message || error?.response?.data?.message || "Failed to save";
//       showError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Delete ─────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     try {
//       await cmsPageService.delete(id);
//       showSuccess("CMS page deleted successfully");
//       navigate("/cms-pages");
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint/i.test(message)) {
//         showError(
//           "Cannot delete this page because it is being used in other records.",
//         );
//       } else {
//         showError(message || "Failed to delete page");
//       }
//       throw error;
//     }
//   };

//   // ─── Initial data ──────────────────────────────────────────────
//   const getInitialData = () => {
//     if (mode === "add") {
//       return {
//         page_name: "",
//         page_slug: "",
//         page_type: "",
//         short_description: "",
//         page_title: "",
//         meta_title: "",
//         meta_description: "",
//         meta_keywords: "",
//         banner_image: null,
//         banner_title: "",
//         banner_subtitle: "",
//         banner_CTA_button: "",
//         content: "",
//         status: "active",
//         is_menu_visible: false,
//         is_footer_visible: false,
//         display_order: 0,
//       };
//     }

//     if (data) {
//       const initial = {
//         page_name: data.page_name || "",
//         page_slug: data.page_slug || "",
//         page_type: data.page_type || "",
//         short_description: data.short_description || "",
//         page_title: data.page_title || "",
//         meta_title: data.meta_title || "",
//         meta_description: data.meta_description || "",
//         meta_keywords: data.meta_keywords || "",
//         banner_image: normalizeBannerImage(data.banner_image),
//         banner_title: data.banner_title || "",
//         banner_subtitle: data.banner_subtitle || "",
//         banner_CTA_button: data.banner_CTA_button || "",
//         content: data.content || "",
//         status:
//           data.status === 1 || data.status === true ? "active" : "inactive",
//         is_menu_visible:
//           data.is_menu_visible === 1 || data.is_menu_visible === true,
//         is_footer_visible:
//           data.is_footer_visible === 1 || data.is_footer_visible === true,
//         display_order: data.display_order || 0,
//       };
//       if (mode === "view") {
//         initial.created_by = data.created_by;
//         initial.updated_by = data.updated_by;
//         initial.created_at = data.created_at;
//         initial.updated_at = data.updated_at;
//       }
//       return initial;
//     }
//     return {};
//   };

//   // ─── Titles ─────────────────────────────────────────────────────
//   const getTitle = () => {
//     if (mode === "view") return "CMS Page Details";
//     if (mode === "edit") return "Edit CMS Page";
//     return "Add New CMS Page";
//   };

//   const getSubmitLabel = () =>
//     mode === "edit" ? "Update Page" : "Create Page";

//   // ─── Loading states ────────────────────────────────────────────
//   if (pageLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="mt-3 text-gray-500">Loading page data...</p>
//         </div>
//       </div>
//     );
//   }

//   if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">CMS page not found</p>
//           <button
//             onClick={() => navigate("/cms-pages")}
//             className="mt-3 text-[#2c0eee] hover:underline"
//           >
//             Go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ─── Render ─────────────────────────────────────────────────────
//   return (
//     <FormPage
//       key={mode + (data?.id || "")}
//       title={getTitle()}
//       mode={mode}
//       fields={getFields()}
//       initialData={getInitialData()}
//       validationRules={getValidationRules()}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       navigateTo="/cms-pages"
//       submitLabel={getSubmitLabel()}
//       editLabel="Edit Page"
//       deleteLabel="Delete Page"
//       loading={loading}
//       showDelete={mode !== "add"}
//       showEdit={mode === "view"}
//       enableEditMode={mode === "view"}
//       breadcrumb={
//         mode === "view"
//           ? "Viewing page details"
//           : mode === "edit"
//             ? "Updating page"
//             : "Creating new page"
//       }
//       onEdit={() =>
//         navigate(`/cms-pages/edit/${id}`, { state: { item: data } })
//       }
//     />
//   );
// };

// export default CmsPageForm;

// pages/CmsPageForm.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from "@tinymce/tinymce-react";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdEdit,
  MdArticle,
  MdSearch,
  MdImage,
  MdEditNote,
  MdFlag,
  MdInfoOutline,
  MdCloudUpload,
  MdClose,
  MdCheckCircle,
  MdErrorOutline,
  MdMenu,
  MdWeb,
  MdDateRange,
  MdPerson,
  MdLink,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { cmsPageService } from "../../services/cmsPage.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// TinyMCE cloud API key
const TINYMCE_API_KEY = "bm6x4a0l27d8s6wee3a7ischv36uaemzvva438l0m6llfl6d";

// ─── Static Page Type options ───────────────────────────────────
const PAGE_TYPE_OPTIONS = [
  { value: "static_page", label: "Static Page" },
  { value: "legal_page", label: "Legal Page" },
  { value: "help_page", label: "Help Page" },
  { value: "faq_page", label: "FAQ Page" },
  { value: "landing_page", label: "Landing Page" },
];

const getPageTypeLabel = (value) => {
  if (!value) return "—";
  const match = PAGE_TYPE_OPTIONS.find((opt) => opt.value === value);
  return match ? match.label : value;
};

// ─── Slug generator ─────────────────────────────────────────────
const generateSlugFromTitle = (title) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
};

const generateSlug = generateSlugFromTitle;

// ─── Image URL helper ──────────────────────────────────────────
const getFullImageUrl = (value) => {
  if (!value) return null;
  if (typeof value === "object") {
    return getFullImageUrl(
      value.url || value.uri || value.path || value.image || value.banner_image
    );
  }
  if (typeof value !== "string") return null;
  if (value.startsWith("http") || value.startsWith("data:image") || value.startsWith("blob:"))
    return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
  return value;
};

const normalizeBannerImage = (value) => {
  if (!value) return null;
  if (value instanceof File) return value;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "object") {
    return normalizeBannerImage(
      value.url ||
        value.uri ||
        value.path ||
        value.image ||
        value.banner_image ||
        value.file
    );
  }
  return null;
};

// ─── Shared components ─────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked || false}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
  </label>
);

// ─── Status pill ───────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    icon: MdErrorOutline,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Content view (read-only mode) ─────────────────────────────
const CmsContentView = ({ value }) => {
  const [viewMode, setViewMode] = useState("text");
  const content = value || "";

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 w-fit bg-slate-100 rounded-lg">
        {[
          ["text", "Text"],
          ["html", "HTML"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setViewMode(tab)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              viewMode === tab
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {viewMode === "text" ? (
        <div
          className="prose prose-sm max-w-none p-4 bg-slate-50 rounded-lg border border-slate-200"
          dangerouslySetInnerHTML={{ __html: content || "<p>—</p>" }}
        />
      ) : (
        <pre className="w-full min-h-[220px] p-4 overflow-auto whitespace-pre-wrap break-words bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700">
          {content || "<!-- No HTML content -->"}
        </pre>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────
const CmsPageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [userNameCache, setUserNameCache] = useState({});

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    page_name: "",
    page_slug: "",
    page_type: "",
    short_description: "",
    page_title: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    banner_image: "",
    banner_title: "",
    banner_subtitle: "",
    banner_CTA_button: "",
    content: "",
    status: "active",
    is_menu_visible: false,
    is_footer_visible: false,
    display_order: 0,
    created_by: null,
    updated_by: null,
    created_at: null,
    updated_at: null,
  });

  const [errors, setErrors] = useState({});

  // ─── Slug manual edit flag ───────────────────────────────────
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // ─── Banner image handling ───────────────────────────────────
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerRemoved, setBannerRemoved] = useState(false);

  // ─── TinyMCE state ───────────────────────────────────────────
  const [editorMode, setEditorMode] = useState("rich");
  const [tinyMceError, setTinyMceError] = useState(false);
  const editorRef = useRef(null);

  // ─── Determine mode ──────────────────────────────────────────
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/view/")) setMode("view");
    else if (path.includes("/edit/")) setMode("edit");
    else setMode("add");
  }, [location.pathname]);

  // Reset UI when record changes
  useEffect(() => {
    setEditorMode("rich");
    setTinyMceError(false);
    setSlugManuallyEdited(false);
    setActiveTab("overview");
  }, [mode, id]);

  // ─── Load users ──────────────────────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((uid) => {
          userMap[uid] = users[uid].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  // ─── Fetch data for edit/view ───────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if ((mode === "edit" || mode === "view") && id) {
        setFetchLoading(true);
        setData(null);
        try {
          let item = location.state?.item;
          if (!item) {
            const response = await cmsPageService.getById(id);
            item = response?.data?.data || response?.data;
          }
          if (!item) throw new Error("Page not found");

          setFormValues({
            page_name: item.page_name || "",
            page_slug: item.page_slug || "",
            page_type: item.page_type || "",
            short_description: item.short_description || "",
            page_title: item.page_title || "",
            meta_title: item.meta_title || "",
            meta_description: item.meta_description || "",
            meta_keywords: item.meta_keywords || "",
            banner_image: normalizeBannerImage(item.banner_image) || "",
            banner_title: item.banner_title || "",
            banner_subtitle: item.banner_subtitle || "",
            banner_CTA_button: item.banner_CTA_button || "",
            content: item.content || "",
            status:
              item.status === 1 || item.status === true
                ? "active"
                : "inactive",
            is_menu_visible:
              item.is_menu_visible === 1 || item.is_menu_visible === true,
            is_footer_visible:
              item.is_footer_visible === 1 ||
              item.is_footer_visible === true,
            display_order: item.display_order || 0,
            created_by: item.created_by || null,
            updated_by: item.updated_by || null,
            created_at: item.created_at || null,
            updated_at: item.updated_at || null,
          });

          if (item.banner_image) {
            setBannerPreview(getFullImageUrl(item.banner_image));
          }

          setData(item);
        } catch (error) {
          console.error("Fetch error:", error);
          showError("Failed to load CMS page");
          navigate("/cms-pages");
        } finally {
          setFetchLoading(false);
        }
      } else {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [id, mode, location.state, navigate]);

  // ─── User name helper ────────────────────────────────────────
  const getUserNameCached = (uid) => {
    if (!uid) return "—";
    if (user?.id && Number(user.id) === Number(uid)) return "You";
    return userNameCache[uid] || `User ${uid}`;
  };

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormValues((prev) => ({ ...prev, [name]: newValue }));

    // Auto-generate slug when page_name changes and slug wasn't manually edited
    if (name === "page_name" && !slugManuallyEdited) {
      const newSlug = generateSlugFromTitle(newValue);
      setFormValues((prev) => ({ ...prev, page_slug: newSlug }));
    }

    // Mark slug as manually edited
    if (name === "page_slug") {
      setSlugManuallyEdited(true);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setBannerRemoved(false);
    }
  };

  const handleBannerRemove = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setBannerRemoved(true);
    setFormValues((prev) => ({ ...prev, banner_image: "" }));
  };

  const handleContentChange = (value) => {
    setFormValues((prev) => ({ ...prev, content: value || "" }));
  };

  const changeEditorMode = (nextMode) => {
    if (nextMode === "html" && editorRef.current) {
      const currentHtml = editorRef.current.getContent();
      if (currentHtml !== formValues.content) {
        setFormValues((prev) => ({ ...prev, content: currentHtml }));
      }
    }
    if (nextMode === "rich") {
      setTinyMceError(false);
      if (editorRef.current) {
        editorRef.current.setContent(formValues.content || "", {
          format: "html",
        });
      }
    }
    setEditorMode(nextMode);
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.page_name?.trim()) {
      newErrors.page_name = "Page name is required";
    } else if (formValues.page_name.trim().length < 2) {
      newErrors.page_name = "Page name must be at least 2 characters";
    } else if (formValues.page_name.trim().length > 100) {
      newErrors.page_name = "Page name must be at most 100 characters";
    }

    if (!formValues.page_slug?.trim()) {
      newErrors.page_slug = "Page slug is required";
    } else if (formValues.page_slug.trim().length < 2) {
      newErrors.page_slug = "Slug must be at least 2 characters";
    } else if (formValues.page_slug.trim().length > 100) {
      newErrors.page_slug = "Slug must be at most 100 characters";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formValues.page_slug.trim())) {
      newErrors.page_slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setActiveTab("overview");
      showError(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        page_name: formValues.page_name.trim(),
        page_slug:
          formValues.page_slug.trim() ||
          generateSlug(formValues.page_name.trim()),
        page_type: formValues.page_type || "",
        short_description: formValues.short_description || "",
        page_title: formValues.page_title || "",
        meta_title: formValues.meta_title || "",
        meta_description: formValues.meta_description || "",
        meta_keywords: formValues.meta_keywords || "",
        banner_title: formValues.banner_title || "",
        banner_subtitle: formValues.banner_subtitle || "",
        banner_CTA_button: formValues.banner_CTA_button || "",
        content: formValues.content || "",
        status: formValues.status === "active" ? 1 : 0,
        is_menu_visible: formValues.is_menu_visible ? 1 : 0,
        is_footer_visible: formValues.is_footer_visible ? 1 : 0,
        display_order: parseInt(formValues.display_order) || 0,
        updated_by: userId,
      };

      const formDataObj = new FormData();
      Object.keys(submitData).forEach((key) => {
        formDataObj.append(key, submitData[key]);
      });

      if (bannerFile instanceof File) {
        formDataObj.append("banner_image", bannerFile, bannerFile.name);
      } else if (!bannerRemoved && formValues.banner_image) {
        formDataObj.append("banner_image", formValues.banner_image);
      }

      if (mode === "edit") {
        await cmsPageService.update(id, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("CMS page updated successfully");
      } else {
        await cmsPageService.create(formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("CMS page created successfully");
      }

      navigate("/cms-pages");
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error?.message || error?.response?.data?.message || "Failed to save";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await cmsPageService.delete(id);
      showSuccess("CMS page deleted successfully");
      setShowDeleteDialog(false);
      navigate("/cms-pages");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint/i.test(message)) {
        showError(
          "Cannot delete this page because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete page");
      }
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Tabs ────────────────────────────────────────────────────
  const TABS = useMemo(() => {
    const base = [
      { id: "overview", label: "Overview", icon: MdArticle },
      { id: "seo", label: "SEO", icon: MdSearch },
      { id: "banner", label: "Banner", icon: MdImage },
      { id: "content", label: "Content", icon: MdEditNote },
      { id: "status", label: "Status", icon: MdFlag },
    ];
    if (mode === "view") {
      base.push({ id: "metadata", label: "Metadata", icon: MdInfoOutline });
    }
    return base;
  }, [mode]);

  // ─── Loading state ───────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading page data...</p>
        </div>
      </div>
    );
  }

  if ((mode === "view" || mode === "edit") && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center">
          <p className="text-slate-500">CMS page not found</p>
          <button
            onClick={() => navigate("/cms-pages")}
            className="mt-3 text-blue-600 hover:underline text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.page_name?.trim() || "New CMS Page";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const isViewMode = mode === "view";

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel required>Page Name</FieldLabel>
                <div className="relative">
                  <MdArticle
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="page_name"
                    value={formValues.page_name}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.page_name
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="e.g. About Us"
                  />
                </div>
                {errors.page_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.page_name}</p>
                )}
              </div>

              <div>
                <FieldLabel required>Page Slug (URL)</FieldLabel>
                <div
                  className={`flex rounded-lg overflow-hidden border ${
                    errors.page_slug
                      ? "border-red-300"
                      : "border-slate-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
                  }`}
                >
                  <span className="inline-flex items-center px-3 py-2.5 bg-slate-100 text-xs text-slate-500 border-r border-slate-200 whitespace-nowrap">
                    /cms/
                  </span>
                  <input
                    type="text"
                    name="page_slug"
                    value={formValues.page_slug}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`flex-1 px-3 py-2.5 text-sm focus:outline-none ${
                      isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                    }`}
                    placeholder="auto-generated"
                  />
                </div>
                {errors.page_slug ? (
                  <p className="text-xs text-red-500 mt-1">{errors.page_slug}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    {isViewMode
                      ? "URL path for this page."
                      : "Auto-generated from page name. Edit manually to override."}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel>Page Type</FieldLabel>
                <select
                  name="page_type"
                  value={formValues.page_type}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                >
                  <option value="">Select page type…</option>
                  {PAGE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Page Title (Browser Tab)</FieldLabel>
                <input
                  type="text"
                  name="page_title"
                  value={formValues.page_title}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="e.g. About Our Company"
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel>Short Description</FieldLabel>
                <textarea
                  name="short_description"
                  value={formValues.short_description}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  rows={3}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="A brief summary of the page content"
                />
              </div>
            </div>
          </div>
        );

      case "seo":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <FieldLabel>Meta Title</FieldLabel>
                <input
                  type="text"
                  name="meta_title"
                  value={formValues.meta_title}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="e.g. About Us – Your Company Name"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Keep under 60 characters for best SEO.
                </p>
              </div>

              <div>
                <FieldLabel>Meta Description</FieldLabel>
                <textarea
                  name="meta_description"
                  value={formValues.meta_description}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  rows={3}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="A compelling description for search engines"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Keep under 160 characters.
                </p>
              </div>

              <div>
                <FieldLabel>Meta Keywords</FieldLabel>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formValues.meta_keywords}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Comma‑separated keywords.
                </p>
              </div>
            </div>
          </div>
        );

      case "banner":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel>Banner Image</FieldLabel>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-full sm:w-56 h-32 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <MdImage size={32} className="text-slate-300" />
                    )}
                  </div>
                  {!isViewMode && (
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                        <MdCloudUpload size={16} />
                        {bannerPreview ? "Change banner" : "Upload banner"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerFileChange}
                          className="hidden"
                        />
                      </label>
                      {bannerPreview && (
                        <button
                          type="button"
                          onClick={handleBannerRemove}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                        >
                          <MdClose size={14} />
                          Remove banner
                        </button>
                      )}
                      <p className="text-xs text-slate-500">
                        PNG, JPG, WEBP – Max 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <FieldLabel>Banner Title</FieldLabel>
                <input
                  type="text"
                  name="banner_title"
                  value={formValues.banner_title}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="e.g. Welcome to Our Company"
                />
              </div>

              <div>
                <FieldLabel>Banner Subtitle</FieldLabel>
                <input
                  type="text"
                  name="banner_subtitle"
                  value={formValues.banner_subtitle}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="e.g. We are passionate about..."
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel>Banner CTA Button Text</FieldLabel>
                <input
                  type="text"
                  name="banner_CTA_button"
                  value={formValues.banner_CTA_button}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="e.g. Learn More"
                />
              </div>
            </div>
          </div>
        );

      case "content":
        if (isViewMode) {
          return <CmsContentView value={formValues.content} />;
        }

        const editorKey = `${mode}-${id || "new"}-${data ? "loaded" : "loading"}-${editorMode}`;

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => changeEditorMode("rich")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    editorMode === "rich"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => changeEditorMode("html")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    editorMode === "html"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  HTML
                </button>
              </div>
            </div>

            {editorMode === "rich" && !tinyMceError ? (
              <div className="border rounded-xl overflow-hidden border-slate-200">
                <Editor
                  key={editorKey}
                  apiKey={TINYMCE_API_KEY}
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                  }}
                  onError={() => {
                    console.error("TinyMCE failed to load");
                    setTinyMceError(true);
                  }}
                  value={formValues.content || ""}
                  onEditorChange={handleContentChange}
                  init={{
                    height: 500,
                    menubar: true,
                    statusbar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "file undo redo | bold italic underline strikethrough | " +
                      "fontfamily fontsize | alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | link image table | " +
                      "forecolor backcolor | removeformat code | help",
                    menu: {
                      file: {
                        title: "File",
                        items: "newdocument restoredraft | preview | print ",
                      },
                      edit: {
                        title: "Edit",
                        items:
                          "undo redo | cut copy paste pastetext | selectall ",
                      },
                      view: {
                        title: "View",
                        items: "visualaid visualblocks | code | fullscreen ",
                      },
                      insert: {
                        title: "Insert",
                        items: "image link media table | hr | pagebreak ",
                      },
                      format: {
                        title: "Format",
                        items:
                          "bold italic underline strikethrough | formats | removeformat ",
                      },
                      tools: {
                        title: "Tools",
                        items: "searchreplace | spellcheckdialog ",
                      },
                      table: {
                        title: "Table",
                        items:
                          "inserttable | cell row column | advtablesort | tableprops deletetable ",
                      },
                      help: { title: "Help", items: "help " },
                    },
                    content_style:
                      "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.7; } p { margin: 0 0 10px; } h1, h2, h3, h4, h5, h6 { margin: 0 0 12px; line-height: 1.3; }",
                    placeholder: "Write the page content here…",
                    forced_root_block: "p",
                    verify_html: false,
                    cleanup: false,
                  }}
                />
              </div>
            ) : (
              <textarea
                value={formValues.content || ""}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-y"
                rows={16}
                placeholder="<!-- Write HTML here -->"
              />
            )}
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
            <div>
              <FieldLabel required>Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive"].map((status) => (
                  <label
                    key={status}
                    className={`flex items-center gap-2.5 ${
                      isViewMode ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formValues.status === status}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Active pages are visible on the public site.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Show in Menu</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <Toggle
                  name="is_menu_visible"
                  checked={formValues.is_menu_visible}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-slate-600">
                  {formValues.is_menu_visible
                    ? "Visible in main menu"
                    : "Hidden from main menu"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Show in Footer</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <Toggle
                  name="is_footer_visible"
                  checked={formValues.is_footer_visible}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-slate-600">
                  {formValues.is_footer_visible
                    ? "Visible in footer links"
                    : "Hidden from footer links"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Display Order</FieldLabel>
              <input
                type="number"
                name="display_order"
                value={formValues.display_order}
                onChange={handleInputChange}
                disabled={isViewMode}
                min="0"
                max="999"
                className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                }`}
                placeholder="0"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Lower numbers appear first.
              </p>
            </div>
          </div>
        );

      case "metadata":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Created By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={getUserNameCached(formValues.created_by)}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={getUserNameCached(formValues.updated_by)}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Created At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      formValues.created_at
                        ? formatDate(formValues.created_at)
                        : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      formValues.updated_at
                        ? formatDate(formValues.updated_at)
                        : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Titles ──────────────────────────────────────────────────
  const heroTitle =
    mode === "view" ? "CMS Page Details" : mode === "edit" ? "Edit CMS Page" : "Add New CMS Page";

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/cms-pages")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                CMS Pages
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/cms-pages")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              {mode === "view" ? "Back" : "Cancel"}
            </button>

            {mode === "view" ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/cms-pages/edit/${id}`, { state: { item: data } })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
              >
                <MdEdit size={16} />
                Edit Page
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave size={16} />
                )}
                {loading
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update Page"
                  : "Create Page"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdArticle size={24} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  <StatusPill status={formValues.status} />
                  {formValues.page_type && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-400/20 text-indigo-200 ring-1 ring-indigo-400/30">
                      {getPageTypeLabel(formValues.page_type)}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {formValues.page_slug && (
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MdLink size={11} />
                      /cms/{formValues.page_slug}
                    </span>
                  )}
                  {mode !== "add" && (
                    <span className="text-xs text-white/70">ID: #{id}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdFlag size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {formValues.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdMenu size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Menu</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_menu_visible ? "Visible" : "Hidden"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdWeb size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Footer</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_footer_visible ? "Visible" : "Hidden"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdEditNote size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Content
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {(formValues.content?.length || 0).toLocaleString()} chars
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200 px-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="cms-page-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Actions ────────────────────────────────────────────── */}
        {mode !== "add" && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdDelete size={16} />
                  Delete Page
                </button>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={() => navigate("/cms-pages")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdCancel size={16} />
                  {mode === "view" ? "Back" : "Cancel"}
                </button>

                {mode === "view" ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/cms-pages/edit/${id}`, {
                        state: { item: data },
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors w-full sm:w-auto"
                  >
                    <MdEdit size={16} />
                    Edit Page
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    {loading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdSave size={16} />
                    )}
                    {loading ? "Saving..." : "Update Page"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/cms-pages")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          {mode === "view" ? "Back" : "Cancel"}
        </button>
      </div>

      {/* ─── Delete Confirmation Dialog ─────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete CMS Page"
        message="Delete this CMS page? This action cannot be undone."
      />
    </div>
  );
};

export default CmsPageForm;