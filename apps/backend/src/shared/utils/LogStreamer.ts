/**
 * Log Streamer - نظام بث السجلات
 *
 * الوصف: محرك بث السجلات في الوقت الفعلي باستخدام EventEmitter.
 * يقوم بالاستماع لكل حدث تدوين وبثه للمشتركين (SSE).
 *
 * السلطة الدستورية: القانون 10 (السيادة السياقية).
 */

import { EventEmitter } from "events";
import { logger } from "./logger.js";
import Transport from "winston-transport";

/**
 * وسيط النقل المخصص لوينستون للبث
 */
class BroadcastTransport extends Transport {
  constructor(private emitter: EventEmitter) {
    super();
  }

  log(info: Record<string, unknown>, callback: () => void) {
    setImmediate(() => {
      this.emitter.emit("log", info);
    });
    callback();
  }
}

class LogStreamer extends EventEmitter {
  constructor() {
    super();
    this.initialize();
  }

  private initialize() {
    // إضافة وسيط النقل للبث إلى سجل النظام
    logger.add(new BroadcastTransport(this));
  }

  /**
   * اشتراك مستخدم جديد في البث
   */
  public subscribe(callback: (log: Record<string, unknown>) => void) {
    this.on("log", callback);
    return () => this.off("log", callback);
  }
}

export const logStreamer = new LogStreamer();
