import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Card, Button, CardContent } from "@mui/joy";
import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import { MembershipPlanColumns } from "./MembershipPlanColumns";
import ExportButtons from "../../components/DataTable/ExportButtons";

import { fetchAllMembershipPlans } from "../../redux/membershipPlan/membershipPlanThunks";
import { selectAllMembershipPlans } from "../../redux/membershipPlan/membershipPlanSelectors";

const MembershipPlanList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const membershipPlans = useSelector(selectAllMembershipPlans);

  useEffect(() => {
    dispatch(fetchAllMembershipPlans());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return membershipPlans.filter(
      (row) =>
        row.membershipPlanId?.toString().toLowerCase().includes(query) ||
        row.name?.toString().toLowerCase().includes(query) ||
        row.durationMonths?.toString().toLowerCase().includes(query) ||
        row.price?.toString().toLowerCase().includes(query) ||
        row.features?.toString().toLowerCase().includes(query)
    );
  }, [membershipPlans, search]);

  return (
    <div key="MembershipPlan-List">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Membership"
        currentPath="Membership Plan List"
      />
      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <ExportButtons />
            <SearchBar value={search} onChange={setSearch} />

            <Button
              variant="solid"
              size="md"
              onClick={() => navigate("/subscription/add")}
              sx={{
                px: 4,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Add New Membership Plan
            </Button>
          </div>

          <DataTable
            rows={filteredRows}
            columns={MembershipPlanColumns(navigate)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipPlanList;
