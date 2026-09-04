import Button from "../buttons/Button";
import Container from "../containers/Container";
import weekDays, { type WeekDay } from "./constants/week-days";

export interface DaySelectorProps {
  activeDay: WeekDay;
  onSelectDay: (day: WeekDay) => void;
}

const DaySelector = ({ activeDay, onSelectDay }: DaySelectorProps) => {
  return (
    <Container
      variant="secondary"
      className="p-2! shadow-xs flex flex-wrap gap-1.5"
    >
      {weekDays.map((day) => {
        const isActive = activeDay === day;
        return (
          <Button
            key={day}
            type="button"
            variant={isActive ? "primary" : "transparent-pure"}
            onClick={() => onSelectDay(day)}
            className={`flex-1 min-w-17.5 py-2 px-3 text-[12px] font-bold rounded-2xl transition-all duration-250 capitalize`}
          >
            {day.slice(0, 3)}
          </Button>
        );
      })}
    </Container>
  );
};

export default DaySelector;
