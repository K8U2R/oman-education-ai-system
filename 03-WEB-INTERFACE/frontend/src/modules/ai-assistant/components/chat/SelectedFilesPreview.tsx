import React, { useState, useEffect } from 'react';
import { 
  X, 
  File, 
  Folder, 
  FileText, 
  FileArchive, 
  FileVideo, 
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileImage
} from 'lucide-react';

interface SelectedFilesPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  variant?: 'center' | 'regular';
}

/**
 * تحديد نوع الملف وإرجاع الأيقونة والوصف المناسب
 */
const getFileInfo = (file: File): { icon: React.ReactNode; type: string; color: string } => {
  const name = file.name.toLowerCase();
  const type = file.type;

  // صور
  if (type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name)) {
    return {
      icon: <FileImage className="w-5 h-5" />,
      type: 'صورة',
      color: 'from-blue-500 to-blue-600'
    };
  }

  // PDF
  if (/\.(pdf)$/i.test(name)) {
    return {
      icon: <FileText className="w-5 h-5" />,
      type: 'مستند PDF',
      color: 'from-red-500 to-red-600'
    };
  }

  // ملفات مضغوطة
  if (/\.(zip|rar|7z|tar|gz)$/i.test(name)) {
    return {
      icon: <FileArchive className="w-5 h-5" />,
      type: 'ملف مضغوط',
      color: 'from-purple-500 to-purple-600'
    };
  }

  // فيديو
  if (type.startsWith('video/') || /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(name)) {
    return {
      icon: <FileVideo className="w-5 h-5" />,
      type: 'فيديو',
      color: 'from-red-500 to-red-600'
    };
  }

  // صوت
  if (type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|aac)$/i.test(name)) {
    return {
      icon: <FileAudio className="w-5 h-5" />,
      type: 'صوت',
      color: 'from-green-500 to-green-600'
    };
  }

  // كود
  if (/\.(js|ts|jsx|tsx|py|java|cpp|c|html|css|scss|json|xml|yaml|yml)$/i.test(name)) {
    return {
      icon: <FileCode className="w-5 h-5" />,
      type: 'كود',
      color: 'from-yellow-500 to-yellow-600'
    };
  }

  // جداول
  if (/\.(xls|xlsx|csv)$/i.test(name)) {
    return {
      icon: <FileSpreadsheet className="w-5 h-5" />,
      type: 'جدول',
      color: 'from-emerald-500 to-emerald-600'
    };
  }

  // PDF (أحمر)
  if (/\.(pdf)$/i.test(name)) {
    return {
      icon: <FileText className="w-5 h-5" />,
      type: 'مستند PDF',
      color: 'from-red-500 to-red-600'
    };
  }

  // مستندات أخرى
  if (/\.(doc|docx|txt|rtf)$/i.test(name)) {
    return {
      icon: <FileText className="w-5 h-5" />,
      type: 'مستند',
      color: 'from-indigo-500 to-indigo-600'
    };
  }


  // افتراضي
  return {
    icon: <File className="w-5 h-5" />,
    type: 'ملف',
    color: 'from-gray-500 to-gray-600'
  };
};

/**
 * تنسيق حجم الملف
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * مكون لعرض الملفات المحددة بشكل احترافي
 */
export const SelectedFilesPreview: React.FC<SelectedFilesPreviewProps> = ({
  files,
  onRemove,
  variant = 'regular',
}) => {
  if (files.length === 0) return null;

  // معاينة الصور (دائرية مع حدود وظلال)
  const ImagePreview: React.FC<{ file: File; index: number }> = ({ file, index }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }, [file, preview]);

    if (!preview) return null;

    return (
      <div className="relative group">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-ide-surface border-2 border-ide-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ring-2 ring-ide-border/20">
          <img
            src={preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => onRemove(index)}
          className="absolute -top-1 -right-1 w-6 h-6 bg-black/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
          aria-label="حذف"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    );
  };

  // تجميع الملفات حسب المجلد
  const groupFilesByFolder = (files: File[]) => {
    const folders = new Map<string, File[]>();
    const standaloneFiles: File[] = [];

    files.forEach((file) => {
      if (file.webkitRelativePath) {
        const folderPath = file.webkitRelativePath.split('/')[0];
        if (!folders.has(folderPath)) {
          folders.set(folderPath, []);
        }
        folders.get(folderPath)!.push(file);
      } else {
        standaloneFiles.push(file);
      }
    });

    return { folders, standaloneFiles };
  };

  // بطاقة ملف احترافية
  const FileCard: React.FC<{ file: File; index: number }> = ({ file, index }) => {
    const fileInfo = getFileInfo(file);
    const isImage = file.type.startsWith('image/');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
      return () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
      };
    }, [file, isImage, imagePreview]);

    if (isImage && imagePreview) {
      return <ImagePreview file={file} index={index} />;
    }

    return (
      <div className="relative group bg-ide-surface/90 backdrop-blur-sm border border-ide-border/50 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-0 max-w-full chat-animate-scale-in">
        {/* أيقونة الملف */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${fileInfo.color} flex items-center justify-center mb-2 sm:mb-3 shadow-lg ring-2 ring-white/10`}>
          <div className="text-white drop-shadow-sm">
            {fileInfo.icon}
          </div>
        </div>

        {/* معلومات الملف */}
        <div className="space-y-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-ide-text truncate chat-text-primary leading-tight">
            {file.name}
          </h4>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] sm:text-xs text-ide-text-secondary chat-text-secondary font-medium">
              {fileInfo.type}
            </span>
            <span className="text-[10px] sm:text-xs text-ide-text-secondary/70 chat-text-secondary">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>

        {/* زر الحذف */}
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 w-6 h-6 bg-black/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
          aria-label="حذف الملف"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    );
  };

  // بطاقة مجلد احترافية
  const FolderCard: React.FC<{ folderName: string; folderFiles: File[]; startIndex: number }> = ({ 
    folderName, 
    folderFiles, 
    startIndex 
  }) => {
    const totalSize = folderFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = folderFiles.length;

    const handleRemoveFolder = () => {
      // حذف جميع ملفات المجلد
      for (let i = 0; i < fileCount; i++) {
        onRemove(startIndex);
      }
    };

    return (
      <div className="relative group bg-ide-surface/90 backdrop-blur-sm border border-ide-border/50 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-0 max-w-full chat-animate-scale-in">
        {/* أيقونة المجلد */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg ring-2 ring-white/10">
          <Folder className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
        </div>

        {/* معلومات المجلد */}
        <div className="space-y-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-ide-text truncate chat-text-primary leading-tight">
            {folderName}
          </h4>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] sm:text-xs text-ide-text-secondary chat-text-secondary font-medium">
              مجلد
            </span>
            <span className="text-[10px] sm:text-xs text-ide-text-secondary/70 chat-text-secondary">
              {fileCount} ملف • {formatFileSize(totalSize)}
            </span>
          </div>
        </div>

        {/* زر الحذف */}
        <button
          onClick={handleRemoveFolder}
          className="absolute top-2 right-2 w-6 h-6 bg-black/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
          aria-label="حذف المجلد"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    );
  };

  // تجميع الملفات
  const { folders, standaloneFiles } = groupFilesByFolder(files);
  let currentIndex = 0;

  if (variant === 'center') {
    return (
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center animate-in fade-in slide-in-from-bottom-2 mb-4">
        {/* عرض المجلدات */}
        {Array.from(folders.entries()).map(([folderName, folderFiles]) => {
          const startIdx = currentIndex;
          currentIndex += folderFiles.length;
          return (
            <FolderCard
              key={folderName}
              folderName={folderName}
              folderFiles={folderFiles}
              startIndex={startIdx}
            />
          );
        })}
        {/* عرض الملفات المنفردة */}
        {standaloneFiles.map((file, idx) => {
          const fileIndex = currentIndex + idx;
          return <FileCard key={`${file.name}-${fileIndex}`} file={file} index={fileIndex} />;
        })}
      </div>
    );
  }

  return (
    <div className="mb-3 flex flex-wrap gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-2">
      {/* عرض المجلدات */}
      {Array.from(folders.entries()).map(([folderName, folderFiles]) => {
        const startIdx = currentIndex;
        currentIndex += folderFiles.length;
        return (
          <FolderCard
            key={folderName}
            folderName={folderName}
            folderFiles={folderFiles}
            startIndex={startIdx}
          />
        );
      })}
      {/* عرض الملفات المنفردة */}
      {standaloneFiles.map((file, idx) => {
        const fileIndex = currentIndex + idx;
        return <FileCard key={`${file.name}-${fileIndex}`} file={file} index={fileIndex} />;
      })}
    </div>
  );
};
