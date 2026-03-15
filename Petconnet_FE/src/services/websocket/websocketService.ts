import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  /**
   * Initialize WebSocket connection
   */
  connect(url: string, token?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(url, {
      transports: ["websocket", "polling"],
      auth: {
        token: token || localStorage.getItem("token"),
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventHandlers();

    return this.socket;
  }

  /**
   * Setup default event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", () => {
      // Handle disconnection
    });

    this.socket.on("connect_error", () => {
      this.reconnectAttempts++;
    });

    this.socket.on("error", () => {
      // Handle error
    });
  }

  /**
   * Emit event to server
   */
  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Listen to event from server
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      return;
    }
    this.socket.on(event, callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
    if (!this.socket?.connected) {
      return;
    }
    this.emit("join-room", { room });
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    if (!this.socket?.connected) {
      return;
    }
    this.emit("leave-room", { room });
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
