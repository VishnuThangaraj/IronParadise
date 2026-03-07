import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "sonner";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { EnquiryColumns } from "./EnquiryColumns";
import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import DisplayModal from "../../components/Modal/DisplayModal";
import DeletionModal from "../../components/Modal/DeletionModal";
import ExportButtons from "../../components/DataTable/ExportButtons";

import { fetchAllEnquiry } from "../../redux/enquiry/enquiryThunks";
import { selectAllenquiries } from "../../redux/enquiry/enquirySelector";

const EnquiriesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [openMessage, SetOpenMessage] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);

  const [search, setSearch] = useState("");
  const enquiries = useSelector(selectAllenquiries);

  useEffect(() => {
    dispatch(fetchAllEnquiry());
  }, [dispatch]);

  const deleteTrainerWithId = () => {};

  const fetchCurrentEnquiry = (enquiry) => {
    setCurrentEnquiry(enquiry);
    SetOpenMessage(true);
  };

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();
    return (enquiries || []).filter(
      (row) =>
        row.firstName?.toLowerCase().includes(query) ||
        row.lastName?.toLowerCase().includes(query) ||
        row.email?.toLowerCase().includes(query) ||
        row.createdAt?.toLowerCase().includes(query) ||
        row.mobile?.includes(query) ||
        row.subject?.toLowerCase().includes(query),
    );
  }, [enquiries, search]);

  return (
    <div key="EnquiriesList">
      {" "}
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Enquiries"
        currentPath="Enquiries List"
      />
      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <ExportButtons />
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <DataTable
            rows={filteredRows.slice()}
            columns={EnquiryColumns({
              navigate,
              openDelete,
              setOpenDelete,
              setDeleteId,
              fetchCurrentEnquiry,
            })}
            getRowId={(row) => row._id}
            rowClickPath={"/enquiry/details"}
          />
        </CardContent>
      </Card>
      {/* Display Modal */}
      <DisplayModal
        open={openMessage}
        setOpen={SetOpenMessage}
        icon={`fa-duotone fa-light fa-messages`}
        origin={"Enquiry"}
        title={"Enquiry Message"}
        content={currentEnquiry?.message}
        subject={currentEnquiry?.subject}
      />
      {/* Deletion Modal */}
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        icon={`fa-duotone fa-light fa-messages`}
        origin={"Enquiry"}
        confirmation={deleteTrainerWithId}
      />
    </div>
  );
};

export default EnquiriesList;
