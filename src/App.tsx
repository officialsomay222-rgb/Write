/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RefreshCw, Timer, Trophy, Keyboard } from 'lucide-react';

const TEXTS = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of algorithm design and the craft of debugging errant code.",
  "To be or not to be, that is the question. All that glitters is not gold. Practice makes perfect when you are learning to type.",
  "In the middle of difficulty lies opportunity. Keep your face always toward the sunshine, and shadows will fall behind you always."
];

export default function App() {
  const [text, setText] = useState(TEXTS[0]);
  const [input, setInput] = useState('');
  const [time, setTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      setIsFinished(true);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const startGame = () => {
    setText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    setInput('');
    setTime(60);
    setIsActive(false);
    setIsFinished(false);
    // Use a tiny timeout to ensure the element is rendered before focusing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive && !isFinished && e.target.value.length === 1) {
      setIsActive(true);
    }
    const val = e.target.value;
    // Don't allow typing beyond the text length
    if (val.length <= text.length) {
      setInput(val);
    }
    
    // Auto-finish if completed exactly
    if (val === text) {
      setIsActive(false);
      setIsFinished(true);
    }
  };

  // Calculate Words Per Minute
  const wpm = useMemo(() => {
    const words = input.trim().split(/\s+/).length;
    const timeElapsed = 60 - time;
    if (timeElapsed === 0 || input.length === 0) return 0;
    // Standard WPM formula: (characters / 5) / time in minutes
    return Math.round((input.length / 5) / (timeElapsed / 60));
  }, [input, time]);

  const accuracy = useMemo(() => {
    if (input.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correct++;
    }
    return Math.round((correct / input.length) * 100);
  }, [input, text]);

  const renderText = () => {
    return text.split('').map((char, index) => {
      let color = 'text-gray-400';
      if (index < input.length) {
        color = input[index] === char 
          ? 'text-green-500 bg-green-500/10' 
          : 'text-red-500 bg-red-500/10 underline';
      } else if (index === input.length && !isFinished) {
        color = 'text-gray-900 border-l-2 border-blue-500 bg-blue-50';
      }
      return <span key={index} className={`transition-colors rounded-sm ${color}`}>{char}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-gray-900">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Keyboard className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Typing Test</h1>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-blue-700/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Timer className="w-5 h-5 text-blue-200" />
              <span className="font-mono text-lg font-bold w-8 text-center">{time}s</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8">
          {!isFinished ? (
            <>
              {/* The Text to Type */}
              <div 
                className="text-xl sm:text-2xl leading-relaxed font-medium mb-8 select-none cursor-text font-mono" 
                onClick={() => inputRef.current?.focus()}
              >
                {renderText()}
              </div>
              
              {/* Hidden Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInput}
                disabled={isFinished}
                className="w-full h-0 opacity-0 absolute -z-10"
                autoFocus
              />
              
              {/* Footer / Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-6 gap-4">
                <p className="text-gray-500 text-sm text-center sm:text-left">
                  Start typing to begin. The timer starts automatically.
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full sm:w-auto justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restart
                </button>
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
              <p className="text-gray-500 mb-8">Here are your final results:</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10">
                <div className="bg-blue-50 px-8 py-6 rounded-2xl border border-blue-100 w-full sm:w-48">
                  <div className="text-sm text-blue-600 font-medium mb-1 uppercase tracking-wider">Speed</div>
                  <div className="text-4xl font-bold text-blue-900">{wpm} <span className="text-lg text-blue-600/70 font-normal">WPM</span></div>
                </div>
                <div className="bg-green-50 px-8 py-6 rounded-2xl border border-green-100 w-full sm:w-48">
                  <div className="text-sm text-green-600 font-medium mb-1 uppercase tracking-wider">Accuracy</div>
                  <div className="text-4xl font-bold text-green-900">{accuracy}<span className="text-lg text-green-600/70 font-normal">%</span></div>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
