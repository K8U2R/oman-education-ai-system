import React, { useState } from 'react';
import {
    Brain,
    Play,
    Cpu,
    Zap,
    MessageSquare,
    Code,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    Timer
} from 'lucide-react';
import { EducationService, EducationLevel } from '@/infrastructure/services/education.service';

interface MetricStore {
    latency: number;
    tokens: number;
    cost: number;
}

const AILabPage: React.FC = () => {
    // Input State
    const [model, setModel] = useState('gpt-4o');
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState<string>(EducationLevel.GRADE_10);
    const [systemPrompt, setSystemPrompt] = useState('You are an expert educational AI specialized in Omani curriculum standards.');

    // Execution State
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [metrics, setMetrics] = useState<MetricStore>({ latency: 0, tokens: 0, cost: 0 });
    const [error, setError] = useState<string | null>(null);

    const handleRunTest = async () => {
        setIsLoading(true);
        setError(null);
        setResponse(null);
        const startTime = Date.now();

        try {
            // NOTE: In a real "Lab", we might want a dedicated endpoint that accepts systemPrompt.
            // For now, we reuse the lesson generator or mock it for UI demonstration.

            // Simulation Mode (for verifying UI)
            // await new Promise(resolve => setTimeout(resolve, 1500));
            // const mockResponse = {
            //     id: "lesson_" + Math.random().toString(36).substr(2, 9),
            //     title: `Lesson: ${topic}`,
            //     content: "## Introduction\nThis is a generated lesson based on the provided topic.\n\n## Key Concepts...",
            //     metadata: { model, level, timestamp: new Date().toISOString() }
            // };
            // setResponse(mockResponse);

            // Real Call Attempt
            const result = await EducationService.generateLesson(topic, level, `[System: ${systemPrompt}]`);
            setResponse(result);

            const endTime = Date.now();
            const latency = endTime - startTime;
            const approximateTokens = JSON.stringify(result).length / 4; // Rough estimate

            setMetrics({
                latency,
                tokens: Math.round(approximateTokens),
                cost: (approximateTokens / 1000) * 0.03 // Mock cost calc for GPT-4
            });

        } catch (err: any) {
            console.error("Test failed", err);
            setError(err.message || "Failed to generate response");

            // Fallback for demo if backend fails (remove in prod)
            setResponse({
                error: "Backend Error",
                details: err.message,
                note: "Ensure backend is running on port 30000 and auth token is valid."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                        <Brain className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">AI Neural Lab</h1>
                        <p className="text-slate-400 text-sm">Prompt Engineering & Model Evaluation Environment</p>
                    </div>
                </div>
                <div className="flex gap-2 text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                    <span>STATUS:</span>
                    <span className="text-emerald-400">ONLINE</span>
                    <span className="mx-1">|</span>
                    <span>LATENCY:</span>
                    <span className="text-indigo-400">24ms</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Left Column: Input Configuration */}
                <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Model Config Card */}
                    <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-slate-200 font-semibold border-b border-white/5 pb-3">
                            <Cpu size={18} className="text-pink-500" />
                            <h3>Model Configuration</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Target Model</label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
                                >
                                    <option value="gpt-4o">GPT-4o (Omni)</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="claude-3-opus">Claude 3 Opus (Simulated)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Termperature</label>
                                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                                        <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                                        <span className="text-xs text-slate-300 font-mono">0.7</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Max Tokens</label>
                                    <input type="number" defaultValue={2048} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm focus:border-indigo-500 outline-none font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prompt Input Card */}
                    <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm rounded-2xl p-5 shadow-sm flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4 text-slate-200 font-semibold border-b border-white/5 pb-3">
                            <MessageSquare size={18} className="text-cyan-400" />
                            <h3>Prompt Construction</h3>
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">System Prompt (Override)</label>
                                <textarea
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none"
                                    placeholder="Define the AI persona and constraints..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Education Level</label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-cyan-500 outline-none"
                                >
                                    {Object.values(EducationLevel).map((lvl) => (
                                        <option key={lvl} value={lvl}>{lvl.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">User Input (Topic)</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all resize-none min-h-[120px]"
                                    placeholder="Enter the lesson topic (e.g., 'Newton's Laws of Motion')..."
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleRunTest}
                                disabled={isLoading || !topic}
                                className={`
                                    w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                                    ${isLoading || !topic
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw size={20} className="animate-spin" />
                                        <span>Processing Neural Request...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} fill="currentColor" />
                                        <span>Run Neural Test</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Output & Metrics */}
                <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-4 gap-4">
                        <MetricCard
                            label="Latency"
                            value={metrics.latency ? `${metrics.latency}ms` : '--'}
                            icon={Timer}
                            color="text-amber-400"
                            bg="bg-amber-400/10"
                            borderColor="border-amber-400/20"
                        />
                        <MetricCard
                            label="Tokens (Approx)"
                            value={metrics.tokens || '--'}
                            icon={Code}
                            color="text-blue-400"
                            bg="bg-blue-400/10"
                            borderColor="border-blue-400/20"
                        />
                        <MetricCard
                            label="Est. Cost"
                            value={metrics.cost ? `$${metrics.cost.toFixed(4)}` : '--'}
                            icon={DollarSign}
                            color="text-emerald-400"
                            bg="bg-emerald-400/10"
                            borderColor="border-emerald-400/20"
                        />
                        <MetricCard
                            label="Status"
                            value={error ? 'Failed' : response ? 'Success' : 'Ready'}
                            icon={response ? CheckCircle2 : AlertCircle}
                            color={error ? 'text-red-400' : response ? 'text-emerald-400' : 'text-slate-400'}
                            bg={error ? 'bg-red-400/10' : response ? 'bg-emerald-400/10' : 'bg-slate-800/50'}
                            borderColor={error ? 'border-red-400/20' : response ? 'border-emerald-400/20' : 'border-slate-700'}
                        />
                    </div>

                    {/* Output Viewer */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-inner shadow-black/50 group relative">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-yellow-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Response Stream</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 font-mono">JSON Mode</span>
                            </div>
                        </div>

                        <div className="relative flex-1 bg-[#0d1117] overflow-auto custom-scrollbar p-4">
                            {response || error ? (
                                <pre className={`font-mono text-sm ${error ? 'text-red-400' : 'text-emerald-300'} whitespace-pre-wrap break-words leading-relaxed`}>
                                    {error || JSON.stringify(response, null, 2)}
                                </pre>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 opacity-20 pointer-events-none select-none">
                                    <Brain size={120} strokeWidth={0.5} />
                                    <p className="mt-4 text-lg font-medium tracking-widest">AWAITING NEURAL INPUT</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.5);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(71, 85, 105, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.5);
                }
            `}</style>
        </div>
    );
};

// Helper Component for Metrics
const MetricCard = ({ label, value, icon: Icon, color, bg, borderColor }: any) => (
    <div className={`${bg} border ${borderColor} rounded-xl p-3 flex flex-col justify-center items-start transition-all hover:scale-[1.02]`}>
        <div className="flex items-center gap-2 mb-1 opacity-80">
            <Icon size={14} className={color} />
            <span className={`text-[10px] uppercase font-bold tracking-wider ${color}`}>{label}</span>
        </div>
        <span className="text-lg font-mono font-bold text-white">{value}</span>
    </div>
);

export default AILabPage;
