import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
    MembershipPlanFieldGroup,
    initialMembershipPlanState,
} from "../../config/MembershipPlanFields";
import {
    selectMembershipPlanLoading,
    selectCurrentMembershipPlan,
} from "../../redux/membershipPlan/membershipPlanSelectors";

import FormField from "../../components/Form/FormField";
import PageLocation from "../../components/PageLocation";
import {useLocation, useParams} from "react-router-dom";
import {
    fetchMembershipPlanById,
    updateMembershipPlanById,
} from "../../redux/membershipPlan/membershipPlanThunks";

const getColSpan = (size) => {
    switch (size) {
        case 100:
            return "col-span-12";
        case 50:
            return "col-span-6";
        case 30:
            return "col-span-4";
        default:
            return "col-span-6";
    }
};

const MembershipPlanDetails = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectMembershipPlanLoading);

    const {id} = useParams();
    const {state} = useLocation();

    const membershipPlanId = id ?? null;
    const [editMode, setEditMode] = useState(state?.edit ?? Boolean(id));

    const membershipPlanFromStore = useSelector(selectCurrentMembershipPlan);

    const [membershipPlan, setMembershipPlan] = useState(
        initialMembershipPlanState,
    );

    useEffect(() => {
        if (membershipPlanId) {
            dispatch(fetchMembershipPlanById(membershipPlanId));
        }
    }, [membershipPlanId, dispatch]);

    useEffect(() => {
        if (membershipPlanFromStore) {
            setMembershipPlan(membershipPlanFromStore);
        }
    }, [membershipPlanFromStore]);

    const handleChange = (name, value) => {
        setMembershipPlan((prev) => {
            const updated = {...prev, [name]: value};
            return updated;
        });
    };

    const checkValidation = () => {
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = checkValidation();
        if (!validation) return;

        try {
            await dispatch(
                updateMembershipPlanById({
                    membershipPlanId: id,
                    updatedData: membershipPlan,
                }),
            ).unwrap();
            toast.success("Membership Plan Updated Successfully!");
        } catch {
            toast.error("Failed to Update Membership Plan");
        } finally {
            setEditMode(false);
        }
    };

    return (
        <div key="MembershipPlanDetails">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Fitness Plan"
                currentPath="Membership Plan Details"
            />
            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="flex justify-between border-b-2 border-gray-200 p-5">
                            <div className="text-xl font-bold ">
                                {editMode
                                    ? "Update Existing Membership Plan"
                                    : "View Existing Membership Plan"}
                            </div>
                            {!editMode && (
                                <Button
                                    className="transition-transform duration-400 hover:scale-103"
                                    variant="solid"
                                    size="md"
                                    sx={{
                                        px: 3,
                                        backgroundColor: "black",
                                        "&:hover": {backgroundColor: "#222222"},
                                    }}
                                    onClick={() => setEditMode(true)}
                                >
                                    <i className="fa-light fa-crown me-2"></i>Edit Membership Plan
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {MembershipPlanFieldGroup.map((group) => (
                                <Fragment key={`add_trainer_${group.title}`}>
                                    <div
                                        className={`col-span-12 text-lg font-semibold mt-6 ${group.classes}`}
                                    >
                                        {group.title}
                                    </div>

                                    {group.fields.map(
                                        (field) =>
                                            (!field.showIf || field.showIf(membershipPlan)) && (
                                                <div
                                                    key={field.name}
                                                    className={getColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={membershipPlan[field.name]}
                                                        onChange={handleChange}
                                                        disabled={!editMode || field.disabled}
                                                    />
                                                </div>
                                            ),
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        {editMode && (
                            <div className="flex justify-end px-6 py-3 gap-5">
                                <Button
                                    variant="outlined"
                                    type="submit"
                                    color="danger"
                                    size="md"
                                    sx={{
                                        px: 3,
                                    }}
                                    disabled={loading}
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    size="md"
                                    sx={{
                                        px: 5,
                                        backgroundColor: "black",
                                        "&:hover": {backgroundColor: "#222222"},
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Fragment>
                                            <CircularProgress variant="solid"/>{" "}
                                            <span className="ms-3">Updating ...</span>
                                        </Fragment>
                                    ) : (
                                        "Update Membership Plan"
                                    )}
                                </Button>
                            </div>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default MembershipPlanDetails;
