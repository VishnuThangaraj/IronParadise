const AddMemberCard = ({ navigate }) => {
  return (
    <div
      key={`Add-member-card-dashboard`}
      className="w-full flex justify-between items-center bg-teal-50 p-3 shadow-md rounded-lg"
    >
      <div className="text-gray-600 text-sm">
        let&apos;s add new member
        <div
          className="text-green-900 text-base underline font-semibold py-1 cursor-pointer ps-2"
          onClick={() => navigate("/member/add")}
        >
          + Add Member
        </div>
      </div>
      <div className="items-center">
        <img src="images/dashboard_women.webp" width={75} />
      </div>
    </div>
  );
};

export default AddMemberCard;
