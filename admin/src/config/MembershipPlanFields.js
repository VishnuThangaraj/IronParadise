export const initialMembershipPlanState = {
    membershipPlanId: "",
    name: "",
    durationMonths: "",
    price: "",
    features: "",
};

export const MembershipPlanFieldGroup = [
    {
        title: "Membership Plan Details",
        fields: [
            {
                label: "Membership Plan ID",
                name: "membershipPlanId",
                placeholder: "MPL-000",
                disabled: true,
                size: 50,
            },
            {
                label: "Plan Name",
                name: "name",
                placeholder: "Membership Plan Name",
                size: 50,
            },
            {
                label: "Duration (In Months)",
                name: "durationMonths",
                placeholder: "Months",
                size: 50,
            },
            {
                label: "Plan Cost ( ₹ )",
                name: "price",
                placeholder: "₹ 00.00",
                size: 50,
            },
            {
                label: "Plan Features",
                name: "features",
                placeholder: "Enter the Feature Description",
                size: 100,
            },
        ],
    },
];

export const MembershipPlanNumericFields = ["durationMonths", "price"];

export const MembershipPlanMaxLengthMap = {
    price: 5,
    durationMonths: 24,
};