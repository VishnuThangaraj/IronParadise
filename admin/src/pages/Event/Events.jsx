import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { PageLocation } from "../../components/PageLocation";
import { useNavigate } from "react-router-dom";

import Calendar from "../../components/Calendar";

const Events = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Calendar"
        currentPath="Events"
      />

      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between flex-col-reverse items-end mb-3 gap-3">
            <Button
              variant="solid"
              size="md"
              onClick={() => navigate("/events/add")}
              sx={{
                px: 4,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              <i className="fa-light fa-calendar-circle-plus me-2"></i>
              Add Event
            </Button>
          </div>

          <Calendar />
          {/* <DataTable rows={filteredRows} columns={DietPlanColumns(navigate)} /> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
