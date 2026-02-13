import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Database,
    Table,
    Code,
    Eye,
    ChevronRight,
    ChevronDown,
    Layers,
    Box,
    FileText,
    X
} from 'lucide-react';
import { EducationService, EducationalTrack, EducationalLesson } from '@/infrastructure/services/education.service';

const DatabasePage: React.FC = () => {
    const { t } = useTranslation();
    const [tracks, setTracks] = useState<EducationalTrack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set());
    const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
    const [selectedLesson, setSelectedLesson] = useState<EducationalLesson | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await EducationService.getTracks();
                setTracks(data);
            } catch (err) {
                console.error("Failed to fetch tracks", err);
                // Fallback mock
                setTracks([
                    {
                        id: 'dev-mock-1', title: 'Grade 10 Physics (Mock)', subject: 'Physics', level: 'GRADE_10', units: [
                            {
                                id: 'u1', title: 'Mechanics', orderIndex: 1, lessons: [
                                    { id: 'l1', title: 'Newton Laws', orderIndex: 1, aiMetadata: { model: 'gpt-4', tokens: 450, cost: 0.02 } },
                                ]
                            }
                        ]
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleTrack = (id: string) => {
        const newSet = new Set(expandedTracks);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedTracks(newSet);
    };

    const toggleUnit = (id: string) => {
        const newSet = new Set(expandedUnits);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedUnits(newSet);
    };

    const totalLessons = tracks.reduce((acc, t) => acc + t.units.reduce((uAcc, u) => uAcc + u.lessons.length, 0), 0);
    const totalUnits = tracks.reduce((acc, t) => acc + t.units.length, 0);

    return (
        <div className="space-y-6 relative h-full flex flex-col p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                    <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t('system.database.title')}</h1>
                    <p className="text-muted-foreground">{t('system.database.description')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label={t('system.database.stats.tracks')} value={tracks.length} icon={Layers} color="text-primary" />
                <StatCard label={t('system.database.stats.units')} value={totalUnits} icon={Box} color="text-secondary-foreground" />
                <StatCard label={t('system.database.stats.lessons')} value={totalLessons} icon={FileText} color="text-accent-foreground" />
            </div>

            {/* Data Tree */}
            <div className="flex-1 bg-card/50 border border-border rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border bg-card/80 font-semibold text-card-foreground flex items-center gap-2">
                    <Table size={18} />
                    {t('system.database.hierarchy')}
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="text-muted-foreground text-center py-10">{t('system.database.loading_schema')}</div>
                    ) : (
                        tracks.map(track => (
                            <div key={track.id} className="border border-border rounded-lg overflow-hidden bg-card/30">
                                <div
                                    onClick={() => toggleTrack(track.id)}
                                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {expandedTracks.has(track.id) ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                                        <span className="font-semibold text-foreground">{track.title}</span>
                                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded border border-border">{track.subject}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{t('system.database.units_count', { count: track.units?.length || 0 })}</span>
                                </div>

                                {expandedTracks.has(track.id) && (
                                    <div className="border-t border-border ms-4 ps-4 border-s border-b-0 space-y-1 py-1">
                                        {track.units?.map(unit => (
                                            <div key={unit.id} className="mt-1">
                                                <div
                                                    onClick={() => toggleUnit(unit.id)}
                                                    className="p-2 flex items-center justify-between cursor-pointer hover:bg-muted/30 rounded text-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {expandedUnits.has(unit.id) ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
                                                        <span className="text-foreground">{unit.title}</span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground">{t('system.database.lessons_count', { count: unit.lessons?.length || 0 })}</span>
                                                </div>

                                                {expandedUnits.has(unit.id) && (
                                                    <div className="ms-6 ps-4 border-s border-border/50 space-y-1 py-1">
                                                        {unit.lessons?.map(lesson => (
                                                            <div key={lesson.id} className="p-2 flex items-center justify-between text-xs hover:bg-muted/50 rounded group">
                                                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                                                                    <FileText size={12} />
                                                                    <span>{lesson.title}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => setSelectedLesson(lesson)}
                                                                    className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 border border-primary/20"
                                                                >
                                                                    <Code size={12} />
                                                                    <span>{t('system.database.inspect')}</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* X-Ray Modal */}
            {selectedLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-4xl h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
                            <div className="flex items-center gap-3">
                                <Eye className="text-primary" />
                                <h2 className="text-lg font-bold text-foreground">{t('system.database.xray')}: <span className="text-primary">{selectedLesson.title}</span></h2>
                            </div>
                            <button onClick={() => setSelectedLesson(null)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-0 bg-black/90 custom-scrollbar">
                            <pre className="p-6 text-sm font-mono text-green-400 whitespace-pre-wrap">
                                {JSON.stringify(selectedLesson, null, 2)}
                            </pre>
                        </div>
                        <div className="p-3 border-t border-border bg-card/50 text-xs text-muted-foreground flex justify-between">
                            <span>ID: {selectedLesson.id}</span>
                            <span>{t('system.database.db_public')}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-card/50 border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div>
            <p className="text-muted-foreground text-xs uppercase font-semibold">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-background/50 ${color}`}>
            <Icon size={20} />
        </div>
    </div>
);

export default DatabasePage;

