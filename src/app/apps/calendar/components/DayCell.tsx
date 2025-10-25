
import React from "react";
import { Event } from "./EventModal";
import { format, isToday } from "date-fns";
import { FaThumbtack } from "react-icons/fa";

interface DayCellProps {
  date: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDayClick: () => void;
  inCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ date, events, onEventClick, onDayClick, inCurrentMonth }) => {
  const todayStyle = isToday(date) ? "ring-2 ring-black" : "";
  const outsideStyle = inCurrentMonth ? "" : "opacity-60";

  return (
    <div
      className={`border font-Noto border-gray-700 p-2 min-h-[88px] rounded flex flex-col bg-white ${todayStyle} ${outsideStyle}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold text-sm">{format(date, "d")}</div>
        <button
          className="text-xs text-black"
          onClick={(e) => {
            e.stopPropagation();
            onDayClick();
          }}
          title="Add event on this day"
        >
          + Add
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        {events.map(e => (
          <div
            key={e.id}
            className="flex items-center gap-2 justify-between bg-black text-white text-xs px-2 py-0.5 rounded cursor-pointer"
            onClick={() => onEventClick(e)}
          >
            <span className="truncate">{e.title || "No Title"}</span>
            {e.pinned ? <FaThumbtack className="text-yellow-300 text-xs" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCell;
