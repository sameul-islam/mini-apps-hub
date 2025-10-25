"use client";

import { FC, useState } from "react";
import { Participant } from "../types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  addParticipant: (p: Participant) => void;
}

const ParticipantForm: FC<Props> = ({ addParticipant }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addParticipant({ id: uuidv4(), name });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Participant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white"
      />
      <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-black font-bold hover:bg-green-600 transition">
        Add
      </button>
    </form>
  );
};

export default ParticipantForm;
