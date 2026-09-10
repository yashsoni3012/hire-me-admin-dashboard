


// import Loader from "./Loader";

// const Table = ({
//   columns = [],
//   data = [],
//   loading = false,
//   emptyMessage = "No records found",
// }) => {
//   // Always ensure data is an array
//   const tableData = Array.isArray(data)
//     ? data
//     : Array.isArray(data?.data)
//     ? data.data
//     : Array.isArray(data?.results)
//     ? data.results
//     : [];

//   return (
//     <div className="overflow-x-auto rounded-lg border border-gray-200">
//       <table className="min-w-full text-sm">
//         <thead>
//           <tr className="bg-gray-50 border-b border-gray-200">
//             {columns.map((col, i) => (
//               <th
//                 key={i}
//                 className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap"
//               >
//                 {col.header}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={columns.length} className="py-10">
//                 <Loader />
//               </td>
//             </tr>
//           ) : tableData.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={columns.length}
//                 className="py-10 text-center text-gray-400"
//               >
//                 {emptyMessage}
//               </td>
//             </tr>
//           ) : (
//             tableData.map((row, rowIndex) => (
//               <tr
//                 key={row.id || row._id || rowIndex}
//                 className="border-b border-gray-100 hover:bg-gray-50 transition"
//               >
//                 {columns.map((col, colIndex) => (
//                   <td
//                     key={colIndex}
//                     className="px-4 py-3 text-gray-700 whitespace-nowrap"
//                   >
//                     {col.render
//                       ? col.render(row[col.key], row)
//                       : row[col.key] ?? "-"}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;

import Loader from "./Loader";

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found",
}) => {
  // Always ensure data is an array
  const tableData = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-10">
                <Loader />
              </td>
            </tr>
          ) : tableData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            tableData.map((row, rowIndex) => (
              <tr
                key={row.id || row._id || rowIndex}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-gray-700 whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(
                          row[col.key], // value
                          row,          // entire row
                          rowIndex      // row index
                        )
                      : row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;