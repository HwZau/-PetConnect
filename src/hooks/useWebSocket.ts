import { useEffect, useRef } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

/**
 * Custom hook to listen to WebSocket events
 * Automatically handles cleanup
 */
export const useWebSocketEvent = (
  event: string,
  callback: (...args: any[]) => void,
  dependencies: any[] = []
) => {
  const { on, off, isConnected } = useWebSocket();
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isConnected) return;

    const handler = (...args: any[]) => {
      callbackRef.current(...args);
    };

    on(event, handler);

    return () => {
      off(event, handler);
    };
  }, [event, isConnected, on, off, ...dependencies]);
};

/**
 * Custom hook to emit WebSocket events
 */
export const useWebSocketEmit = () => {
  const { emit, isConnected } = useWebSocket();

  return {
    emit: (event: string, data?: any) => {
      if (!isConnected) {
        return;
      }
      emit(event, data);
    },
    isConnected,
  };
};

/**
 * Custom hook to manage room joining/leaving
 */
export const useWebSocketRoom = (room: string, autoJoin = true) => {
  const { joinRoom, leaveRoom, isConnected } = useWebSocket();

  useEffect(() => {
    if (autoJoin && isConnected && room) {
      joinRoom(room);

      return () => {
        leaveRoom(room);
      };
    }
  }, [room, autoJoin, isConnected, joinRoom, leaveRoom]);

  return {
    joinRoom: () => joinRoom(room),
    leaveRoom: () => leaveRoom(room),
    isConnected,
  };
};

export default {
  useWebSocketEvent,
  useWebSocketEmit,
  useWebSocketRoom,
};
