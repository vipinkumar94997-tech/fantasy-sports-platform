import { useCallback, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";

export const useSocket = (matchId?: string) => {
  const socketRef = useRef<Socket | null>(null);

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

  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) =>
      socketRef.current?.on(event, callback),
    [],
  );
  const off = useCallback(
    (event: string, callback?: (...args: unknown[]) => void) =>
      socketRef.current?.off(event, callback),
    [],
  );
  const emit = useCallback(
    (event: string, data?: unknown) => socketRef.current?.emit(event, data),
    [],
  );

  return { on, off, emit };
};
