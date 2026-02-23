import Sheet from "@mui/joy/Sheet";
import { useNavigate } from "react-router-dom";

const CompactTable = ({
  rows = [],
  columns = [],
  rowClick = false,
  rowClickPath = "",
  getRowId,
  height = 400,
}) => {
  const navigate = useNavigate();
  console.log(rows, columns);

  const resolveId = (row) => (getRowId ? getRowId(row) : row._id);

  const handleRowClick = (row) => {
    if (!rowClick) return;

    navigate(`${rowClickPath}/${resolveId(row)}`, {
      state: { edit: false },
    });
  };

  return (
    <Sheet
      variant="soft"
      className="rounded-md shadow-md overflow-hidden"
      sx={{
        backgroundColor: "transparent",
        backdropFilter: "blur(10px)",
        pb: 2,
      }}
    >
      <div className="overflow-auto" style={{ maxHeight: height }}>
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-slate-100/80 dark:bg-slate-800/80 sticky top-0 z-10 backdrop-blur">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  className="
                  text-center 
                    px-4 py-3
                    font-semibold
                    text-gray-700 dark:text-gray-200
                    border-b
                    bg-inherit
                  "
                >
                  {col.headerName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const id = resolveId(row);

              return (
                <tr
                  key={id}
                  onClick={() => handleRowClick(row)}
                  className={`
                    text-center 
                    transition-colors duration-150
                    hover:bg-slate-100/60 dark:hover:bg-slate-700/40
                    ${rowClick ? "cursor-pointer" : ""}
                  `}
                >
                  {columns.map((col) => (
                    <td key={col.field} className="px-4 py-3 border-b  ">
                      {col.renderCell
                        ? col.renderCell({
                            row,
                            value: row[col.field] || "---",
                          })
                        : row[col.field] || "Active"}
                    </td>
                  ))}
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Sheet>
  );
};

export default CompactTable;
