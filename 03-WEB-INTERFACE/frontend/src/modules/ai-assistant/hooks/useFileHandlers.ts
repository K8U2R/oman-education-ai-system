import { useCallback } from 'react';
import { validateFiles } from '../utils/fileValidator';
import { useErrorHandler } from '@/hooks/useErrorHandler';

/**
 * Hook لمعالجة الملفات والمجلدات
 */
export function useFileHandlers(
  selectedFiles: File[],
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  _fileInputRef: React.RefObject<HTMLInputElement>,
  _folderInputRef: React.RefObject<HTMLInputElement>
) {
  const { handleError, showSuccess } = useErrorHandler();

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const files = Array.from(e.target.files);
      const allFiles = [...selectedFiles, ...files];

      // Validate files
      const validation = validateFiles(allFiles);
      if (!validation.valid) {
        handleError(
          new Error(validation.error || 'خطأ في التحقق من الملفات'),
          'خطأ في الملفات'
        );
        e.target.value = ''; // Reset input
        return;
      }

      setSelectedFiles(allFiles);
      showSuccess('تم التحديد', `تم تحديد ${files.length} ملف بنجاح`);
      e.target.value = ''; // Reset input
    },
    [selectedFiles, setSelectedFiles, handleError, showSuccess]
  );

  const handleFolderSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const files = Array.from(e.target.files);
      const allFiles = [...selectedFiles, ...files];

      // Validate files
      const validation = validateFiles(allFiles);
      if (!validation.valid) {
        handleError(
          new Error(validation.error || 'خطأ في التحقق من الملفات'),
          'خطأ في الملفات'
        );
        e.target.value = ''; // Reset input
        return;
      }

      setSelectedFiles(allFiles);
      showSuccess('تم التحديد', `تم تحديد مجلد يحتوي على ${files.length} ملف`);
      e.target.value = ''; // Reset input
    },
    [selectedFiles, setSelectedFiles, handleError, showSuccess]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    },
    [setSelectedFiles]
  );

  return {
    handleFileSelect,
    handleFolderSelect,
    handleRemoveFile,
  };
}

