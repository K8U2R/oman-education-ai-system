import React, { useState } from 'react';
import { FileUp, FileText, Sparkles, Download, Share2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { OfficeAppType } from '../OfficeAssistantPage';
import { officeService, OfficeFileAnalysis } from '../services/office-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface OfficeFileAnalyzerProps {
  appType: OfficeAppType;
}

const OfficeFileAnalyzer: React.FC<OfficeFileAnalyzerProps> = ({ appType }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [analysis, setAnalysis] = useState<OfficeFileAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { handleError, showSuccess } = useErrorHandler();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl('');
    }
  };

  const handleAnalyze = async () => {
    if (!file && !fileUrl) {
      handleError(new Error('يرجى اختيار ملف أو إدخال رابط'), 'خطأ');
      return;
    }

    setIsAnalyzing(true);
    try {
      let result: OfficeFileAnalysis;
      
      if (file) {
        result = await officeService.processFile(appType, file);
      } else {
        result = await officeService.analyzeSharedFile(fileUrl, appType);
      }
      
      setAnalysis(result);
      showSuccess('تم التحليل', 'تم تحليل الملف بنجاح');
    } catch (error) {
      handleError(error, 'خطأ في تحليل الملف');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-ide-accent" />
          <h2 className="text-lg font-semibold">تحليل ملف Office</h2>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">رفع ملف</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".docx,.xlsx,.pptx,.msg,.one,.pub,.accdb"
                onChange={handleFileChange}
              />
              <Button variant="outline" as="span">
                <FileUp className="w-4 h-4" />
                اختر ملف
              </Button>
              {file && (
                <span className="text-sm text-ide-text-secondary">{file.name}</span>
              )}
            </label>
          </div>

          {/* Or Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-ide-border" />
            <span className="text-sm text-ide-text-secondary">أو</span>
            <div className="flex-1 h-px bg-ide-border" />
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium mb-2">رابط ملف مشترك</label>
            <Input
              value={fileUrl}
              onChange={(e) => {
                setFileUrl(e.target.value);
                setFile(null);
              }}
              placeholder="https://..."
              leftIcon={<Share2 className="w-4 h-4" />}
            />
          </div>

          <Button
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            disabled={!file && !fileUrl}
            className="w-full"
          >
            <Sparkles className="w-4 h-4" />
            تحليل الملف
          </Button>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metadata */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">معلومات الملف</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-ide-text-secondary">اسم الملف:</span>
                <p className="font-medium">{analysis.fileName}</p>
              </div>
              {analysis.metadata.author && (
                <div>
                  <span className="text-sm text-ide-text-secondary">المؤلف:</span>
                  <p className="font-medium">{analysis.metadata.author}</p>
                </div>
              )}
              {analysis.metadata.words && (
                <div>
                  <span className="text-sm text-ide-text-secondary">عدد الكلمات:</span>
                  <p className="font-medium">{analysis.metadata.words.toLocaleString()}</p>
                </div>
              )}
              {analysis.metadata.pages && (
                <div>
                  <span className="text-sm text-ide-text-secondary">عدد الصفحات:</span>
                  <p className="font-medium">{analysis.metadata.pages}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Suggestions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">اقتراحات التحسين</h3>
            <div className="space-y-2">
              {analysis.suggestions.length > 0 ? (
                analysis.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-ide-bg border border-ide-border rounded-md"
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ide-text-secondary">لا توجد اقتراحات</p>
              )}
            </div>
          </Card>

          {/* Content Preview */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">معاينة المحتوى</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                تنزيل التقرير
              </Button>
            </div>
            <div className="bg-ide-bg border border-ide-border rounded-md p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">{analysis.content}</pre>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OfficeFileAnalyzer;

