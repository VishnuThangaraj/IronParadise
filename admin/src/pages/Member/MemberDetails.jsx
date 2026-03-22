import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {fetchAllTrainers} from "../../redux/trainer/trainerThunks";
import {selectAllTrainers} from "../../redux/trainer/trainerSelectors";

import {fetchAllDietPlans} from "../../redux/dietPlan/dietPlanThunks";
import {selectAllDietPlans} from "../../redux/dietPlan/dietPlanSelector";

import {fetchAllWorkoutPlans} from "../../redux/workoutPlan/workoutPlanThunks";
import {selectAllWorkoutPlans} from "../../redux/workoutPlan/workoutPlanSelector";

import {fetchAllMembershipPlans} from "../../redux/membershipPlan/membershipPlanThunks";
import {selectAllMembershipPlans} from "../../redux/membershipPlan/membershipPlanSelectors";

import {initialMemberState, MemberFieldGroup,} from "../../config/MemberFields";

import {selectCurrentMember, selectMemberLoading,} from "../../redux/member/memberSelector";

import FormField from "../../components/Form/FormField";
import PageLocation from "../../components/PageLocation";
import {useLocation, useParams} from "react-router-dom";
import {fetchMemberById, updateMemberById,} from "../../redux/member/memberThunks";

const getColSpan = (size = 50) =>
    ({
        100: "col-span-12",
        50: "col-span-6",
        30: "col-span-4",
    })[size] || "col-span-6";

const numericFields = new Set(["phone", "height", "weight"]);
const maxLengthMap = {phone: 10};
const formatDate = (d) => d.toISOString().split("T")[0];

const MemberDetails = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectMemberLoading);

    const trainers = useSelector(selectAllTrainers);
    const dietPlans = useSelector(selectAllDietPlans);
    const workoutPlans = useSelector(selectAllWorkoutPlans);
    const membershipPlans = useSelector(selectAllMembershipPlans);

    const {id} = useParams();
    const {state} = useLocation();

    const memberId = id ?? null;
    const [editMode, setEditMode] = useState(state?.edit ?? Boolean(id));

    const memberFromStore = useSelector(selectCurrentMember);

    const [member, setMember] = useState(initialMemberState);

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    useEffect(() => {
        if (memberId) {
            dispatch(fetchMemberById(memberId));
            dispatch(fetchAllTrainers());
            dispatch(fetchAllDietPlans());
            dispatch(fetchAllWorkoutPlans());
            dispatch(fetchAllMembershipPlans());
        }
    }, [memberId, dispatch]);

    useEffect(() => {
        if (!memberFromStore) return;

        setMember((prev) => ({
            ...prev,
            ...memberFromStore,
            dob: formatDateForInput(memberFromStore.dob),
            joiningDate: formatDateForInput(memberFromStore.joiningDate),
        }));
    }, [
        memberFromStore,
        trainers.length,
        dietPlans.length,
        workoutPlans.length,
        membershipPlans.length,
    ]);

    const selectedTrainer = useMemo(
        () => trainers.find((t) => t._id === member.assignedTrainer),
        [trainers, member.assignedTrainer],
    );

    const trainerSpecialization = selectedTrainer?.specialization || "";

    const selectedMembershipPlan = useMemo(
        () => membershipPlans.find((m) => m._id === member.membershipPlan),
        [membershipPlans, member.membershipPlan],
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

        const start = member.joiningDate
            ? new Date(member.joiningDate)
            : new Date();

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
    }, [selectedMembershipPlan, member.joiningDate]);

    const trainerOptions = useMemo(
        () => trainers.map((t) => ({label: t.name, value: t._id})),
        [trainers],
    );

    const dietPlanOptions = useMemo(
        () => dietPlans.map((d) => ({label: d.dietPlanName, value: d._id})),
        [dietPlans],
    );

    const workoutPlanOptions = useMemo(
        () =>
            workoutPlans.map((w) => ({
                label: w.workoutPlanName,
                value: w._id,
            })),
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

        setMember((prev) => {
            const updated = {...prev, [name]: value};

            if (name === "height" || name === "weight") {
                const h = Number(updated.height) / 100;
                const w = Number(updated.weight);
                updated.bmi = h && w ? (w / (h * h)).toFixed(2) : "";
            }

            return updated;
        });
    }, []);

    const checkValidation = () => true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkValidation()) return;

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
        } = member;

        const membership_payload = {
            ...membershipDerived,
            planId: member?.membershipPlan,
        };

        const fitness_payload = {
            dietPlan,
            workoutPlan,
        };

        try {
            await dispatch(
                updateMemberById({
                    member: member_payload,
                    membership: membership_payload,
                    fitnessPlan: fitness_payload,
                }),
            ).unwrap();

            toast.success("Member Updated Successfully!");
        } catch {
            toast.error("Failed to Update Member");
        } finally {
            setEditMode(false);
        }
    };

    return (
        <div key="Member_Details">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Member"
                currentPath="Member Details"
            />

            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="flex justify-between border-b-2 border-gray-200 p-5">
                            <div className="text-xl font-bold ">
                                {editMode ? "Update Existing Member" : "View Existing Member"}
                            </div>

                            {!editMode && (
                                <Button
                                    variant="solid"
                                    size="md"
                                    sx={{
                                        px: 3,
                                        backgroundColor: "black",
                                        "&:hover": {backgroundColor: "#222222"},
                                    }}
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit Member
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {updatedFieldGroups.map((group) => (
                                <Fragment key={group.title}>
                                    <div className="col-span-12 text-lg font-semibold mt-6">
                                        {group.title}
                                    </div>

                                    {group.fields.map((field) => {
                                        const derivedMap = {
                                            trainerSpecialization,
                                            ...membershipDerived,
                                        };

                                        return (
                                            <div key={field.name} className={getColSpan(field.size)}>
                                                <FormField
                                                    field={field}
                                                    value={derivedMap[field.name] ?? member[field.name]}
                                                    onChange={handleChange}
                                                    disabled={!editMode || field.disabled}
                                                />
                                            </div>
                                        );
                                    })}
                                </Fragment>
                            ))}
                        </div>

                        {editMode && (
                            <div className="flex justify-end px-6 py-3 gap-5">
                                <Button
                                    variant="outlined"
                                    color="danger"
                                    onClick={() => setEditMode(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="solid"
                                    type="submit"
                                    disabled={loading}
                                    sx={{
                                        px: 5,
                                        backgroundColor: "black",
                                        "&:hover": {backgroundColor: "#222222"},
                                    }}
                                >
                                    {loading ? (
                                        <Fragment>
                                            <CircularProgress variant="solid"/>
                                            <span className="ms-3">Updating ...</span>
                                        </Fragment>
                                    ) : (
                                        "Update Member"
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

export default MemberDetails;
