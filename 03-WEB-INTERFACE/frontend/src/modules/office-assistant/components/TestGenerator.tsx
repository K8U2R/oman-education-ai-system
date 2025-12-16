import React, { useState } from 'react';
import { TestTube, Download, Play } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { OfficeAppType } from '../OfficeAssistantPage';
import { officeService, OfficeTest } from '../services/office-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface TestGeneratorProps {
  appType: OfficeAppType;
  content: string;
  onClose: () => void;
}

const TestGenerator: React.FC<TestGeneratorProps> = ({ appType, content, onClose }) => {
  const [testType, setTestType] = useState<'quiz' | 'assignment' | 'exam'>('quiz');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(60);
  const [passingScore, setPassingScore] = useState(70);
  const [test, setTest] = useState<OfficeTest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { handleError, showSuccess } = useErrorHandler();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generatedTest = await officeService.createTest(appType, content, testType, {
        questionCount,
        timeLimit,
        passingScore,
      });
      setTest(generatedTest);
      showSuccess('تم الإنشاء', 'تم إنشاء الاختبار بنجاح');
    } catch (error) {
      handleError(error, 'خطأ في إنشاء الاختبار');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!test) return;
    
    const testData = {
      ...test,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-${test.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="إنشاء اختبار" size="lg">
      <div className="space-y-6">
        {!test ? (
          <>
            {/* Test Configuration */}
            <div className="space-y-4">
              <Select
                label="نوع الاختبار"
                value={testType}
                onChange={(e) => setTestType(e.target.value as typeof testType)}
                options={[
                  { value: 'quiz', label: 'اختبار قصير' },
                  { value: 'assignment', label: 'واجب' },
                  { value: 'exam', label: 'امتحان' },
                ]}
              />

              <Input
                label="عدد الأسئلة"
                type="number"
                value={questionCount.toString()}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                min={1}
                max={50}
              />

              <Input
                label="الوقت المحدد (دقيقة)"
                type="number"
                value={timeLimit.toString()}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                min={1}
              />

              <Input
                label="الدرجة المطلوبة للنجاح (%)"
                type="number"
                value={passingScore.toString()}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                min={0}
                max={100}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                إلغاء
              </Button>
              <Button onClick={handleGenerate} isLoading={isGenerating}>
                <TestTube className="w-4 h-4" />
                إنشاء الاختبار
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Test Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">الاختبار المُنشأ</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    تنزيل
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTest(null)}>
                    <Play className="w-4 h-4" />
                    إنشاء آخر
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {test.questions.map((question, index) => (
                  <Card key={question.id}>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-ide-accent">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.question}</p>
                        {question.type === 'multiple-choice' && question.options && (
                          <ul className="space-y-1 mr-4">
                            {question.options.map((option, optIndex) => (
                              <li key={optIndex} className="text-sm">
                                {String.fromCharCode(97 + optIndex)}. {option}
                                {option === question.correctAnswer && (
                                  <span className="text-green-400 mr-2">✓</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                إغلاق
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default TestGenerator;

