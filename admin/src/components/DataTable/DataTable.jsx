import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = ({ rows, columns, pageSize = 5 }) => {
  return (
    <Paper
      sx={{
        height: 420,
        my: 2,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        sx={{
          border: 0,
          borderRadius: 2,
          backgroundColor: "rgba(187, 221, 218, 0.048)",
          backdropFilter: "blur(10px)",
        }}
        className="shadow-md"
      />
    </Paper>
  );
};

export default DataTable;
