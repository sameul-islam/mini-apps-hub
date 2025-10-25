
import React from "react";
import DayCell from "./DayCell";
import { Event } from "./EventModal";
import { startOfMonth, endOfMonth, startOfWeek, addDays, format } from "date-fns";

interface CalendarGridProps {
  events: Event[];
  currentMonth: Date;
  onDayClick: (dateIso: string) => void;
  onEventClick: (event: Event) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid: React.FC<CalendarGridProps> = ({ events, currentMonth, onDayClick, onEventClick }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);

  const days: Date[] = [];
  let day = startDate;
  while (day <= monthEnd || days.length % 7 !== 0) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="w-full max-w-5xl">
      {/* Weekdays header */}
      <div className="grid grid-cols-7 font-Noto gap-1 text-center mb-1 font-semibold text-gray-900">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1">{wd}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-2 text-black sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1">
        {days.map((d, idx) => (
          <DayCell
            key={idx}
            date={d}
            events={events
              .filter(e => e.date === format(d, "yyyy-MM-dd"))
              .sort((a, b) => (Number(b.pinned || false) - Number(a.pinned || false)))}
            onEventClick={onEventClick}
            onDayClick={() => onDayClick(format(d, "yyyy-MM-dd"))}
            inCurrentMonth={format(d, "MM-yyyy") === format(monthStart, "MM-yyyy")}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
