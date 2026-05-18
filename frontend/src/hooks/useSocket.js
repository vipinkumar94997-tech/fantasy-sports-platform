import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";

export const useSocket = (matchId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!matchId) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current.emit("join-match", matchId);

    return () => {
      socketRef.current?.emit("leave-match", matchId);
      socketRef.current?.disconnect();
    };
  }, [matchId]);

  const on = (event, cb) => socketRef.current?.on(event, cb);
  const off = (event) => socketRef.current?.off(event);
  const emit = (event, data) => socketRef.current?.emit(event, data);

  return { on, off, emit };
};
