import {useNavigate} from "react-router-dom";
import {useState, useMemo, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import {toast} from "sonner";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import {MemberColumns} from "./MemberColumns";
import PageLocation from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import ExportButtons from "../../components/DataTable/ExportButtons";

import {
    deleteMemberById,
    fetchAllMembers,
} from "../../redux/member/memberThunks";
import {selectAllMembers} from "../../redux/member/memberSelector";

import {fetchAllMemberships} from "../../redux/membership/membershipThunks";
import {selectAllMemberships} from "../../redux/membership/membershipSelector";

import DeletionModal from "../../components/Modal/DeletionModal";

const MembersList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const [search, setSearch] = useState("");
    const members = useSelector(selectAllMembers);

    const memberships = useSelector(selectAllMemberships);

    useEffect(() => {
        dispatch(fetchAllMembers());
        dispatch(fetchAllMemberships());
    }, [dispatch]);

    const membersWithMembership = useMemo(() => {
        if (!members.length || !memberships.length) return members;

        const membershipsMap = memberships.reduce((acc, membership) => {
            acc[membership.memberObjectId] = membership.planName;
            return acc;
        }, {});

        return members.map((member) => ({
            ...member,
            membershipName: membershipsMap[member._id] || "Not Assigned",
        }));
    }, [members, memberships]);

    const filteredRows = useMemo(() => {
        const query = search.toLowerCase();

        return membersWithMembership?.filter(
            (row) =>
                row.memberId?.toString().toLowerCase().includes(query) ||
                row.name?.toLowerCase().includes(query) ||
                row.email?.toLowerCase().includes(query) ||
                row.trainerName?.toLowerCase().includes(query) ||
                row.mobile?.includes(query),
        );
    }, [membersWithMembership, search]);

    const checkValidation = () => {
        return true;
    };

    const deleteTrainerWithId = async (e) => {
        e.preventDefault();
        const validation = checkValidation();
        if (!validation) return;

        try {
            await dispatch(deleteMemberById({trainerId: deleteId}));
            toast.success("Member Deleted Successfully");
        } catch {
            toast.error("Failed to Delete Member");
        } finally {
            setDeleteId(null);
            setOpenDelete(false);
        }
    };

    return (
        <div key="Members-List">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Member"
                currentPath="Members List"
            />

            <Card className="shadow-md" sx={{my: 2, p: 4}}>
                <CardContent>
                    <div className="flex justify-between items-center mb-3 gap-3">
                        <ExportButtons/>
                        <SearchBar value={search} onChange={setSearch}/>

                        <Button
                            variant="solid"
                            size="md"
                            onClick={() => navigate("/member/add")}
                            sx={{
                                px: 4,
                                borderRadius: 20,
                                bgcolor: "black",
                                "&:hover": {bgcolor: "#222"},
                            }}
                        >
                            Add New Member
                        </Button>
                    </div>

                    <DataTable
                        rows={filteredRows}
                        columns={MemberColumns({
                            navigate,
                            openDelete,
                            setOpenDelete,
                            setDeleteId,
                        })}
                        rowClick={true}
                        getRowId={(row) => row._id}
                        rowClickPath={"/member/details"}
                    />

                    {/* Deletion Modal */}
                    <DeletionModal
                        open={openDelete}
                        setOpen={setOpenDelete}
                        icon={`fa-light fa-user-slash`}
                        origin={"Member"}
                        confirmation={deleteTrainerWithId}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default MembersList;
