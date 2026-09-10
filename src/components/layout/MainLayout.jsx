// import { useSelector } from 'react-redux'
// import { Outlet, useLocation } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import Header from './Header'
// // import Footer from './Footer'

// const pageTitles = {
//   '/dashboard': 'Dashboard', '/users': 'Users', '/roles': 'Roles',
//   '/permissions': 'Permissions', '/jobs': 'Jobs', '/category': 'Categories',
//   '/industry': 'Industries', '/department': 'Departments', '/blogs': 'Blogs',
//   '/banner': 'Banners', '/notifications': 'Notifications', '/settings': 'Settings', '/profile': 'My Profile',
// }

// const MainLayout = () => {
//   const sidebarOpen = useSelector(s => s.ui.sidebarOpen)
//   const location = useLocation()
//   const title = pageTitles[location.pathname] || 'CareerAI Admin'

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <Sidebar />
//       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
//         <Header title={title} />
//         <main className="flex-1 p-4 lg:p-6">
//           <Outlet />
//         </main>
//         {/* <Footer /> */}
//       </div>
//     </div>
//   )
// }

// export default MainLayout


import { useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
// import Footer from './Footer'

const pageTitles = {
  '/dashboard': 'Dashboard', '/users': 'Users', '/roles': 'Roles',
  '/permissions': 'Permissions', '/jobs': 'Jobs', '/category': 'Categories',
  '/industry': 'Industries', '/department': 'Departments', '/blogs': 'Blogs',
  '/banner': 'Banners', '/notifications': 'Notifications', '/settings': 'Settings', '/profile': 'My Profile',
}

const MainLayout = () => {
  const sidebarOpen = useSelector(s => s.ui.sidebarOpen)
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'CareerAI Admin'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[272px]' : 'lg:ml-16'}`}>
        <Header title={title} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  )
}

export default MainLayout