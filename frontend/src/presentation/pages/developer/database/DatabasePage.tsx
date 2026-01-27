import React, { useEffect, useState } from 'react';
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
    const [tracks, setTracks] = useState<EducationalTrack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set());
    const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
    const [selectedLesson, setSelectedLesson] = useState<EducationalLesson | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock Data for UI Development (Remove when API is active)
                // const mockData = [
                //     {
                //         id: '1', title: 'Grade 10 Physics', subject: 'Physics', level: 'GRADE_10', units: [
                //             { id: 'u1', title: 'Mechanics', orderIndex: 1, lessons: [
                //                 { id: 'l1', title: 'Newton Laws', orderIndex: 1, aiMetadata: { model: 'gpt-4', prompt: 'Explain Newton laws...' } },
                //                 { id: 'l2', title: 'Kinematics', orderIndex: 2 }
                //             ]}
                //         ]
                //     }
                // ];
                // setTracks(mockData);

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
        <div className="space-y-6 relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Database Inspector</h1>
                    <p className="text-slate-400">Raw educational data explorer.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Tracks" value={tracks.length} icon={Layers} color="text-indigo-400" />
                <StatCard label="Total Units" value={totalUnits} icon={Box} color="text-pink-400" />
                <StatCard label="Total Lessons" value={totalLessons} icon={FileText} color="text-emerald-400" />
            </div>

            {/* Data Tree */}
            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 font-semibold text-slate-300 flex items-center gap-2">
                    <Table size={18} />
                    Educational Graph Hierarchy
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-2">
                    {isLoading ? (
                        <div className="text-slate-500 text-center py-10">Loading Data Schema...</div>
                    ) : (
                        tracks.map(track => (
                            <div key={track.id} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/30">
                                <div
                                    onClick={() => toggleTrack(track.id)}
                                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {expandedTracks.has(track.id) ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
                                        <span className="font-semibold text-white">{track.title}</span>
                                        <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">{track.subject}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">{track.units?.length || 0} Units</span>
                                </div>

                                {expandedTracks.has(track.id) && (
                                    <div className="border-t border-slate-800 ml-4 pl-4 border-l border-b-0 space-y-1 py-1">
                                        {track.units?.map(unit => (
                                            <div key={unit.id} className="mt-1">
                                                <div
                                                    onClick={() => toggleUnit(unit.id)}
                                                    className="p-2 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 rounded text-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {expandedUnits.has(unit.id) ? <ChevronDown size={14} className="text-slate-600" /> : <ChevronRight size={14} className="text-slate-600" />}
                                                        <span className="text-slate-300">{unit.title}</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-600">{unit.lessons?.length || 0} Lessons</span>
                                                </div>

                                                {expandedUnits.has(unit.id) && (
                                                    <div className="ml-6 pl-4 border-l border-slate-800/50 space-y-1 py-1">
                                                        {unit.lessons?.map(lesson => (
                                                            <div key={lesson.id} className="p-2 flex items-center justify-between text-xs hover:bg-slate-800/50 rounded group">
                                                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200">
                                                                    <FileText size={12} />
                                                                    <span>{lesson.title}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => setSelectedLesson(lesson)}
                                                                    className="flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded hover:bg-indigo-500/20 border border-indigo-500/20"
                                                                >
                                                                    <Code size={12} />
                                                                    <span>Inspect</span>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-950">
                            <div className="flex items-center gap-3">
                                <Eye className="text-cyan-400" />
                                <h2 className="text-lg font-bold text-white">X-Ray Inspection: <span className="text-cyan-400">{selectedLesson.title}</span></h2>
                            </div>
                            <button onClick={() => setSelectedLesson(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-0 bg-[#0d1117] custom-scrollbar">
                            <pre className="p-6 text-sm font-mono text-emerald-400 whitespace-pre-wrap">
                                {JSON.stringify(selectedLesson, null, 2)}
                            </pre>
                        </div>
                        <div className="p-3 border-t border-slate-700 bg-slate-950 text-xs text-slate-500 flex justify-between">
                            <span>ID: {selectedLesson.id}</span>
                            <span>DATABASE: PUBLIC</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-xs uppercase font-semibold">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
            <Icon size={20} />
        </div>
    </div>
);

export default DatabasePage;
