import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../store';
import { ScriptEvent, Position } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

export default function Player() {
  const { project } = useAppContext();
  const [currentIdx, setCurrentIdx] = useState(-1);

  // Advance to the first dialogue on mount or when reset
  useEffect(() => {
    if (currentIdx === -1 && project.script.length > 0) {
      advance();
    }
  }, [currentIdx, project.script]);

  const advance = () => {
    let nextIdx = currentIdx + 1;
    while (nextIdx < project.script.length && project.script[nextIdx].type !== 'dialogue') {
      nextIdx++;
    }
    setCurrentIdx(nextIdx);
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx(-1);
    setPrevIdx(-1);
  };

  // Compute game state at the currentIdx
  const gameState = useMemo(() => {
    let bgId: string | null = null;
    let visibleChars: Record<string, { emotion: string; position: Position }> = {};
    let dialogue: (ScriptEvent & { type: 'dialogue' }) | null = null;
    let musicId: string | null = null;
    let loopMusic = false;

    for (let i = 0; i <= currentIdx && i < project.script.length; i++) {
      const ev = project.script[i];
      if (ev.type === 'scene') bgId = ev.backgroundId;
      if (ev.type === 'show') visibleChars[ev.characterId] = { emotion: ev.emotion, position: ev.position };
      if (ev.type === 'hide') delete visibleChars[ev.characterId];
      if (ev.type === 'play_music') {
        musicId = ev.musicId;
        loopMusic = ev.loop;
      }
      if (ev.type === 'stop_music') musicId = null;
      if (ev.type === 'dialogue') dialogue = ev;
    }

    return { bgId, visibleChars, dialogue, musicId, loopMusic, isEnd: currentIdx >= project.script.length };
  }, [currentIdx, project.script]);

  const currentBg = project.backgrounds.find(b => b.id === gameState.bgId);
  const currentMusic = project.music.find(m => m.id === gameState.musicId);

  const [prevIdx, setPrevIdx] = useState(-1);
  useEffect(() => {
    if (currentIdx > prevIdx) {
      for (let i = prevIdx + 1; i <= currentIdx && i < project.script.length; i++) {
        const ev = project.script[i];
        if (ev.type === 'play_sound') {
          const snd = project.sounds.find(s => s.id === ev.soundId);
          if (snd && snd.url) {
            const audio = new Audio(snd.url);
            audio.play().catch(e => console.error('Audio play failed:', e));
          }
        }
      }
    }
    setPrevIdx(currentIdx);
  }, [currentIdx, prevIdx, project.script, project.sounds]);
  
  // Format character rendering data
  const renderChars = (Object.entries(gameState.visibleChars) as [string, { emotion: string; position: Position }][]).map(([charId, state]) => {
    const charData = project.characters.find(c => c.id === charId);
    if (!charData) return null;
    const emotionData = charData.emotions.find(e => e.name === state.emotion) || charData.emotions[0];
    return {
      id: charId,
      name: charData.name,
      url: emotionData?.url || '',
      position: state.position
    };
  }).filter(Boolean) as { id: string; name: string; url: string; position: Position }[];

  const dialogueChar = gameState.dialogue?.characterId 
    ? project.characters.find(c => c.id === gameState.dialogue?.characterId) 
    : null;

  return (
    <div className="w-full h-full bg-[#0C0C0F] flex items-center justify-center relative overflow-hidden">
      {/* Game Window (16:9 aspect ratio container) */}
      <div 
        className="relative shadow-2xl bg-black border border-[#2D2D33] rounded overflow-hidden cursor-pointer"
        style={{ width: '100%', maxWidth: '1280px', aspectRatio: '16/9' }}
        onClick={advance}
      >
        {/* Audio Layer */}
        {currentMusic && currentMusic.url && (
          <audio src={currentMusic.url} autoPlay loop={gameState.loopMusic} />
        )}

        {/* Background Layer */}
        <AnimatePresence>
          {currentBg && (
            <motion.img
              key={currentBg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={currentBg.url}
              alt={currentBg.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>

        {/* Character Layer */}
        <div className="absolute inset-0 pointer-events-none pb-[20%]"> {/* pb to push above text box */}
          <AnimatePresence>
            {renderChars.map((char) => {
              // Map position strings to CSS classes relative to the container
              let alignClass = '';
              switch(char.position) {
                case 'left': alignClass = 'left-[10%]'; break;
                case 'center': alignClass = 'left-1/2 -translate-x-1/2'; break;
                case 'right': alignClass = 'right-[10%]'; break;
              }

              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute bottom-0 h-[80%] ${alignClass}`}
                >
                  {char.url ? (
                    <img src={char.url} alt={char.name} className="h-full object-contain" />
                  ) : (
                    <div className="h-full aspect-[3/4] bg-gray-400/50 flex flex-col justify-end items-center pb-8 border-4 border-gray-500 rounded-t-full">
                      <span className="bg-black/50 text-white px-2 py-1 rounded text-sm">{char.name} (Missing Img)</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* HUD / Dialogue Layer */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 pointer-events-none">
          {gameState.dialogue ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentIdx} // Force re-animation on new dialogue line
              className="bg-black/85 backdrop-blur-md rounded border border-white/10 p-4 relative pointer-events-auto w-full max-w-4xl mx-auto shadow-2xl"
            >
              <div 
                className="text-xs font-bold mb-1.5 tracking-wider uppercase drop-shadow-md"
                style={{ 
                  color: dialogueChar?.color || '#888888',
                  display: dialogueChar ? 'block' : 'none'
                }}
              >
                {dialogueChar?.name}
              </div>
              
              <div className="text-base text-white leading-relaxed min-h-[50px] drop-shadow-md">
                {gameState.dialogue.text}
              </div>
            </motion.div>
          ) : gameState.isEnd ? (
            <div className="w-full flex justify-center pb-8 pointer-events-auto">
              <button 
                onClick={reset}
                className="flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-500/90 text-white px-6 py-2 rounded font-bold shadow-lg backdrop-blur-sm transition-all hover:scale-105 uppercase tracking-widest text-xs"
              >
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
            </div>
          ) : null}
        </div>
        
        {/* Helper overlay */}
        {!gameState.isEnd && (
           <div className="absolute top-4 right-4 text-white/50 text-xs font-medium pointer-events-none tracking-widest uppercase">
             Click anywhere to advance
           </div>
        )}
      </div>
    </div>
  );
}
