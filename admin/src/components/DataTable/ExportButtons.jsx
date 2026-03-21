import {Button, Tooltip} from "@mui/joy";
import * as XLSX from "xlsx";
import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {useEffect, useRef} from "react";
import {gsap} from "gsap";

const ExportButtons = ({data = [], fileName = "export"}) => {
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

    if (!data.length) return null;

    const exportData = data.map(({_id, ...rest}) => rest);
    const headers = Object.keys(exportData[0]);

    // Copy
    const handleCopy = async () => {
        const csvContent = [
            headers.join(","),
            ...exportData.map((row) =>
                headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
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
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});

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

        autoTable(doc, {
            head: [headers],
            body: exportData.map((row) => headers.map((h) => row[h] ?? "")),
        });

        doc.save(`${fileName}.pdf`);
    };

    const buttons = [
        {title: "Copy", icon: "fa-copy", onClick: handleCopy},
        {title: "Excel", icon: "fa-file-excel", onClick: handleExcel},
        {title: "CSV", icon: "fa-file-csv", onClick: handleCSV},
        {title: "PDF", icon: "fa-file-pdf", onClick: handlePDF},
    ];

    // 💥 Click animation
    const handleClickAnim = (index, callback) => {
        const el = btnRef.current[index];

        gsap.fromTo(
            el,
            {scale: 1},
            {
                scale: 0.85,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                onComplete: callback,
            }
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
                            gsap.to(e.currentTarget, {scale: 1.1, duration: 0.2})
                        }
                        onMouseLeave={(e) =>
                            gsap.to(e.currentTarget, {scale: 1, duration: 0.2})
                        }
                    >
                        <i className={`fa-solid ${btn.icon}`} style={{fontSize: 18}}></i>
                    </Button>
                </Tooltip>
            ))}
        </div>
    );
};

export default ExportButtons;