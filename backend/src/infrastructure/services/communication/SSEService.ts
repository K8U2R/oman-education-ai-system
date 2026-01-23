import { Response } from "express";
import { logger } from "@/shared/utils/logger";
import { v4 as uuidv4 } from "uuid";

interface SSEClient {
  id: string;
  userId: string;
  res: Response;
}

export class SSEService {
  private static instance: SSEService;
  private clients: Map<string, SSEClient[]> = new Map();

  private constructor() {}

  public static getInstance(): SSEService {
    if (!SSEService.instance) {
      SSEService.instance = new SSEService();
    }
    return SSEService.instance;
  }

  /**
   * Add a new client connection
   */
  public addClient(userId: string, res: Response): string {
    const clientId = uuidv4();

    // Headers for SSE
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Nginx specific
    });

    const client: SSEClient = { id: clientId, userId, res };

    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    this.clients.get(userId)?.push(client);

    logger.debug(`[SSEService] Client connected: ${userId} (${clientId})`);

    // Send initial "Pulse"
    this.sendToUser(userId, { type: "connected", clientId });

    // Handle close
    res.on("close", () => {
      this.removeClient(userId, clientId);
    });

    return clientId;
  }

  /**
   * Remove a client connection
   */
  public removeClient(userId: string, clientId: string): void {
    const userClients = this.clients.get(userId);
    if (!userClients) return;

    this.clients.set(
      userId,
      userClients.filter((c) => c.id !== clientId),
    );

    logger.debug(`[SSEService] Client disconnected: ${userId} (${clientId})`);
  }

  /**
   * Send data to a specific user (all their active tabs)
   */
  public sendToUser(userId: string, data: unknown): void {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.length === 0) return;

    const formattedData = `data: ${JSON.stringify(data)}\n\n`;

    userClients.forEach((client) => {
      client.res.write(formattedData);
    });
  }

  /**
   * Check if user uses Guest ID or Auth ID and send accordingly
   */
  public streamToken(userId: string, token: string): void {
    this.sendToUser(userId, { token });
  }
}
