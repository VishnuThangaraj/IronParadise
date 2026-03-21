import {useDispatch, useSelector} from "react-redux";
import {Fragment, useEffect, useMemo, useState, useCallback} from "react";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
    MemberFieldGroup,
    initialMemberState,
} from "../../config/MemberFields";

import {fetchMemberCounter} from "../../redux/member/memberThunks";

import {addMemberFlow} from "../../redux/flows/addMember.flow";

import {
    selectMemberLoading,
    selectMemberCounter,
} from "../../redux/member/memberSelector";

import {fetchAllTrainers} from "../../redux/trainer/trainerThunks";
import {selectAllTrainers} from "../../redux/trainer/trainerSelectors";

import {fetchAllDietPlans} from "../../redux/dietPlan/dietPlanThunks";
import {selectAllDietPlans} from "../../redux/dietPlan/dietPlanSelector";

import {fetchAllWorkoutPlans} from "../../redux/workoutPlan/workoutPlanThunks";
import {selectAllWorkoutPlans} from "../../redux/workoutPlan/workoutPlanSelector";

import {fetchAllMembershipPlans} from "../../redux/membershipPlan/membershipPlanThunks";
import {selectAllMembershipPlans} from "../../redux/membershipPlan/membershipPlanSelectors";

import FormField from "../../components/Form/FormField";
import PageLocation from "../../components/PageLocation";

const getColSpan = (size = 50) =>
    ({
        100: "col-span-12",
        50: "col-span-6",
        30: "col-span-4",
    })[size] || "col-span-6";

const numericFields = new Set(["phone", "height", "weight"]);
const maxLengthMap = {phone: 10};
const formatDate = (d) => d.toISOString().split("T")[0];

const AddMember = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectMemberLoading);
    const counter = useSelector(selectMemberCounter);

    const trainers = useSelector(selectAllTrainers);
    const dietPlans = useSelector(selectAllDietPlans);
    const workoutPlans = useSelector(selectAllWorkoutPlans);
    const membershipPlans = useSelector(selectAllMembershipPlans);

    const [newMember, setNewMember] = useState(initialMemberState);

    useEffect(() => {
        dispatch(fetchMemberCounter({role: "member"}));
        dispatch(fetchAllTrainers());
        dispatch(fetchAllDietPlans());
        dispatch(fetchAllWorkoutPlans());
        dispatch(fetchAllMembershipPlans());
    }, [dispatch]);

    const memberId = useMemo(() => {
        if (counter < 0) return "";
        return `MBR-${String(counter + 1).padStart(3, "0")}`;
    }, [counter]);

    const selectedTrainer = useMemo(
        () => trainers.find((t) => t._id === newMember.assignedTrainer),
        [trainers, newMember.assignedTrainer],
    );

    const trainerSpecialization = selectedTrainer?.specialization || "";

    const selectedMembershipPlan = useMemo(
        () => membershipPlans.find((m) => m._id === newMember.membershipPlan),
        [membershipPlans, newMember.membershipPlan],
    );

    const membershipDerived = useMemo(() => {
        if (!selectedMembershipPlan) {
            return {
                durationMonths: "",
                price: "",
                startDate: "",
                endDate: "",
            };
        }

        const start = new Date();
        const end = new Date(start);
        end.setMonth(
            end.getMonth() + Number(selectedMembershipPlan.durationMonths),
        );

        return {
            durationMonths: selectedMembershipPlan.durationMonths,
            price: selectedMembershipPlan.price,
            startDate: formatDate(start),
            endDate: formatDate(end),
        };
    }, [selectedMembershipPlan]);

    const trainerOptions = useMemo(
        () => trainers.map((t) => ({label: t.name, value: t._id})),
        [trainers],
    );

    const dietPlanOptions = useMemo(
        () => dietPlans.map((d) => ({label: d.dietPlanName, value: d._id})),
        [dietPlans],
    );

    const workoutPlanOptions = useMemo(
        () => workoutPlans.map((w) => ({label: w.workoutPlanName, value: w._id})),
        [workoutPlans],
    );

    const membershipPlanOptions = useMemo(
        () => membershipPlans.map((m) => ({label: m.name, value: m._id})),
        [membershipPlans],
    );

    const updatedFieldGroups = useMemo(
        () =>
            MemberFieldGroup.map((group) => ({
                ...group,
                fields: group.fields.map((field) => {
                    const optionsMap = {
                        assignedTrainer: trainerOptions,
                        dietPlan: dietPlanOptions,
                        workoutPlan: workoutPlanOptions,
                        membershipPlan: membershipPlanOptions,
                    };

                    return optionsMap[field.name]
                        ? {...field, options: optionsMap[field.name]}
                        : field;
                }),
            })),
        [
            trainerOptions,
            dietPlanOptions,
            workoutPlanOptions,
            membershipPlanOptions,
        ],
    );

    const handleChange = useCallback((name, value) => {
        if (numericFields.has(name) && isNaN(value)) return;
        if (maxLengthMap[name] && value.length > maxLengthMap[name]) return;

        setNewMember((prev) => {
            const updated = {...prev, [name]: value};

            if (name === "height" || name === "weight") {
                const h = Number(updated.height) / 100;
                const w = Number(updated.weight);
                updated.bmi = h && w ? (w / (h * h)).toFixed(2) : "";
            }

            return updated;
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            price: _price,
            endDate: _endDate,
            memberId: _memberId,
            startDate: _startDate,
            durationMonths: _durationMonths,
            membershipPlan: _membershipPlan,
            trainerSpecialization: _trainerSpecialization,
            dietPlan,
            workoutPlan,
            ...member_payload
        } = newMember;

        const membership_payload = {
            ...membershipDerived,
            planId: newMember?.membershipPlan,
        };

        const fitness_payload = {
            dietPlan,
            workoutPlan,
        };

        try {
            await dispatch(
                addMemberFlow({
                    newMember: member_payload,
                    newMembership: membership_payload,
                    newFitnessPlan: fitness_payload,
                }),
            ).unwrap();
            toast.success("Member Added Successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to Add Member.");
        } finally {
            setNewMember(initialMemberState);
        }
    };

    return (
        <div>
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Members"
                currentPath="Add New Member"
            />

            <Card sx={{my: 1, mb: 4, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="text-xl font-bold border-b p-5">Add New Member</div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {updatedFieldGroups.map((group) => (
                                <Fragment key={group.title}>
                                    <div className="col-span-12 text-lg font-semibold mt-6">
                                        {group.title}
                                    </div>

                                    {group.fields.map((field) => {
                                        const derivedMap = {
                                            memberId,
                                            trainerSpecialization,
                                            ...membershipDerived,
                                        };

                                        return (
                                            <div key={field.name} className={getColSpan(field.size)}>
                                                <FormField
                                                    field={field}
                                                    value={
                                                        derivedMap[field.name] ?? newMember[field.name]
                                                    }
                                                    onChange={handleChange}
                                                    disabled={field.disabled}
                                                />
                                            </div>
                                        );
                                    })}
                                </Fragment>
                            ))}
                        </div>

                        <div className="flex justify-end px-6 py-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                sx={{
                                    px: 5,
                                    backgroundColor: "black",
                                    "&:hover": {backgroundColor: "#222"},
                                }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size="sm"/>
                                        <span className="ml-3">Adding...</span>
                                    </>
                                ) : (
                                    "Add Member"
                                )}
                            </Button>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddMember;
