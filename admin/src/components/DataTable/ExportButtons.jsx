import { Button, Tooltip } from "@mui/joy";

const buttons = [
  { title: "Copy", icon: "fa-copy", color: "warning", onClick: () => {} },
  {
    title: "Excel",
    icon: "fa-file-excel",
    color: "warning",
    onClick: () => {},
  },
  { title: "CSV", icon: "fa-file-csv", color: "warning", onClick: () => {} },
  { title: "PDF", icon: "fa-file-pdf", color: "warning", onClick: () => {} },
];

const ExportButtons = () => {
  return (
    <div className="flex gap-2">
      {buttons.map((btn) => (
        <Tooltip key={btn.title} title={btn.title} placement="top" arrow>
          <Button
            variant="outlined"
            color={btn.color}
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
