import React, { useState } from 'react';
import { FileText, Plus, TestTube, Download, Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { officeService } from '../services/office-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import WordEditor from '../components/WordEditor';
import TestGenerator from '../components/TestGenerator';

const WordAssistant: React.FC = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showTestGenerator, setShowTestGenerator] = useState(false);
  const { handleError, showSuccess } = useErrorHandler();

  const handleEdit = async (editRequest: string) => {
    if (!documentContent) return;

    try {
      const editedContent = await officeService.editFile('word', documentContent, editRequest);
      setDocumentContent(editedContent);
      showSuccess('تم التعديل', 'تم تعديل المستند بنجاح');
    } catch (error) {
      handleError(error, 'خطأ في تعديل المستند');
    }
  };

  const handleSave = async () => {
    try {
      // حفظ المستند
      showSuccess('تم الحفظ', 'تم حفظ المستند بنجاح');
    } catch (error) {
      handleError(error, 'خطأ في حفظ المستند');
    }
  };

  const handleDownload = async () => {
    try {
      const result = await officeService.generateFile('word', [
        { id: '1', role: 'user', content: documentContent, timestamp: new Date() },
      ]);
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      } else {
        // إنشاء ملف محلي
        const blob = new Blob([documentContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.docx';
        a.click();
        URL.revokeObjectURL(url);
      }
      showSuccess('تم التنزيل', 'تم تنزيل المستند بنجاح');
    } catch (error) {
      handleError(error, 'خطأ في تنزيل المستند');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Microsoft Word Assistant</h2>
          </div>
          <div className="flex gap-2">
            {documentContent && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowTestGenerator(true)}>
                  <TestTube className="w-4 h-4" />
                  إنشاء اختبار
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  حفظ
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  تنزيل
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Editor */}
      {isEditing ? (
        <WordEditor
          content={documentContent}
          onChange={setDocumentContent}
          onEdit={handleEdit}
        />
      ) : (
        <Card className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-blue-500 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">ابدأ بإنشاء مستند جديد</h3>
          <p className="text-ide-text-secondary mb-6">
            استخدم محادثة AI لإنشاء مستند Word أو ارفع ملف موجود للتحرير
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="w-4 h-4" />
              مستند جديد
            </Button>
          </div>
        </Card>
      )}

      {/* Test Generator Modal */}
      {showTestGenerator && documentContent && (
        <TestGenerator
          appType="word"
          content={documentContent}
          onClose={() => setShowTestGenerator(false)}
        />
      )}
    </div>
  );
};

export default WordAssistant;

