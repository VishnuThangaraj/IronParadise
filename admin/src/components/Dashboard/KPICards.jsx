const KPICards = ({ key, title, data, border, icon, bg }) => {
  return (
    <div
      key={key}
      className={`flex flex-col w-3/12 bg-white shadow-lg p-4 rounded-lg border-b-4 ${border}`}
    >
      <div className="text-sm font-semibold text-gray-500">{title}</div>
      <div className="flex justify-between mt-1">
        <div className="text-2xl font-semibold mt-1">{data}</div>
        <div
          className={`flex justify-between items-center ${bg} px-3 py-2 rounded-md`}
        >
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
};

export default KPICards;
