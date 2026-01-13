import { PageLocation } from "../../components/PageLocation";

import KPICards from "../../components/Dashboard/KPICards";
import { AdminDashboardKPIItems } from "../../config/AdminDashboardItems";

const AdminDashborard = () => {
  return (
    <div className="">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Dashboard"
        currentPath="Gym-Management"
      />
      {/* KPI Cards */}
      <div className="flex flex-row justify-evenly gap-6 mt-5">
        <div className="w-9/12">
          <div className="flex justify-between gap-5">
            {AdminDashboardKPIItems.map((kpi, index) => (
              <KPICards
                key={`admin-kpi-${index}`}
                title={kpi.title}
                data={kpi.data}
                border={kpi.border}
                icon={kpi.icon}
                bg={kpi.bg}
              />
            ))}
          </div>
        </div>
        <div className="w-3/12">hi</div>
      </div>
    </div>
  );
};

export default AdminDashborard;
