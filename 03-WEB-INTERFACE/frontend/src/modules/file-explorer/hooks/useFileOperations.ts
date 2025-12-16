import { useState, useCallback } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { useIDE } from '@/core/state/useIDE';

export function useFileOperations() {
  const { showSuccess, handleError } = useErrorHandler();
  const { activeProjectId } = useIDE();
  const [isOperating, setIsOperating] = useState(false);

  const createFile = useCallback(async (path: string, name: string) => {
    if (!activeProjectId) {
      handleError(new Error('لا يوجد مشروع نشط'), 'خطأ');
      return false;
    }

    setIsOperating(true);
    try {
      const filePath = path ? `${path}/${name}` : name;
      await apiClient.post(
        API_ENDPOINTS.files.create(activeProjectId),
        {
          path: filePath,
          content: '',
          type: 'file',
        }
      );
      showSuccess('تم الإنشاء', `تم إنشاء الملف ${name} بنجاح`);
      return true;
    } catch (error) {
      handleError(error, 'خطأ في إنشاء الملف');
      return false;
    } finally {
      setIsOperating(false);
    }
  }, [activeProjectId, showSuccess, handleError]);

  const createFolder = useCallback(async (path: string, name: string) => {
    if (!activeProjectId) {
      handleError(new Error('لا يوجد مشروع نشط'), 'خطأ');
      return false;
    }

    setIsOperating(true);
    try {
      const folderPath = path ? `${path}/${name}` : name;
      await apiClient.post(
        API_ENDPOINTS.files.create(activeProjectId),
        {
          path: folderPath,
          type: 'folder',
        }
      );
      showSuccess('تم الإنشاء', `تم إنشاء المجلد ${name} بنجاح`);
      return true;
    } catch (error) {
      handleError(error, 'خطأ في إنشاء المجلد');
      return false;
    } finally {
      setIsOperating(false);
    }
  }, [activeProjectId, showSuccess, handleError]);

  const rename = useCallback(async (oldPath: string, newName: string) => {
    if (!activeProjectId) {
      handleError(new Error('لا يوجد مشروع نشط'), 'خطأ');
      return false;
    }

    setIsOperating(true);
    try {
      const pathParts = oldPath.split('/');
      pathParts[pathParts.length - 1] = newName;
      const newPath = pathParts.join('/');

      await apiClient.put(
        API_ENDPOINTS.files.update(activeProjectId, oldPath),
        { path: newPath }
      );
      showSuccess('تم التعديل', 'تم إعادة تسمية الملف بنجاح');
      return true;
    } catch (error) {
      handleError(error, 'خطأ في إعادة التسمية');
      return false;
    } finally {
      setIsOperating(false);
    }
  }, [activeProjectId, showSuccess, handleError]);

  const deleteFile = useCallback(async (path: string) => {
    if (!activeProjectId) {
      handleError(new Error('لا يوجد مشروع نشط'), 'خطأ');
      return false;
    }

    setIsOperating(true);
    try {
      await apiClient.delete(
        API_ENDPOINTS.files.delete(activeProjectId, path)
      );
      showSuccess('تم الحذف', 'تم حذف الملف بنجاح');
      return true;
    } catch (error) {
      handleError(error, 'خطأ في حذف الملف');
      return false;
    } finally {
      setIsOperating(false);
    }
  }, [activeProjectId, showSuccess, handleError]);

  return {
    isOperating,
    createFile,
    createFolder,
    rename,
    deleteFile,
  };
}

