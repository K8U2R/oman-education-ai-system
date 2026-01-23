import { Request, Response } from "express";
import { StorageService } from "@/application/services/storage/StorageService.js";
import multer from "multer";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

const upload = multer({ dest: "uploads/" });

export class StorageHandler extends BaseHandler {
  /**
   * إنشاء Storage Handler
   *
   * @param storageService - خدمة التخزين
   */
  constructor(private readonly storageService: StorageService) {
    super();
  }

  /**
   * Multer middleware for file uploads
   */
  uploadMiddleware = upload.single("file");

  /**
   * معالج جلب جميع مزودي التخزين
   *
   * GET /api/v1/storage/providers
   */
  getProviders = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const providers = await this.storageService.getProviders();
        this.ok(res, { providers });
      },
      "فشل جلب مزودي التخزين",
    );
  };

  /**
   * معالج جلب مزود تخزين محدد
   *
   * GET /api/v1/storage/providers/:id
   */
  getProvider = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const provider = await this.storageService.getProvider(id);
        this.ok(res, provider);
      },
      "فشل جلب مزود التخزين",
    );
  };

  /**
   * معالج جلب اتصالات المستخدم
   *
   * GET /api/v1/storage/connections
   */
  getUserConnections = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const connections =
          await this.storageService.getUserConnections(userId);
        this.ok(res, { connections });
      },
      "فشل جلب اتصالات التخزين",
    );
  };

  /**
   * معالج الاتصال بمزود تخزين
   *
   * POST /api/v1/storage/providers/:id/connect
   */
  connectProvider = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: providerId } = req.params;
        const result = await this.storageService.connectProvider(
          userId,
          providerId,
        );
        this.ok(res, result);
      },
      "فشل الاتصال بمزود التخزين",
    );
  };

  /**
   * معالج قطع الاتصال بمزود تخزين
   *
   * POST /api/v1/storage/connections/:id/disconnect
   */
  disconnectProvider = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId } = req.params;
        await this.storageService.disconnectProvider(userId, connectionId);
        this.ok(res, { message: "تم قطع الاتصال بنجاح" });
      },
      "فشل قطع الاتصال بمزود التخزين",
    );
  };

  /**
   * معالج تحديث token الاتصال
   *
   * POST /api/v1/storage/connections/:id/refresh
   */
  refreshConnection = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId } = req.params;
        await this.storageService.refreshConnection(userId, connectionId);
        this.ok(res, { message: "تم تحديث الاتصال بنجاح" });
      },
      "فشل تحديث اتصال التخزين",
    );
  };

  /**
   * معالج قائمة الملفات
   *
   * GET /api/v1/storage/connections/:id/files
   */
  listFiles = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId } = req.params;
        const folderId = req.query.folder_id as string | undefined;
        const fileType = req.query.file_type as string | undefined;

        const files = await this.storageService.listFiles(
          userId,
          connectionId,
          folderId,
          fileType,
        );
        this.ok(res, { files });
      },
      "فشل جلب الملفات",
    );
  };

  /**
   * معالج قائمة المجلدات
   *
   * GET /api/v1/storage/connections/:id/folders
   */
  listFolders = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId } = req.params;
        const parentFolderId = req.query.parent_folder_id as string | undefined;

        const folders = await this.storageService.listFolders(
          userId,
          connectionId,
          parentFolderId,
        );
        this.ok(res, { folders });
      },
      "فشل جلب المجلدات",
    );
  };

  /**
   * معالج رفع ملف
   *
   * POST /api/v1/storage/connections/:id/files/upload
   */
  uploadFile = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        if (!req.file) {
          // Corrected badRequest call
          this.badRequest(res, "لم يتم رفع ملف");
          return;
        }

        const { id: connectionId } = req.params;
        const parentFolderId = req.body.parent_folder_id as string | undefined;

        const file = await this.storageService.uploadFile(
          userId,
          connectionId,
          req.file,
          parentFolderId,
        );
        this.ok(res, file);
      },
      "فشل رفع الملف",
    );
  };

  /**
   * معالج تنزيل ملف
   *
   * GET /api/v1/storage/connections/:id/files/:fileId/download
   */
  downloadFile = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId, fileId } = req.params;
        const fileBuffer = await this.storageService.downloadFile(
          userId,
          connectionId,
          fileId,
        );

        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="file"`);
        res.status(200).send(fileBuffer);
      },
      "فشل تنزيل الملف",
    );
  };

  /**
   * معالج حذف ملف
   *
   * DELETE /api/v1/storage/connections/:id/files/:fileId
   */
  deleteFile = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId, fileId } = req.params;
        await this.storageService.deleteFile(userId, connectionId, fileId);
        this.ok(res, { message: "تم حذف الملف بنجاح" });
      },
      "فشل حذف الملف",
    );
  };

  /**
   * معالج إنشاء مجلد
   *
   * POST /api/v1/storage/connections/:id/folders
   */
  createFolder = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId } = req.params;
        const { name, parent_folder_id } = req.body;

        if (!name) {
          // Corrected badRequest call
          this.badRequest(res, "اسم المجلد مطلوب");
          return;
        }

        const folder = await this.storageService.createFolder(
          userId,
          connectionId,
          name,
          parent_folder_id,
        );
        this.created(res, folder);
      },
      "فشل إنشاء المجلد",
    );
  };

  /**
   * معالج تصدير ملف إلى Office
   *
   * POST /api/v1/storage/connections/:id/files/:fileId/export
   */
  exportToOffice = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id: connectionId, fileId } = req.params;
        const { format, output_folder_id } = req.body;

        if (!format || !["word", "excel", "powerpoint"].includes(format)) {
          // Corrected badRequest call
          this.badRequest(res, "تنسيق التصدير غير صحيح");
          return;
        }

        const result = await this.storageService.exportToOffice(
          userId,
          connectionId,
          fileId,
          format,
          output_folder_id,
        );
        this.ok(res, result);
      },
      "فشل تصدير الملف",
    );
  };
}
