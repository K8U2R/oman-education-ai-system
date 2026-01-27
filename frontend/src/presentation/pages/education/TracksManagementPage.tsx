import React, { useState } from 'react';
import { Card } from '../../components/ui/layout/Card/Card';
import { Button } from '../../components/ui/inputs/Button/Button';
import { Input } from '../../components/ui/inputs/Input/Input';
import { EducationService, EducationLevel } from '../../../infrastructure/services/education.service';
import { Plus, Book, Layout, Loader2 } from 'lucide-react';

export const TracksManagementPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [level, setLevel] = useState<string>(EducationLevel.GRADE_10);
    const [subject] = useState('Math');
    const [loading, setLoading] = useState(false);
    const [tracks, setTracks] = useState<any[]>([]); // Should be typed properly

    const handleCreateTrack = async () => {
        if (!title) return;
        setLoading(true);
        try {
            const track = await EducationService.createTrack(title, level, subject);
            setTracks([...tracks, track]);
            setTitle(''); // Reset
        } catch (error) {
            console.error("Failed to create track", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Layout className="text-primary-600 w-8 h-8" />
                    إدارة المسارات
                </h1>
            </div>

            {/* Create Track Form */}
            <Card className="p-6 bg-bg-surface border-border-secondary">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary">
                    <Plus className="w-5 h-5 text-primary-600" />
                    إنشاء مسار جديد
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <Input
                        placeholder="اسم المنهج (مثال: فيزياء متقدمة)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="md:col-span-2 text-text-primary bg-bg-app border-border-primary"
                    />
                    <select
                        className="h-10 rounded-lg border-border-primary border px-3 bg-bg-app text-text-primary"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <Button
                        onClick={handleCreateTrack}
                        disabled={loading}
                        variant="primary"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'إضافة'}
                    </Button>
                </div>
            </Card>

            {/* Existing Tracks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks.map((track) => (
                    <Card key={track.id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow border-border-secondary">
                        <div className="p-6 bg-gradient-to-br from-primary-50 to-bg-surface">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                                    <Book className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-bg-tertiary text-text-secondary rounded-full border border-border-primary">
                                    {track.level}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">{track.title}</h3>
                            <p className="text-sm text-text-secondary">{track.subject}</p>
                        </div>
                        <div className="p-4 border-t border-border-secondary flex justify-between bg-bg-tertiary">
                            <Button variant="outline" size="sm">إدارة الوحدات</Button>
                        </div>
                    </Card>
                ))}

                {tracks.length === 0 && (
                    <div className="col-span-full py-12 text-center text-text-tertiary border-2 border-dashed border-border-secondary rounded-xl">
                        لا توجد مسارات مضافة بعد.
                    </div>
                )}
            </div>
        </div>
    );
};
