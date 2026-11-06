import { useEffect, useMemo, useState } from "react";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRowId,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import { LuFolderOpen } from "react-icons/lu";

export interface DataTableProps<
  T extends GridValidRowModel = GridValidRowModel,
> {
  rows: T[];
  columns: GridColDef<T>[];
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  getRowId?: (row: T) => GridRowId;
  height?: number | string;
  rowHeight?: number;
  columnHeaderHeight?: number;
  className?: string;
}

const CustomNoRowsOverlay = () => (
  <div className="h-full w-full flex flex-col items-center justify-center py-12 gap-3 select-none text-slate-400 dark:text-slate-500">
    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
      <LuFolderOpen className="w-7 h-7 text-slate-400 dark:text-slate-400" />
    </div>
    <div className="text-center">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        No records found
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
        There are no items matching your criteria.
      </p>
    </div>
  </div>
);

const CustomLoadingOverlay = () => (
  <div className="h-full w-full flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs">
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-lg">
      <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
        Loading records...
      </span>
    </div>
  </div>
);

const DataTable = <T extends GridValidRowModel = GridValidRowModel>({
  rows = [],
  columns = [],
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  checkboxSelection = false,
  disableRowSelectionOnClick = true,
  getRowId,
  height = 460,
  rowHeight = 56,
  columnHeaderHeight = 48,
  className = "",
}: DataTableProps<T>) => {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          background: {
            default: "rgba(0, 0, 0, 0)",
            paper: isDark ? "#0f172a" : "#ffffff",
          },
          text: {
            primary: isDark ? "#f8fafc" : "#1e293b",
            secondary: isDark ? "#94a3b8" : "#64748b",
          },
        },
      }),
    [isDark],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 backdrop-blur-xl shadow-xs hover:shadow-sm overflow-hidden transition-all duration-300 ${className}`}
        sx={{
          height,
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          rowHeight={rowHeight}
          columnHeaderHeight={columnHeaderHeight}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: CustomLoadingOverlay,
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize,
              },
            },
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          sx={{
            border: "none",
            fontFamily: "inherit",
            backgroundColor: "transparent",
            color: isDark ? "#f8fafc" : "#1e293b",

            // Hide column separator lines
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },

            // Column Headers
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: isDark
                ? "rgba(15, 23, 42, 0.95)"
                : "rgba(248, 250, 252, 0.95)",
              borderBottom: isDark
                ? "1px solid rgba(30, 41, 59, 0.9)"
                : "1px solid rgba(226, 232, 240, 0.8)",
            },
            "& .MuiDataGrid-columnHeader": {
              "&:focus, &:focus-within": {
                outline: "none",
              },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
              fontSize: "0.725rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: isDark ? "#94a3b8" : "#64748b",
            },

            // Rows with animated indicator bar on hover
            "& .MuiDataGrid-row": {
              borderBottom: isDark
                ? "1px solid rgba(30, 41, 59, 0.6)"
                : "1px solid rgba(241, 245, 249, 0.8)",
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              borderLeft: "3px solid transparent",
              position: "relative",
              "&:hover": {
                zIndex: 20,
                backgroundColor: isDark
                  ? "rgba(30, 41, 59, 0.7)"
                  : "rgba(241, 245, 249, 0.9)",
                borderLeftColor: isDark ? "#818cf8" : "#6366f1",
              },
              "&.Mui-selected": {
                backgroundColor: isDark
                  ? "rgba(49, 46, 129, 0.45)"
                  : "rgba(238, 242, 255, 0.85)",
                borderLeftColor: isDark ? "#6366f1" : "#4f46e5",
                "&:hover": {
                  zIndex: 20,
                  backgroundColor: isDark
                    ? "rgba(49, 46, 129, 0.65)"
                    : "rgba(224, 231, 255, 0.95)",
                },
              },
            },

            // Cells
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: isDark ? "#f1f5f9" : "#1e293b",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              "&:focus, &:focus-within": {
                outline: "none",
                zIndex: 20,
              },
            },

            // Checkbox styling
            "& .MuiCheckbox-root": {
              color: isDark ? "#475569" : "#94a3b8",
              "&.Mui-checked": {
                color: isDark ? "#818cf8" : "#6366f1",
              },
            },

            // Footer & Pagination
            "& .MuiDataGrid-footerContainer": {
              borderTop: isDark
                ? "1px solid rgba(30, 41, 59, 0.9)"
                : "1px solid rgba(226, 232, 240, 0.8)",
              backgroundColor: isDark
                ? "rgba(15, 23, 42, 0.8)"
                : "rgba(248, 250, 252, 0.7)",
              fontSize: "0.75rem",
              color: isDark ? "#94a3b8" : "#64748b",
            },
            "& .MuiTablePagination-root": {
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: "0.75rem",
            },
            "& .MuiTablePagination-select": {
              fontWeight: 600,
              color: isDark ? "#cbd5e1" : "#334155",
            },
            "& .MuiTablePagination-selectIcon": {
              color: isDark ? "#94a3b8" : "#64748b",
            },
            "& .MuiTablePagination-actions button": {
              color: isDark ? "#94a3b8" : "#64748b",
              borderRadius: "0.5rem",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(30, 41, 59, 0.8)"
                  : "rgba(226, 232, 240, 0.6)",
                color: isDark ? "#f8fafc" : "#1e293b",
              },
              "&.Mui-disabled": {
                color: isDark ? "#334155" : "#cbd5e1",
              },
            },
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default DataTable;
