import { Sheet } from "@mui/joy";
import { DataGrid } from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";

const DataTable = ({
  rows,
  columns,
  pageSize = 5,
  checkBox = false,
  rowClick = false,
  rowClickPath = "",
  getRowId,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (params) => {
    if (!rowClick) return;
    return navigate(`${rowClickPath}/${getRowId(params.row)}`, {
      state: { edit: false },
    });
  };

  return (
    <Sheet
      sx={{
        height: 350,
        my: 2,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection={checkBox}
        onRowClick={handleRowClick}
        initialState={{
          pagination: { paginationModel: { pageSize } },
        }}
        sx={{
          border: 0,
          borderRadius: 3,
          bgcolor: "rgba(187, 221, 218, 0.048)",
          backdropFilter: "blur(10px)",
          "--DataGrid-containerBackground": "transparent",
        }}
        className="shadow-md"
      />
    </Sheet>
  );
};

export default DataTable;
