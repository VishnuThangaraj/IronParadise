import { LuSearch, LuInbox } from "react-icons/lu";
import PropTypes from "prop-types";

const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  actionButton,
  containerClassName = "",
}) => {
  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      {(onSearchChange || actionButton) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {onSearchChange && (
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <LuSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-xs"
              />
            </div>
          )}
          {actionButton && <div className="ml-auto sm:ml-0">{actionButton}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className={`w-full overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 ${containerClassName}`}>
        <table className="w-full border-collapse text-left text-xs text-slate-600 relative">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm shadow-[0_1px_0_0_#e2e8f0]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${
                    col.className || ""
                  }`}
                  style={col.style}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-6 py-4.5">
                      <div className="h-3.5 bg-slate-100 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  <div className="flex flex-col items-center justify-center text-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <LuInbox className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">
                        No Records Found
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Try adjusting your search criteria or add new items.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              // Rows Render
              data.map((row, rIdx) => (
                <tr
                  key={row.id || row._id || rIdx}
                  className="hover:bg-slate-50/40 transition-colors duration-150"
                >
                  {columns.map((col, cIdx) => {
                    const value = col.accessor ? row[col.accessor] : undefined;
                    return (
                      <td
                        key={cIdx}
                        className={`px-6 py-4.5 font-semibold text-slate-700 ${
                          col.className || ""
                        }`}
                        style={col.style}
                      >
                        {col.render ? col.render(row, rIdx) : value ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
      className: PropTypes.string,
      style: PropTypes.object,
    })
  ).isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  actionButton: PropTypes.node,
  containerClassName: PropTypes.string,
};

export default DataTable;
