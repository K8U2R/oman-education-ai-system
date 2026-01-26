/**
 * مسارات سجل التغييرات (Changelog Routes)
 * 
 * الوصف: تعريف المسارات والربط بين الـ URLs والمعالجات (Handlers).
 * يتم جلب المعالج من حاوية الحقن (DI Container) لضمان استقلالية المديول.
 * 
 * السلطة الدستورية: القانون 03 (سيادة العناقيد) و القانون 01 (العزل الصارم).
 */

import { Router } from "express";
import { container } from "@/infrastructure/di/index.js";
import { ChangelogHandler } from "../../handlers/system/changelog.handler.js";

const router = Router();

// تعريف المسارات مع حل المعالج عند الطلب (Lazy Loading)
router.get("/", (req, res) => {
    const handler = container.resolve<ChangelogHandler>("ChangelogHandler");
    return handler.getFeed(req, res);
});

router.post("/", (req, res) => {
    const handler = container.resolve<ChangelogHandler>("ChangelogHandler");
    return handler.create(req, res);
});

export default router;
