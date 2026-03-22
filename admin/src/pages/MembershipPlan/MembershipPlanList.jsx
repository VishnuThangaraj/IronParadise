import {useNavigate} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader.jsx";
import PageLocation from "@/components/PageLocation";
import DataTable from "@/components/DataTable/DataTable";
import SearchBar from "@/components/DataTable/SearchBar";
import DeletionModal from "@/components/Modal/DeletionModal";
import ButtonRounded from "@/components/Button/ButtonRounded";
import ExportButtons from "@/components/DataTable/ExportButtons";

import {MembershipPlanColumns} from "@/pages/MembershipPlan/MembershipPlanColumns";

import {selectAllMembershipPlans} from "@/redux/membershipPlan/membershipPlanSelectors";
import {deleteMembershipPlanById, fetchAllMembershipPlans,} from "@/redux/membershipPlan/membershipPlanThunks";

const MembershipPlanList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const [search, setSearch] = useState("");
    const membershipPlans = useSelector(selectAllMembershipPlans);

    useEffect(() => {
        dispatch(fetchAllMembershipPlans());
    }, [dispatch]);

    const filteredRows = useMemo(() => {
        if (!search) return membershipPlans;

        const query = search.toLowerCase();

        return membershipPlans.filter((row) => {
            return [
                row?.membershipPlanId,
                row?.name,
                row?.durationMonths,
                row?.price,
                row?.features,
            ]
                .filter(Boolean)
                .some((value) =>
                    value.toString().toLowerCase().includes(query)
                );
        });
    }, [membershipPlans, search]);

    const deleteMembershipPlanWithId = async (e) => {
        e.preventDefault();

        try {
            await dispatch(deleteMembershipPlanById({membershipPlanId: deleteId})).unwrap();
            toast.success("Membership plan deleted successfully");
        } catch (error) {
            toast.warning(error?.message || "Failed to delete Membership plan");
        } finally {
            setDeleteId(null);
            setOpenDelete(false);
        }
    };

    if (membershipPlans == null) return <Loader/>;

    return (
        <div key="MembershipPlan-List">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Membership"
                currentPath="Membership Plan List"
            />
            <Card className="shadow-md" sx={{my: 2, p: 4}}>
                <CardContent>
                    <div className="flex justify-between items-center mb-3 gap-3">
                        <ExportButtons data={filteredRows.slice()}
                                       fileName="membership_plans"/>
                        <SearchBar value={search} onChange={setSearch}/>

                        <ButtonRounded location={"/subscription/add"}>
                            Add New Plan
                        </ButtonRounded>
                    </div>

                    <DataTable
                        rows={filteredRows}
                        columns={MembershipPlanColumns({
                            navigate,
                            setDeleteId,
                            setOpenDelete,
                        })}
                        rowClick={true}
                        getRowId={(row) => row._id}
                        rowClickPath={"/subscription/details"}
                    />
                </CardContent>
            </Card>

            {/* Deletion Modal */}
            <DeletionModal
                open={openDelete}
                setOpen={setOpenDelete}
                icon={`fa-chisel fa-regular fa-crown`}
                origin={"Membership Plan"}
                confirmation={deleteMembershipPlanWithId}
            />
        </div>
    );
};

export default MembershipPlanList;
