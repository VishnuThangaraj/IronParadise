import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader";
import FormField from "@/components/Form/FormField";
import PageLocation from "@/components/PageLocation";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import ButtonOutlined from "@/components/Button/ButtonOutlined";

import {handleChangeValidation, validateFields} from "@/utils/FormFieldValidation"

import {formFieldColSpan} from "@/config/FormFieldConfig";
import {
    initialMembershipPlanState,
    MembershipPlanFieldGroup,
    MembershipPlanRules,
} from "@/config/MembershipPlanFields";
import {
    selectCurrentMembershipPlan,
    selectMembershipPlanLoading,
} from "@/redux/membershipPlan/membershipPlanSelectors";

import {fetchMembershipPlanById, updateMembershipPlanById,} from "@/redux/membershipPlan/membershipPlanThunks";

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
        const rules = MembershipPlanRules[name];
        if (!handleChangeValidation(value, rules)) return;

        setMembershipPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields(membershipPlan)) return;

        try {
            await dispatch(
                updateMembershipPlanById({
                    membershipPlanId: id,
                    updatedData: membershipPlan,
                }),
            ).unwrap();
            toast.success("Membership Plan Updated Successfully!");
            setEditMode(false);
        } catch (error) {
            toast.warning(error?.message || "Failed to Update Membership Plan");
        }
    };

    if (!membershipPlan) return <Loader/>;

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
                                <ButtonPrimary
                                    onClick={() => setEditMode(true)}
                                >
                                    <i className="fa-duotone fa-solid fa-pen-to-square me-2"></i>Edit Membership Plan
                                </ButtonPrimary>
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
                                                    className={formFieldColSpan(field.size)}
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
                                <ButtonOutlined
                                    color="danger"
                                    loading={loading}
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </ButtonOutlined>
                                <ButtonPrimary
                                    loading={loading}
                                    loadingText={"Updating ..."}
                                >
                                    Update Membership Plan
                                </ButtonPrimary>
                            </div>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default MembershipPlanDetails;
