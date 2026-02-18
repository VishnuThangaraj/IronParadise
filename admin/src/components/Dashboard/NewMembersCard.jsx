const NewMembersCard = ({ members }) => {
  console.log(members);
  return (
    <div
      key="NewMembersCard"
      className="bg-white rounded-lg shadow-lg py-4 px-5"
    >
      <div className="font-semibold text-xl">New Members</div>
      {members.map((member, index) => (
        <div
          key={`wid-mem-${index}`}
          className="flex gap-3 items-center border-2 rounded-md border-gray-300 p-2 mt-5"
        >
          <img src="images/default_user_profile.webp" width={35} />
          <div className="flex flex-col">
            <div className="font-semibold text-gray-600">{member.name}</div>
            <div className="text-xs font-semibold text-gray-400">
              {member?.memberId || "ID Not Assigned"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewMembersCard;
