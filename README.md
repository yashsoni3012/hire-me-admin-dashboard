# CareerAI Admin Panel

A professional admin panel for the CareerAI job portal, built with React.js, Tailwind CSS, Redux Toolkit, and Recharts.

## Tech Stack

- **React 18** + Vite
- **Tailwind CSS** - Utility-first styling
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Recharts** - Charts & analytics
- **React Hot Toast** - Notifications
- **React Icons (MdIcons)** - Icon library

## Project Structure (MVC Pattern)

```
src/
├── components/     # Reusable UI components (View layer)
│   ├── common/     # Button, Input, Modal, Table, Pagination...
│   ├── layout/     # Sidebar, Header, Footer, MainLayout
│   └── dashboard/  # StatsCard, ChartCard, RecentActivity
├── pages/          # Page-level components (View layer)
│   ├── Auth/       # Login, ForgotPassword, ResetPassword
│   ├── Users/      # CRUD for users
│   ├── Jobs/       # Job listings management
│   └── ...
├── controllers/    # Business logic (Controller layer)
├── models/         # Data shapes / schemas (Model layer)
├── services/       # API calls (Service layer)
├── redux/          # Global state (slices + store)
├── hooks/          # Custom React hooks
├── context/        # Auth, Theme, Permission contexts
├── utils/          # Constants, helpers, validators
├── config/         # Env, menu, axios config
└── routes/         # AppRoutes, PrivateRoute, PublicRoute
```

## Features

- JWT Authentication with auto token refresh
- Protected & Public route guards
- Sidebar navigation with collapsible menu
- Dashboard with stats, charts, recent activity
- Full CRUD for: Users, Jobs, Roles, Permissions, Departments, Industries, Categories, Blogs, Banners
- Search with debounce, pagination, filtering
- Confirm dialogs for destructive actions
- Toast notifications
- Settings with tabs (General, Security, Notifications, Appearance)
- Profile page with password change

## Setup & Run

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure environment
\`\`\`bash
cp .env.development .env
# Edit .env and set your API base URL
\`\`\`

### 3. Run development server
\`\`\`bash
npm run dev
\`\`\`

App runs at **http://localhost:5173**

### 4. Build for production
\`\`\`bash
npm run build
\`\`\`

## API Configuration

Update `.env` file:
\`\`\`env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
\`\`\`

## Backend Required Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | POST /auth/login/, /auth/logout/, /auth/token/refresh/ |
| Users | GET/POST /admin/users/, GET/PUT/DELETE /admin/users/:id/ |
| Jobs | GET/POST /admin/jobs/, GET/PUT/DELETE /admin/jobs/:id/ |
| Roles | GET/POST /admin/roles/, PUT/DELETE /admin/roles/:id/ |
| Permissions | GET/POST /admin/permissions/ |
| Departments | GET/POST /admin/departments/ |
| Industries | GET/POST /admin/industries/ |
| Categories | GET/POST /admin/categories/ |
| Blogs | GET/POST /admin/blogs/ |
| Banners | GET/POST /admin/banners/ |
| Dashboard | GET /admin/dashboard/stats/, /admin/dashboard/activities/ |

---
Built by Maxgen Technologies Pvt. Ltd. for CareerAI · careerai.in


<!-- https://apidata.hiremejobs.in -->
<!-- https://apidata.hiremejobs.in -->