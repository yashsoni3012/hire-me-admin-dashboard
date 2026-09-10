// // export const formatDate = (date) => {
// //   if (!date) return '-'
// //   const d = new Date(date)
// //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// //   return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
// // }
// // export const truncate = (str, len = 50) => str && str.length > len ? str.substring(0, len) + '...' : str
// // export const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
// // export const formatNumber = (num) => num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num || 0)
// // export const getStatusColor = (status) => {
// //   const map = { active: 'badge-active', inactive: 'badge-inactive', pending: 'badge-pending', banned: 'badge-inactive', draft: 'badge-pending', expired: 'badge-inactive' }
// //   return map[status?.toLowerCase()] || 'badge-inactive'
// // }



// // export const formatDate = (date) => {
// //   if (!date) return '-'

// //   // Handle the specific format: "10/07/2026, 11:58:52 am"
// //   if (typeof date === 'string') {
// //     // Extract date part before the comma
// //     const datePart = date.split(',')[0].trim();
// //     if (datePart.includes('/')) {
// //       const parts = datePart.split('/');
// //       if (parts.length === 3) {
// //         // parts[0] = day, parts[1] = month, parts[2] = year
// //         const day = String(parts[0]).padStart(2, '0');
// //         const month = String(parts[1]).padStart(2, '0');
// //         const year = parts[2];
// //         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// //         return `${day} ${months[parseInt(month) - 1]} ${year}`;
// //       }
// //     }
// //   }

// //   // Fallback: Try parsing with Date constructor
// //   try {
// //     const d = new Date(date);
// //     if (isNaN(d.getTime())) return '-';
// //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// //     return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
// //   } catch {
// //     return '-';
// //   }
// // }

// export const formatDate = (date) => {
//   if (!date) return "-";

//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   if (typeof date === "string") {
//     const datePart = date.split(",")[0].trim();

//     // DD/MM/YYYY
//     if (datePart.includes("/")) {
//       const parts = datePart.split("/");

//       if (parts.length === 3) {
//         const day = String(parts[0]).padStart(2, "0");
//         const month = parseInt(parts[1], 10);
//         const year = parts[2];

//         if (month >= 1 && month <= 12) {
//           return `${day} ${months[month - 1]} ${year}`;
//         }
//       }
//     }

//     // YYYY-MM-DD
//     if (datePart.includes("-")) {
//       const parts = datePart.split("-");

//       if (parts.length === 3 && parts[0].length === 4) {
//         const year = parts[0];
//         const month = parseInt(parts[1], 10);
//         const day = String(parts[2]).padStart(2, "0");

//         if (month >= 1 && month <= 12) {
//           return `${day} ${months[month - 1]} ${year}`;
//         }
//       }
//     }
//   }

//   const parsedDate = new Date(date);

//   if (Number.isNaN(parsedDate.getTime())) {
//     return "-";
//   }

//   const day = String(parsedDate.getDate()).padStart(2, "0");
//   const month = parsedDate.getMonth();
//   const year = parsedDate.getFullYear();

//   return `${day} ${months[month]} ${year}`;
// };

// export const truncate = (str, len = 50) => str && str.length > len ? str.substring(0, len) + '...' : str

// export const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

// export const formatNumber = (num) => num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num || 0)

// export const getStatusColor = (status) => {
//   const map = {
//     active: 'badge-active',
//     inactive: 'badge-inactive',
//     pending: 'badge-pending',
//     banned: 'badge-inactive',
//     draft: 'badge-pending',
//     expired: 'badge-inactive'
//   }
//   return map[status?.toLowerCase()] || 'badge-inactive'
// }


// export const formatDate = (date) => {
//   if (!date) return '-'
//   const d = new Date(date)
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//   return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
// }
// export const truncate = (str, len = 50) => str && str.length > len ? str.substring(0, len) + '...' : str
// export const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
// export const formatNumber = (num) => num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num || 0)
// export const getStatusColor = (status) => {
//   const map = { active: 'badge-active', inactive: 'badge-inactive', pending: 'badge-pending', banned: 'badge-inactive', draft: 'badge-pending', expired: 'badge-inactive' }
//   return map[status?.toLowerCase()] || 'badge-inactive'
// }



export const formatDate = (date) => {
  if (!date) return '-'

  // Handle the specific format: "10/07/2026, 11:58:52 am"
  if (typeof date === 'string') {
    // Extract date part before the comma
    const datePart = date.split(',')[0].trim();
    if (datePart.includes('/')) {
      const parts = datePart.split('/');
      if (parts.length === 3) {
        // parts[0] = day, parts[1] = month, parts[2] = year
        const day = String(parts[0]).padStart(2, '0');
        const month = String(parts[1]).padStart(2, '0');
        const year = parts[2];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[parseInt(month) - 1]} ${year}`;
      }
    }
  }

  // Fallback: Try parsing with Date constructor
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return '-';
  }
}

export const truncate = (str, len = 50) => str && str.length > len ? str.substring(0, len) + '...' : str

export const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export const formatNumber = (num) => num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num || 0)

export const getStatusColor = (status) => {
  const map = {
    active: 'badge-active',
    inactive: 'badge-inactive',
    pending: 'badge-pending',
    banned: 'badge-inactive',
    draft: 'badge-pending',
    expired: 'badge-inactive'
  }
  return map[status?.toLowerCase()] || 'badge-inactive'
}
