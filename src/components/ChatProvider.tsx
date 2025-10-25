

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface Message {
  id: string;
  message: string;
  timestamp: Date; 
  sender: "user" | "assistant";
}

interface ChatContextProps {
  messages: Message[];
  sendMessage: (msg: string, sender?: "user" | "assistant") => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc")); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs
        .map((doc) => {
          const data = doc.data() as DocumentData;

    
          let ts: Date;
          if (data.timestamp instanceof Timestamp) {
            ts = data.timestamp.toDate();
          } else if (data.timestamp instanceof Date) {
            ts = data.timestamp;
          } else {
            ts = new Date(); 
          }

          return {
            id: doc.id,
            message: data.message,
            timestamp: ts,
            sender: data.sender || "user",
          };
        })
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (msg: string, sender: "user" | "assistant" = "user") => {
    if (!msg.trim()) return;

    await addDoc(collection(db, "messages"), {
      message: msg,
      timestamp: serverTimestamp(),
      sender,
    });
  };

  return <ChatContext.Provider value={{ messages, sendMessage }}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};








