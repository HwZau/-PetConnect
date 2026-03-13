import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Socket } from "socket.io-client";
import websocketService from "../services/websocket/websocketService";
import { useAuth } from "../hooks";

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [socket] = useState<Socket | null>(null);
  const [isConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is authenticated
    // Temporarily disabled WebSocket - backend may not support it yet
    // Uncomment when backend WebSocket is ready
    /*
    if (isAuthenticated && user) {
      const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:5000";
      const token = localStorage.getItem("auth_token") || undefined;

      const socketInstance = websocketService.connect(wsUrl, token);
      setSocket(socketInstance);

      // Listen to connection status
      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      // Cleanup on unmount or when user logs out
      return () => {
        websocketService.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Disconnect if user logs out
      if (socket) {
        websocketService.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
    */
  }, [isAuthenticated, user?.id]);

  const emit = (event: string, data?: any) => {
    websocketService.emit(event, data);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    websocketService.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    websocketService.off(event, callback);
  };

  const joinRoom = (room: string) => {
    websocketService.joinRoom(room);
  };

  const leaveRoom = (room: string) => {
    websocketService.leaveRoom(room);
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export default WebSocketContext;
