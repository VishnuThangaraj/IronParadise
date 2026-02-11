import { Button, Tooltip } from "@mui/joy";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ExportButtons = ({ data = [], fileName = "export" }) => {
  if (!data.length) return null;

  const exportData = data.map(({ _id, ...rest }) => rest);

  const headers = Object.keys(exportData[0]);

  // Copy
  const handleCopy = async () => {
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? "")).join(","),
      ),
    ].join("\n");

    await navigator.clipboard.writeText(csvContent);
  };

  // Excel
  const handleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // CSV
  const handleCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  // PDF
  const handlePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    const headers = Object.keys(exportData[0]);

    autoTable(doc, {
      head: [headers],
      body: exportData.map((row) => headers.map((h) => row[h] ?? "")),

      startY: 40,
      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: "linebreak",
      },

      headStyles: {
        fillColor: [255, 193, 7],
        textColor: 0,
        fontStyle: "bold",
      },

      tableWidth: "auto",

      margin: { top: 40, left: 40, right: 40 },

      horizontalPageBreak: true,
    });

    doc.save(`${fileName}.pdf`);
  };

  const buttons = [
    { title: "Copy", icon: "fa-copy", onClick: handleCopy },
    { title: "Excel", icon: "fa-file-excel", onClick: handleExcel },
    { title: "CSV", icon: "fa-file-csv", onClick: handleCSV },
    { title: "PDF", icon: "fa-file-pdf", onClick: handlePDF },
  ];

  return (
    <div className="flex gap-2">
      {buttons.map((btn) => (
        <Tooltip key={btn.title} title={btn.title} placement="top" arrow>
          <Button
            variant="outlined"
            color="warning"
            size="md"
            onClick={btn.onClick}
          >
            <i className={`fa-solid ${btn.icon}`} style={{ fontSize: 18 }}></i>
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ExportButtons;
