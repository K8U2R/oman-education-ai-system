/**
 * مسارات سجل التغييرات (Changelog Routes)
 *
 * الوصف: تعريف المسارات والربط بين عناوين URL والمعالجات البرمجية.
 * السلطة الدستورية: القانون 03 (سيادة العناقيد).
 */

import { Router } from "express";
import { ChangelogController } from "./changelog.controller.js";
import { ChangelogService } from "@/modules/support/changelog/changelog.service.js";
import { container } from "@/infrastructure/di/Container.js";

const router = Router();

/**
 * حقن التبعية (DI Resolution)
 * يتم جلب الخدمة من الحاوية المركزية لضمان توافق الاعتماديات (القانون 13).
 */
const changelogService =
  container.resolve<ChangelogService>("ChangelogService");
const changelogController = new ChangelogController(changelogService);

// تعريف المسارات العامة
router.get("/", (req, res) => changelogController.getEntries(req, res));

// تعريف مسارات الإدارة (بناءً على طلب المشرفين)
router.post("/", (req, res) => changelogController.createEntry(req, res));

export default router;
