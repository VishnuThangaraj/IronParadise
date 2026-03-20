import {useDispatch, useSelector} from "react-redux";
import {Fragment, useEffect, useMemo, useState} from "react";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import Loader from "@/components/Loader"
import FormField from "@/components/Form/FormField";
import {PageLocation} from "@/components/PageLocation";

import {formFieldColSpan, validateFields} from "@/config/FormFieldConfig";
import {
    initialMembershipPlanState,
    MembershipPlanFieldGroup,
    MembershipPlanMaxLengthMap,
    MembershipPlanNumericFields
} from "@/config/MembershipPlanFields";

import {selectCounter} from "@/redux/counter/counterSelector";
import {fetchCounter} from "@/redux/counter/counterThunks";
import {addNewMembershipPlan} from "@/redux/membershipPlan/membershipPlanThunks";
import {selectMembershipPlanLoading} from "@/redux/membershipPlan/membershipPlanSelectors";

const AddMembershipPlan = () => {
    const dispatch = useDispatch();

    const counter = useSelector(selectCounter);
    const loading = useSelector(selectMembershipPlanLoading);

    const membershipPlanId = useMemo(() => {
        if (counter < 0) return "";
        return `MPL-${String(counter + 1).padStart(3, "0")}`;
    }, [counter]);

    const [newMembershipPlan, setNewMembershipPlan] = useState(
        initialMembershipPlanState
    );

    useEffect(() => {
        dispatch(fetchCounter({identity: "membershipplan"}));
    }, [dispatch]);

    const handleChange = (name, value) => {
        if (MembershipPlanNumericFields.includes(name) && isNaN(Number(value))) return;

        if (MembershipPlanMaxLengthMap[name] && value.length > MembershipPlanMaxLengthMap[name]) return;

        setNewMembershipPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...newMembershipPlan,
            membershipPlanId,
        };

        if (!validateFields(payload)) return;

        try {
            await dispatch(addNewMembershipPlan({newMembershipPlan: payload})).unwrap();
            await dispatch(fetchCounter({identity: "membershipplan"})).unwrap();

            toast.success("Membership Plan Added Successfully!");

            setNewMembershipPlan(initialMembershipPlanState);

        } catch (error) {
            toast.warning(error?.message || "Failed to Add Membership Plan");
        }
    };

    if (counter < 0) return <Loader/>;

    return (
        <div key="MembershipPlan-Add">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Membership"
                currentPath="Membership Plan List"
            />

            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
                            Add New Membership Plan
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {MembershipPlanFieldGroup.map((group) => (
                                <Fragment key={`add_trainer_${group.title}`}>
                                    <div className="col-span-12 text-lg font-semibold mt-6">
                                        {group.title}
                                    </div>

                                    {group?.fields.map(
                                        (field) =>
                                            (!field.showIf || field.showIf(newMembershipPlan)) && (
                                                <div
                                                    key={field.name}
                                                    className={formFieldColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={
                                                            field.name === "membershipPlanId"
                                                                ? membershipPlanId
                                                                : newMembershipPlan[field.name]
                                                        }
                                                        onChange={handleChange}
                                                        disabled={field?.disabled ?? false}
                                                    />
                                                </div>
                                            )
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        <div className="flex justify-end px-6 py-3">
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
                                        <CircularProgress variant="solid"/>
                                        <span className="ms-3">Adding ...</span>
                                    </Fragment>
                                ) : (
                                    "Add Membership Plan"
                                )}
                            </Button>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddMembershipPlan;