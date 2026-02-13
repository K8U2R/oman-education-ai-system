import fs from "fs";
import path from "path";
import { logger } from "../../../../shared/utils/logger.js";

type LocaleData = Record<string, string | Record<string, unknown>>;

export class TranslationService {
  private static instance: TranslationService;
  private locales: Record<string, LocaleData> = {};
  private defaultLang = "en";
  private supportedLangs = ["en", "ar"];

  private constructor() {
    this.loadLocales();
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  private loadLocales() {
    // Determine path relative to this file
    // In dev (ts-node): src/presentation/api/middleware/i18n
    // In prod (dist): dist/presentation/api/middleware/i18n
    // const localesPath = path.resolve(__dirname, '../../../../src/presentation/api/middleware/i18n/locales');

    // Fallback for production build structure if needed
    // const localesPathProd = path.resolve(__dirname, '../locales');

    this.supportedLangs.forEach((lang) => {
      try {
        // We know we placed them in src/presentation/i18n/locales during development
        // For now, let's assume we are running via tsx/ts-node where src is accessible
        // Or we need to make sure build process copies them.

        // Dynamic import logic using fs for simplicity
        const filePath = path.join(
          process.cwd(),
          `apps/backend/src/presentation/i18n/locales/${lang}/common.json`,
        );

        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          this.locales[lang] = JSON.parse(content) as LocaleData;
          logger.info(`✅ Loaded locale: ${lang}`);
        } else {
          logger.warn(`⚠️ Locale file not found: ${filePath}`);
          this.locales[lang] = {};
        }
      } catch (error) {
        logger.error(`❌ Failed to load locale ${lang}:`, error);
        this.locales[lang] = {};
      }
    });
  }

  public translate(
    key: string,
    lang: string = "en",
    params?: Record<string, string | number>,
  ): string {
    const targetLang = this.supportedLangs.includes(lang)
      ? lang
      : this.defaultLang;
    const keys = key.split(".");
    let value = this.locales[targetLang];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k] as LocaleData;
      } else {
        // Fallback to default lang if missing in target
        if (targetLang !== this.defaultLang) {
          return this.translate(key, this.defaultLang, params);
        }
        return key; // Return key if not found
      }
    }

    if (typeof value === "string" && params) {
      let text = value;
      Object.entries(params).forEach(([k, v]) => {
        // @ts-expect-error - Regex replacement on unknown type
        text = text.replace(new RegExp(`{{${k}}}`, "g"), String(v));
      });
      return text;
    }

    return typeof value === "string" ? (value as string) : key;
  }
}

export const t = (
  key: string,
  lang?: string,
  params?: Record<string, string | number>,
) => {
  return TranslationService.getInstance().translate(key, lang, params);
};
