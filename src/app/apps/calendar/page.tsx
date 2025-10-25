
"use client";

import React, { useState, useEffect } from "react";
import CalendarGrid from "./components/CalendarGrid";
import EventModal, { Event } from "./components/EventModal";
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaInfoCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { format, addMonths, subMonths } from "date-fns";

const STORAGE_KEY = "apphub_calendar_v2";

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split("T")[0]);


  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEvents(JSON.parse(raw));
      } catch {
        setEvents([]);
      }
    }
  }, []);


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);


  const createEventOnDate = (dateIso?: string) => {
    const date = dateIso ?? selectedDate;
    const newEvent: Event = {
      id: uuidv4(),
      title: "",
      date,
      pinned: false,
    };
    setSelectedEvent(newEvent);
    setModalOpen(true);
  };

 
  const updateEvent = (updated: Event) => {
    setEvents(prev => {
      const exists = prev.find(e => e.id === updated.id);
      if (exists) {
        return prev.map(e => (e.id === updated.id ? updated : e));
      } else {
        return [...prev, updated];
      }
    });
  };


  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setModalOpen(false);
  };


  const prevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const nextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today.toISOString().split("T")[0]);
  };


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Enter") {
        e.preventDefault();
        createEventOnDate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedDate]);

  return (
    <main className="min-h-screen w-[95%] md:w-[80%] bg-white rounded-md mx-auto p-4 md:p-6 font-Noto flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header with month navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="p-2 rounded-md bg-gray-800 text-white"
              aria-label="Previous month"
            >
              <FaChevronLeft />
            </button>

            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                {format(currentMonth, "MMMM yyyy")}
              </h1>
              <div className="text-sm text-gray-900">
                Selected: <span className="font-mono">{selectedDate}</span>
              </div>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 rounded-md bg-gray-800 text-white"
              aria-label="Next month"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-2 rounded bg-gray-800 text-white"
            >
              Today
            </button>

            <button
              onClick={() => createEventOnDate()}
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
              title="New event (Alt + Enter)"
            >
              <FaPlus /> New Event
            </button>
          </div>
        </div>

        <CalendarGrid
          events={events}
          currentMonth={currentMonth}
          onDayClick={(dateIso) => {

            setSelectedDate(dateIso);
            createEventOnDate(dateIso);
          }}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setModalOpen(true);
          }}
        />
      </div>

      {modalOpen && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
          onSave={updateEvent}
          onDelete={deleteEvent}
        />
      )}
    </main>
  );
}
