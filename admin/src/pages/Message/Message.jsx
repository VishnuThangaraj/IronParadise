import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";

import { fetchAllTrainers } from "../../redux/trainer/trainerThunks";
import { selectAllTrainers } from "../../redux/trainer/trainerSelectors";

import { MessageColumns } from "./MessageColumns";

import { fetchAllMembers } from "../../redux/member/memberThunks";
import { selectAllMembers } from "../../redux/member/memberSelector";
import SendMailModal from "../../components/Modal/SendMailModal";

const Message = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [openMail, setOpenMail] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);

  const members = useSelector(selectAllMembers);
  const trainers = useSelector(selectAllTrainers);

  useEffect(() => {
    dispatch(fetchAllTrainers());
    dispatch(fetchAllMembers());
  }, [dispatch]);

  const users = useMemo(() => {
    return [
      ...trainers.map((t) => ({ ...t, role: "trainer" })),
      ...members.map((m) => ({ ...m, role: "member" })),
    ];
  }, [trainers, members]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return users.filter(
      (row) =>
        row.id?.toString().toLowerCase().includes(query) ||
        row.name?.toLowerCase().includes(query) ||
        row.email?.toLowerCase().includes(query) ||
        row.address?.toLowerCase().includes(query) ||
        row.role?.toLowerCase().includes(query) ||
        row.userId?.toLowerCase().includes(query) ||
        row.memberId?.toLowerCase().includes(query) ||
        row.phone?.includes(query),
    );
  }, [users, search]);

  const handleRowSelectionChange = (selectionModel) => {
    const selectedIds = Array.from(selectionModel.ids);

    const selectedData = filteredRows.filter((row) =>
      selectedIds.includes(row._id),
    );

    const emails = selectedData.map((row) => row.email);

    setSelectedUser(emails);
  };

  const openMailModal = () => {
    setOpenMail(true);
  };

  return (
    <div key="Messages-Page_Main">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Messages"
        currentPath="Email Sender"
      />

      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <SearchBar value={search} onChange={setSearch} />

            <Button
              variant="solid"
              size="md"
              onClick={openMailModal}
              sx={{
                px: 4,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Send Email
            </Button>
          </div>

          <DataTable
            rows={filteredRows}
            columns={MessageColumns(navigate)}
            checkBox={true}
            onRowSelectionModelChange={handleRowSelectionChange}
          />
        </CardContent>
      </Card>

      <SendMailModal
        open={openMail}
        setOpen={setOpenMail}
        sender={selectedUser}
        title="Selected Users"
        icon="fa-solid fa-envelope"
      />
    </div>
  );
};

export default Message;
