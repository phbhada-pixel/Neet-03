import React, { useEffect, useRef, useState } from 'react';
import { StudySession, Subject } from '../types/neet';
import {
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  Coffee,
  Flame,
  Headphones,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';

interface StudyPomodoroTimerProps {
  onSessionComplete: (session: StudySession) => void;
  totalTodayMinutes?: number;
  sessionCountToday?: number;
}

type TimerPresetKey = '25/5' | '45/10' | '50/10' | '90/15';

interface PresetConfig {
  key: TimerPresetKey;
  label: string;
  focusMinutes: number;
  breakMinutes: number;
  description: string;
}

const PRESETS: PresetConfig[] = [
  {
    key: '25/5',
    label: '25m Focus / 5m Break',
    focusMinutes: 25,
    breakMinutes: 5,
    description: 'Classic Pomodoro - Ideal for problem solving & formula practice',
  },
  {
    key: '45/10',
    label: '45m NCERT Chapter',
    focusMinutes: 45,
    breakMinutes: 10,
    description: 'Line-by-line NCERT Biology & Chemistry deep reading',
  },
  {
    key: '50/10',
    label: '50m Subject Speed',
    focusMinutes: 50,
    breakMinutes: 10,
    description: 'High-intensity subject section question drills',
  },
  {
    key: '90/15',
    label: '90m Full Intensive',
    focusMinutes: 90,
    breakMinutes: 15,
    description: 'Simulates long NTA exam study blocks',
  },
];

const SUBJECT_OPTIONS: Array<Subject | 'NCERT Revision' | 'Mock Review'> = [
  'Physics',
  'Chemistry',
  'Botany',
  'Zoology',
  'NCERT Revision',
  'Mock Review',
];

export const StudyPomodoroTimer: React.FC<StudyPomodoroTimerProps> = ({
  onSessionComplete,
  totalTodayMinutes = 0,
  sessionCountToday = 0,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TimerPresetKey>('45/10');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'NCERT Revision' | 'Mock Review'>('Physics');
  const [notes, setNotes] = useState<string>('');
  
  const currentPresetConfig = PRESETS.find((p) => p.key === selectedPreset) || PRESETS[1];

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(currentPresetConfig.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAmbientActive, setIsAmbientActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState<boolean>(false);

  // Audio refs for synthesized sounds
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Synchronize timer duration when preset changes if not running
  useEffect(() => {
    if (!isRunning) {
      const mins = mode === 'focus' ? currentPresetConfig.focusMinutes : currentPresetConfig.breakMinutes;
      setTimeLeftSeconds(mins * 60);
    }
  }, [selectedPreset, mode, isRunning]);

  // Main countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeftSeconds === 0) {
      // Timer finished!
      playChimeSound();
      if (mode === 'focus') {
        // Complete focus session
        const newSession: StudySession = {
          id: `session-${Date.now()}`,
          subject: selectedSubject,
          durationMinutes: currentPresetConfig.focusMinutes,
          completedAt: new Date().toISOString(),
          notes: notes.trim() || `${selectedSubject} ${currentPresetConfig.label} Study Block`,
          mode: selectedPreset,
        };
        onSessionComplete(newSession);
        setShowCompletionMessage(true);
        setTimeout(() => setShowCompletionMessage(false), 8000);

        // Switch to break mode
        setMode('break');
        setTimeLeftSeconds(currentPresetConfig.breakMinutes * 60);
      } else {
        // Break ended, back to focus mode
        setMode('focus');
        setTimeLeftSeconds(currentPresetConfig.focusMinutes * 60);
        setIsRunning(false);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeftSeconds, mode, selectedPreset, selectedSubject, notes, currentPresetConfig, onSessionComplete]);

  // Web Audio Chime Sound
  const playChimeSound = () => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio playback prevented');
    }
  };

  // Ambient Binaural / White Noise Synth
  const toggleAmbientSound = () => {
    if (isAmbientActive) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  const startAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft 210Hz focus tone with subtle binaural wave modulation
      osc.type = 'sine';
      osc.frequency.setValueAtTime(210, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      ambientOscRef.current = osc;
      ambientGainRef.current = gain;

      setIsAmbientActive(true);
    } catch (e) {
      console.error('Ambient audio error:', e);
    }
  };

  const stopAmbientSound = () => {
    try {
      if (ambientOscRef.current) {
        ambientOscRef.current.stop();
        ambientOscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    } catch (e) {
      console.error(e);
    } finally {
      ambientOscRef.current = null;
      audioCtxRef.current = null;
      setIsAmbientActive(false);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const mins = mode === 'focus' ? currentPresetConfig.focusMinutes : currentPresetConfig.breakMinutes;
    setTimeLeftSeconds(mins * 60);
  };

  const handleSkipPhase = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('break');
      setTimeLeftSeconds(currentPresetConfig.breakMinutes * 60);
    } else {
      setMode('focus');
      setTimeLeftSeconds(currentPresetConfig.focusMinutes * 60);
    }
  };

  const handleManualSaveSession = () => {
    const elapsedMinutes = Math.max(
      1,
      Math.round((currentPresetConfig.focusMinutes * 60 - timeLeftSeconds) / 60)
    );
    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      subject: selectedSubject,
      durationMinutes: elapsedMinutes > 0 ? elapsedMinutes : currentPresetConfig.focusMinutes,
      completedAt: new Date().toISOString(),
      notes: notes.trim() || `${selectedSubject} Deep Work (${elapsedMinutes}m logged)`,
      mode: selectedPreset,
    };
    onSessionComplete(newSession);
    setShowCompletionMessage(true);
    setTimeout(() => setShowCompletionMessage(false), 5000);
    handleReset();
  };

  // Format time MM:SS
  const totalSeconds = (mode === 'focus' ? currentPresetConfig.focusMinutes : currentPresetConfig.breakMinutes) * 60;
  const progressPercent = totalSeconds > 0 ? Math.min(100, Math.max(0, ((totalSeconds - timeLeftSeconds) / totalSeconds) * 100)) : 0;

  const minutesStr = String(Math.floor(timeLeftSeconds / 60)).padStart(2, '0');
  const secondsStr = String(timeLeftSeconds % 60).padStart(2, '0');

  // Color theme dynamically based on focus vs break mode
  const modeBadgeColor = mode === 'focus'
    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
    : 'bg-amber-500/20 border-amber-500/40 text-amber-300';

  const ringColor = mode === 'focus' ? 'text-emerald-500' : 'text-amber-400';

  return (
    <div
      className={`relative rounded-3xl transition-all border ${
        isFullscreen
          ? 'fixed inset-4 z-50 bg-slate-950/98 border-emerald-500/40 shadow-2xl p-6 sm:p-10 flex flex-col justify-center items-center overflow-y-auto'
          : 'bg-slate-900/90 border-slate-800 p-6 shadow-xl text-white'
      }`}
    >
      {/* Background radial highlight */}
      <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 ${mode === 'focus' ? 'bg-emerald-500/10' : 'bg-amber-500/10'} rounded-full blur-3xl pointer-events-none`} />

      {/* Completion Toast Notification */}
      {showCompletionMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-500" />
          <span>Session Logged to NEET Analytics (+{currentPresetConfig.focusMinutes} Focus Mins)</span>
        </div>
      )}

      {/* Header controls & fullscreen button */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>NEET Deep Work Pomodoro</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${modeBadgeColor}`}>
                {mode === 'focus' ? 'Focus Block' : 'Short Break'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Timed NCERT study sessions with focus analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Ambient Alpha Wave Synth */}
          <button
            onClick={toggleAmbientSound}
            title={isAmbientActive ? 'Stop Focus Ambient Alpha Waves' : 'Play Focus Ambient Alpha Waves'}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center space-x-1.5 ${
              isAmbientActive
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] font-semibold">
              {isAmbientActive ? 'Ambient On' : 'Focus Waves'}
            </span>
          </button>

          {/* Fullscreen Modal Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen Focus Mode' : 'Fullscreen Focus Mode'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={`w-full grid grid-cols-1 ${isFullscreen ? 'max-w-xl mx-auto space-y-6' : 'lg:grid-cols-12 gap-6'}`}>
        
        {/* Left Column (Presets & Subject Config) - 5 Cols */}
        {!isFullscreen && (
          <div className="lg:col-span-5 space-y-4">
            
            {/* Presets Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Select Study Session Interval
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => {
                  const isSel = selectedPreset === p.key;
                  return (
                    <button
                      key={p.key}
                      disabled={isRunning}
                      onClick={() => setSelectedPreset(p.key)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSel
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200 font-bold shadow-md'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      } ${isRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-xs font-bold text-white truncate">{p.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                NEET Subject Tag
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECT_OPTIONS.map((sub) => {
                  const isSel = selectedSubject === sub;
                  return (
                    <button
                      key={sub}
                      disabled={isRunning}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSel
                          ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 shadow-sm'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Topic Notes Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Chapter / Topic Focus Goal (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., NCERT Mechanics Numerical Practice..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            {/* Today's Stats Banner */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                <span>Today's Deep Work:</span>
              </div>
              <div className="font-extrabold text-emerald-400">
                {Math.floor(totalTodayMinutes / 60)}h {totalTodayMinutes % 60}m
                <span className="text-slate-500 font-normal ml-1">({sessionCountToday} sessions)</span>
              </div>
            </div>

          </div>
        )}

        {/* Right Column: Timer Ring Display & Controls - 7 Cols */}
        <div className={`${isFullscreen ? 'w-full' : 'lg:col-span-7'} flex flex-col items-center justify-center bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 relative`}>
          
          {/* SVG Circular Countdown */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800 fill-none"
              />
              {/* Animated Ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={263.89}
                strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                strokeLinecap="round"
                className={`${ringColor} fill-none transition-all duration-1000 ease-linear`}
              />
            </svg>

            {/* Center Digital Clock */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {minutesStr}:{secondsStr}
              </span>
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                {mode === 'focus' ? `${selectedSubject}` : 'Rest & Hydrate'}
              </span>
              <span className="text-[10px] text-emerald-400/90 font-medium">
                {mode === 'focus' ? `${currentPresetConfig.focusMinutes} min session` : `${currentPresetConfig.breakMinutes} min break`}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center space-x-3 mt-4 w-full max-w-xs">
            {/* Play / Pause */}
            <button
              onClick={handleStartPause}
              className={`flex-1 py-3 px-5 rounded-2xl font-bold text-xs shadow-xl transition-all flex items-center justify-center space-x-2 text-white ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{timeLeftSeconds < totalSeconds ? 'Resume' : 'Start Focus'}</span>
                </>
              )}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              title="Reset Timer"
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip / Next */}
            <button
              onClick={handleSkipPhase}
              title={mode === 'focus' ? 'Skip to Break' : 'Skip to Focus'}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center space-x-1"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Quick Manual Finish Log Button */}
          {isRunning && mode === 'focus' && (
            <button
              onClick={handleManualSaveSession}
              className="mt-3 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
            >
              Finish Early & Log Session Now
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
