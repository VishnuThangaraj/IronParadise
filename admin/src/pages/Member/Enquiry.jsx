import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Chip,
  Modal,
  Button,
  Option,
  Input,
  Select,
  FormLabel,
  Divider,
  Tooltip,
  IconButton,
  CardContent,
  FormControl,
  DialogTitle,
  ModalDialog,
  DialogActions,
  DialogContent,
} from "@mui/joy";

import { PageLocation } from "../../components/PageLocation";

const Enquiry = () => {
  const navigate = useNavigate();

  return (
    <div id="memberenquiry">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Members"
        currentPath="Enquiry"
      />
    </div>
  );
};

export default Enquiry;
