import { Button, Tooltip } from "@mui/joy";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

const ExportButtons = ({ data = [], fileName = "export" }) => {
  const btnRef = useRef([]);

  // ✨ Entrance animation
  useEffect(() => {
    gsap.from(btnRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, []);

  const { exportData, headers } = useMemo(() => {
    const exports = data.map(({ _id, ...rest }) => rest);
    const hdrs = exports.length ? Object.keys(exports[0]) : [];
    return { exportData: exports, headers: hdrs };
  }, [data]);

  if (!exportData.length) return null;

  const handleCopy = async () => {
    const tsvContent = [
      headers.join("\t"),
      ...exportData.map((row) =>
        headers.map((field) => `${row[field] ?? ""}`).join("\t"),
      ),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(tsvContent);
    } catch (err) {
      console.error("Failed to copy", err);
    }
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
    URL.revokeObjectURL(link.href); // Optimize: Cleanup memory
  };

  // PDF
  const handlePDF = () => {
    const isWide = headers.length > 8;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: isWide ? "a3" : "a4",
    });

    const formatHeader = (key) =>
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

    autoTable(doc, {
      head: [headers.map(formatHeader)],
      body: exportData.map((row) => headers.map((h) => row[h] ?? "")),
      styles: {
        fontSize: isWide ? 8 : 10,
        cellPadding: 4,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [34, 34, 34],
        textColor: 255,
        fontStyle: "bold",
      },
      horizontalPageBreak: true,
      horizontalPageBreakRepeat: 0,
      margin: { top: 40, right: 30, bottom: 40, left: 30 },
    });

    doc.save(`${fileName}.pdf`);
  };

  const buttons = [
    { title: "Copy", icon: "fa-copy", onClick: handleCopy },
    { title: "Excel", icon: "fa-file-excel", onClick: handleExcel },
    { title: "CSV", icon: "fa-file-csv", onClick: handleCSV },
    { title: "PDF", icon: "fa-file-pdf", onClick: handlePDF },
  ];

  // 💥 Click animation
  const handleClickAnim = (index, callback) => {
    const el = btnRef.current[index];

    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 0.85,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        onComplete: callback,
      },
    );
  };

  return (
    <div className="flex gap-2">
      {buttons.map((btn, i) => (
        <Tooltip key={btn.title} title={btn.title} placement="top" arrow>
          <Button
            ref={(el) => (btnRef.current[i] = el)}
            variant="outlined"
            color="warning"
            size="md"
            onClick={() => handleClickAnim(i, btn.onClick)}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
            }
          >
            <i className={`fa-solid ${btn.icon}`} style={{ fontSize: 18 }}></i>
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ExportButtons;
