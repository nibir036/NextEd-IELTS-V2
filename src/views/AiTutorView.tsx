import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { Bot, Sparkles, Send, BrainCircuit, Shield, Check } from '../components/ui/icons';

interface AiTutorViewProps {
  initialTab?: string;
  id?: string;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({ initialTab = 'tutor', id }) => {
  const [activeTab, setActiveTab] = useState<'tutor' | 'examiner' | 'prompts'>(
    initialTab.includes('examiner') ? 'examiner' : 'tutor'
  );

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Senior IELTS Tutor. I evaluate your responses against official IDP/British Council descriptor rubrics. How can I assist you today? You can paste an essay draft or ask for a Speaking Part 2 warm-up prompt.",
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSendMessage = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Thank you for sharing that response! Evaluating against Task Achievement and Lexical Resource: Your coherence is strong, but replacing general verbs like "get" or "make" with academic alternatives like "acquire" or "generate" will help secure Band 7.5+. Would you like a sentence-by-sentence rewrite?`,
        },
      ]);
    }, 1000);
  };

  const diagnosticReports = [
    {
      module: 'Writing Task 2 Diagnostic',
      score: 'Band 6.5 -> Target 7.5',
      primaryIssue: 'Over-generalization in body paragraph 2',
      recommendation: 'Provide explicit empirical examples instead of vague rhetorical claims.',
      date: 'Yesterday at 4:20 PM',
    },
    {
      module: 'Speaking Part 3 Diagnostic',
      score: 'Band 7.0 -> Target 8.0',
      primaryIssue: 'Hesitation during complex grammatical transitions',
      recommendation: 'Practice discourse markers ("On the flip side...", "Having said that...") to maintain smooth fluency.',
      date: '3 days ago',
    },
  ];

  const interactivePrompts = [
    {
      topic: 'Speaking Part 2 Simulation',
      title: 'Describe a decision you made that changed your career or studies',
      timeLimit: '2 Minutes Speech',
      difficulty: 'Hard (Band 8.0)',
    },
    {
      topic: 'Writing Task 2 Argumentative',
      title: 'Should universities prioritize practical trade skills over theoretical humanities degrees?',
      timeLimit: '40 Minutes Essay',
      difficulty: 'Medium (Band 7.0)',
    },
  ];

  return (
    <div id={id} className="space-y-6">
      {/* Header */}
      <GlassPanel className="p-6 md:p-8 relative overflow-hidden border border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">
              <Bot size={18} />
              <span>AI Tutor & Official Examiner Engine</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
              Personalized AI IELTS Examiner
            </h1>
            <p className="text-sm text-[var(--text-dim)] mt-1 max-w-2xl">
              Get real-time feedback, sentence rewrites, and 1-on-1 diagnostic evaluations aligned with official British Council & IDP rubrics.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--panel-2)] p-1.5 rounded-xl border border-[var(--border)] shrink-0">
            <button
              onClick={() => setActiveTab('tutor')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'tutor'
                  ? 'bg-[var(--accent-gradient)] text-white shadow-md font-semibold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              AI Live Tutor
            </button>
            <button
              onClick={() => setActiveTab('examiner')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'examiner'
                  ? 'bg-[var(--accent-gradient)] text-white shadow-md font-semibold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              Examiner Diagnostics
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Tab 1: AI Live Tutor Chat Interface */}
      {activeTab === 'tutor' && (
        <GlassPanel className="p-6 border border-[var(--border)] flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-gradient)] flex items-center justify-center text-white shadow-sm">
                <BrainCircuit size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Senior IELTS Examiner Bot</div>
                <div className="text-[11px] font-mono text-[var(--success)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                  <span>Online • Ready for Essay / Speaking Evaluation</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-[var(--text-faint)] font-mono hidden sm:inline">
              Model: Gemini 1.5 Pro Evaluator
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-a)]/20 text-[var(--accent-a)] flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-xl text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[var(--accent-gradient)] text-white shadow-md'
                      : 'bg-[var(--panel-2)] text-[var(--text)] border border-[var(--border)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask for feedback or paste a sentence/essay draft..."
              className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-xs md:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
            />
            <Button onClick={handleSendMessage} className="flex items-center gap-2 px-5">
              <span>Send</span>
              <Send size={16} />
            </Button>
          </div>
        </GlassPanel>
      )}

      {/* Tab 2: Examiner Diagnostics */}
      {activeTab === 'examiner' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diagnosticReports.map((report, idx) => (
              <GlassPanel key={idx} className="p-6 border border-[var(--border)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase text-[var(--accent-a)] flex items-center gap-1.5">
                    <Shield size={16} />
                    <span>{report.module}</span>
                  </span>
                  <span className="text-xs font-mono text-[var(--text-faint)]">{report.date}</span>
                </div>

                <div className="text-base font-bold text-[var(--text)]">
                  Diagnostic Result: <span className="text-[var(--accent-a)]">{report.score}</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-xs text-[var(--text)] space-y-1">
                  <div className="font-bold text-[var(--danger)]">Primary Band Bottleneck:</div>
                  <div>{report.primaryIssue}</div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-xs text-[var(--text)] space-y-1">
                  <div className="font-bold text-[var(--success)]">Examiner Action Plan:</div>
                  <div>{report.recommendation}</div>
                </div>

                <Button size="sm" variant="secondary" className="w-full">
                  Run Full Diagnostic Exam
                </Button>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel className="p-6 border border-[var(--border)]">
            <h3 className="font-display text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--accent-a)]" />
              <span>Live Practice Prompts for Today</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interactivePrompts.map((p, pIdx) => (
                <div key={pIdx} className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] justify-between flex flex-col space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--accent-a)] mb-1">
                      <span>{p.topic}</span>
                      <span className="text-[var(--text-faint)]">{p.difficulty}</span>
                    </div>
                    <div className="font-bold text-xs md:text-sm text-[var(--text)]">{p.title}</div>
                  </div>
                  <Button size="sm" className="w-full">
                    Launch AI Prompt
                  </Button>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
