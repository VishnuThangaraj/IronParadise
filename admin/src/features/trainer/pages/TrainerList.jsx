import { useNavigate } from "react-router-dom";
import { LuPlus, LuTrash2, LuEye, LuPencil } from "react-icons/lu";

import useTrainerList from "../hooks/useTrainerList";
import DataTable from "@/shared/components/ui/table/DataTable";

const TrainerList = () => {
  const navigate = useNavigate();
  const { trainers, isLoading, searchQuery, setSearchQuery, deleteTrainer } =
    useTrainerList();

  const columns = [
    {
      header: "Trainer Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium sm:hidden">
            Exp: {row.experience} years
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      className: "hidden md:table-cell",
      render: (row) => (
        <span className="text-slate-500 font-medium text-[11px]">
          {row.email}
        </span>
      ),
    },
    {
      header: "Specialization",
      accessor: "specialization",
      className: "hidden sm:table-cell",
      render: (row) => (
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/70 border border-indigo-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
          {row.specialization || "General"}
        </span>
      ),
    },
    {
      header: "Shift Time",
      accessor: "shiftTime",
      className: "hidden md:table-cell",
      render: (row) => (
        <span className="text-slate-500 font-medium text-[11px]">
          {row.shiftTime}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "w-28 text-right",
      render: (row) => {
        const id = row.trainerID;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => navigate(`/trainer/details/${id}`)}
              title="View Details"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/trainer/edit/${id}`)}
              title="Edit Trainer"
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTrainer(id)}
              title="Delete Trainer"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const addButton = (
    <button
      onClick={() => navigate("/trainer/add")}
      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer animate-fade-in"
    >
      <LuPlus className="w-3.5 h-3.5" />
      <span>Add Trainer</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Trainers
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Manage your fitness trainers and their schedules.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={trainers}
        isLoading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search trainers by name, email or specialization..."
        actionButton={addButton}
        containerClassName="max-h-[460px] overflow-y-auto"
      />
    </div>
  );
};

export default TrainerList;
