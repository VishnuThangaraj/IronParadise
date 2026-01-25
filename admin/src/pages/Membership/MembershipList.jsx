import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "sonner";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";

import { MembershipColumns } from "./MembershipColumns";

import { selectAllMemberships } from "../../redux/membership/membershipSelector";
import { fetchAllMemberships } from "../../redux/membership/membershipThunks";

const MembershipList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const memberships = useSelector(selectAllMemberships);

  useEffect(() => {
    dispatch(fetchAllMemberships());
  }, [dispatch]);

  console.log(memberships);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return memberships.filter(
      (row) =>
        row.startDate?.toString().toLowerCase().includes(query) ||
        row.endDate?.toString().toLowerCase().includes(query),
    );
  }, [memberships, search]);

  return (
    <div key="MembershipList">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Membership"
        currentPath="Payment"
      />

      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <SearchBar value={search} onChange={setSearch} />

            <Button
              variant="solid"
              size="md"
              // onClick={() => navigate("/subscription/add")}
              sx={{
                px: 3,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              <i className="fa-light fa-envelopes-bulk me-2"></i>
              Notify Subscription
            </Button>
          </div>

          <DataTable
            rows={filteredRows}
            columns={MembershipColumns()}
            rowClick={true}
            getRowId={(row) => row._id}
            rowClickPath={"/member/details"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipList;
