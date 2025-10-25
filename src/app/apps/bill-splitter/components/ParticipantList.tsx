"use client";

import { FC } from "react";
import { Participant } from "../types";

interface Props {
  participants: Participant[];
  deleteParticipant: (id: string) => void;
}

const ParticipantList: FC<Props> = ({ participants, deleteParticipant }) => {
  return (
    <div className="flex flex-col gap-2 max-h-40 overflow-auto mt-2">
      {participants.map(p => (
        <div key={p.id} className="flex justify-between items-center p-2 bg-white/10 rounded-xl text-white">
          <span>{p.name}</span>
          <button onClick={() => deleteParticipant(p.id)} className="text-red-500 font-bold">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ParticipantList;
