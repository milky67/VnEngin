import React from 'react';
import { useAppContext } from '../store';
import { ScriptEvent, generateId, Position } from '../types';
import { MessageSquare, Image as ImageIcon, User, UserX, Trash2, ChevronUp, ChevronDown, Plus, Music, Volume2 } from 'lucide-react';

export default function ScriptEditor() {
  const { project, setProject } = useAppContext();

  const addEvent = (type: ScriptEvent['type']) => {
    let newEvent: ScriptEvent;
    if (type === 'dialogue') {
      newEvent = { id: generateId(), type: 'dialogue', characterId: null, text: '' };
    } else if (type === 'scene') {
      newEvent = { id: generateId(), type: 'scene', backgroundId: project.backgrounds[0]?.id || '' };
    } else if (type === 'show') {
      const char = project.characters[0];
      newEvent = { 
        id: generateId(), 
        type: 'show', 
        characterId: char?.id || '', 
        emotion: char?.emotions[0]?.name || '', 
        position: 'center' 
      };
    } else if (type === 'hide') {
      newEvent = { id: generateId(), type: 'hide', characterId: project.characters[0]?.id || '' };
    } else if (type === 'play_music') {
      newEvent = { id: generateId(), type: 'play_music', musicId: project.music[0]?.id || '', loop: true };
    } else if (type === 'stop_music') {
      newEvent = { id: generateId(), type: 'stop_music' };
    } else {
      newEvent = { id: generateId(), type: 'play_sound', soundId: project.sounds[0]?.id || '' };
    }

    setProject({ ...project, script: [...project.script, newEvent] });
  };

  const updateEvent = (index: number, updates: Partial<ScriptEvent>) => {
    setProject({
      ...project,
      script: project.script.map((ev, i) => i === index ? { ...ev, ...updates } as ScriptEvent : ev)
    });
  };

  const deleteEvent = (index: number) => {
    setProject({
      ...project,
      script: project.script.filter((_, i) => i !== index)
    });
  };

  const moveEvent = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= project.script.length) return;
    const newScript = [...project.script];
    const temp = newScript[index];
    newScript[index] = newScript[index + direction];
    newScript[index + direction] = temp;
    setProject({ ...project, script: newScript });
  };

  const renderEventEditor = (ev: ScriptEvent, index: number) => {
    switch (ev.type) {
      case 'dialogue':
        return (
          <div className="flex flex-col gap-2 w-full">
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs w-48 focus:outline-none focus:border-indigo-500"
              value={ev.characterId || ''}
              onChange={(e) => updateEvent(index, { characterId: e.target.value || null })}
            >
              <option value="">Narrator (No Character)</option>
              {project.characters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <textarea
              className="w-full bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 min-h-[60px] resize-y"
              placeholder="Dialogue text..."
              value={ev.text}
              onChange={(e) => updateEvent(index, { text: e.target.value })}
            />
          </div>
        );
      case 'scene':
        return (
          <div className="flex items-center gap-4 w-full">
            <span className="text-xs text-[#888]">Change background to:</span>
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs flex-1 focus:outline-none focus:border-indigo-500"
              value={ev.backgroundId}
              onChange={(e) => updateEvent(index, { backgroundId: e.target.value })}
            >
              {project.backgrounds.map(bg => (
                <option key={bg.id} value={bg.id}>{bg.name}</option>
              ))}
            </select>
          </div>
        );
      case 'show':
        return (
          <div className="flex flex-wrap items-center gap-3 w-full">
            <span className="text-xs text-[#888]">Show</span>
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs w-32 focus:outline-none focus:border-indigo-500"
              value={ev.characterId}
              onChange={(e) => updateEvent(index, { characterId: e.target.value })}
            >
              {project.characters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <span className="text-xs text-[#888]">emotion</span>
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs w-32 focus:outline-none focus:border-indigo-500"
              value={ev.emotion}
              onChange={(e) => updateEvent(index, { emotion: e.target.value })}
            >
              {project.characters.find(c => c.id === ev.characterId)?.emotions?.map(emo => (
                <option key={emo.name} value={emo.name}>{emo.name}</option>
              ))}
            </select>
            <span className="text-xs text-[#888]">at</span>
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs w-28 focus:outline-none focus:border-indigo-500"
              value={ev.position}
              onChange={(e) => updateEvent(index, { position: e.target.value as Position })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        );
      case 'hide':
        return (
          <div className="flex items-center gap-4 w-full">
            <span className="text-xs text-[#888]">Hide character:</span>
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs flex-1 focus:outline-none focus:border-indigo-500"
              value={ev.characterId}
              onChange={(e) => updateEvent(index, { characterId: e.target.value })}
            >
              {project.characters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        );
      case 'play_music':
        return (
          <div className="flex items-center gap-4 w-full">
            <span className="text-xs text-[#888]">Play music:</span>
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs flex-1 focus:outline-none focus:border-indigo-500"
              value={ev.musicId}
              onChange={(e) => updateEvent(index, { musicId: e.target.value })}
            >
              {project.music.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-[#888] cursor-pointer">
               <input type="checkbox" className="accent-indigo-500 rounded bg-[#0C0C0F] border-[#2D2D33]" checked={ev.loop} onChange={(e) => updateEvent(index, { loop: e.target.checked })} />
               Loop
            </label>
          </div>
        );
      case 'stop_music':
        return <div className="text-xs text-orange-400 font-medium flex items-center h-full">Stop current music track</div>;
      case 'play_sound':
         return (
          <div className="flex items-center gap-4 w-full">
            <span className="text-xs text-[#888]">Play sound:</span>
            <select
              className="bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1 text-xs flex-1 focus:outline-none focus:border-indigo-500"
              value={ev.soundId}
              onChange={(e) => updateEvent(index, { soundId: e.target.value })}
            >
              {project.sounds.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        );
    }
  };

  const getEventIcon = (type: ScriptEvent['type']) => {
    switch (type) {
      case 'dialogue': return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'scene': return <ImageIcon className="w-5 h-5 text-emerald-400" />;
      case 'show': return <User className="w-5 h-5 text-purple-400" />;
      case 'hide': return <UserX className="w-5 h-5 text-rose-400" />;
      case 'play_music': return <Music className="w-5 h-5 text-indigo-400" />;
      case 'stop_music': return <Music className="w-5 h-5 text-gray-500" />;
      case 'play_sound': return <Volume2 className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[#0C0C0F]">
      {/* Navbar/Sidebar for Add Actions */}
      <div className="md:w-56 bg-[#151518] border-b md:border-b-0 md:border-r border-[#2D2D33] p-2 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto whitespace-nowrap md:whitespace-normal">
        <div className="hidden md:flex p-2 text-[10px] font-bold uppercase tracking-wider text-[#555] justify-between items-center mb-1">
          <span>Add Event</span>
        </div>
        <button onClick={() => addEvent('dialogue')} className="flex items-center gap-2 p-2 hover:bg-[#25252A] rounded cursor-pointer transition-colors text-xs text-[#888] hover:text-white font-medium border border-transparent">
          <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0" /> <span className="hidden sm:inline md:hidden lg:inline">Dialogue</span>
        </button>
        <button onClick={() => addEvent('scene')} className="flex items-center gap-2 p-2 hover:bg-[#25252A] rounded cursor-pointer transition-colors text-xs text-[#888] hover:text-white font-medium border border-transparent">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <span className="hidden sm:inline md:hidden lg:inline">Scene Change</span>
        </button>
        <button onClick={() => addEvent('show')} className="flex items-center gap-2 p-2 hover:bg-[#25252A] rounded cursor-pointer transition-colors text-xs text-[#888] hover:text-white font-medium border border-transparent">
          <User className="w-3.5 h-3.5 text-purple-400 shrink-0" /> <span className="hidden sm:inline md:hidden lg:inline">Show Char</span>
        </button>
        <button onClick={() => addEvent('hide')} className="flex items-center gap-2 p-2 hover:bg-[#25252A] rounded cursor-pointer transition-colors text-xs text-[#888] hover:text-white font-medium border border-transparent">
          <UserX className="w-3.5 h-3.5 text-rose-400 shrink-0" /> <span className="hidden sm:inline md:hidden lg:inline">Hide Char</span>
        </button>
        <div className="hidden md:block h-px bg-[#2D2D33] my-2"></div>
        <button onClick={() => addEvent('play_music')} className="flex items-center gap-2 p-2 hover:bg-[#25252A] rounded cursor-pointer transition-colors text-xs text-[#888] hover:text-white font-medium border border-transparent">
          <Music className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> <span className="hidden sm:inline md:hidden lg:inline">Play Music</span>
        </button>
        <button onClick={() => addEvent('stop_music')} className="flex items-center gap-2 p-2 hover:bg-[#25252A] rounded cursor-pointer transition-colors text-xs text-[#888] hover:text-white font-medium border border-transparent">
          <Music className="w-3.5 h-3.5 text-gray-500 shrink-0" /> <span className="hidden sm:inline md:hidden lg:inline">Stop Music</span>
        </button>
        <button onClick={() => addEvent('play_sound')} className="flex items-center gap-2 p-2 hover:bg-[#25252A] rounded cursor-pointer transition-colors text-xs text-[#888] hover:text-white font-medium border border-transparent">
          <Volume2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> <span className="hidden sm:inline md:hidden lg:inline">Play Sound</span>
        </button>
      </div>

      {/* Main Script Area */}
      <div className="flex-1 overflow-y-auto p-2 md:p-8">
        <div className="max-w-4xl mx-auto space-y-2 pb-32">
          {project.script.length === 0 ? (
            <div className="text-center text-[#555] py-16 border border-dashed border-[#2D2D33] rounded-xl text-sm">
              Script is empty. Add events from the sidebar.
            </div>
          ) : (
            project.script.map((ev, index) => (
              <div key={ev.id} className="flex gap-4 group items-start">
                {/* Line number and controls */}
                <div className="flex flex-col items-center pt-2 gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-[#555] w-6 text-center">{index + 1}</span>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <button onClick={() => moveEvent(index, -1)} disabled={index === 0} className="text-[#555] hover:text-[#D1D1D1] disabled:opacity-30">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveEvent(index, 1)} disabled={index === project.script.length - 1} className="text-[#555] hover:text-[#D1D1D1] disabled:opacity-30">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Event Block */}
                <div className="flex-1 bg-[#151518] border border-[#2D2D33] rounded flex gap-3 shadow-none hover:border-indigo-500/50 transition-colors">
                  <div className="p-3 bg-[#1A1A1E] border-r border-[#2D2D33] shrink-0 flex items-start justify-center rounded-l">
                    {getEventIcon(ev.type)}
                  </div>
                  <div className="flex-1 py-3 text-[#D1D1D1]">
                    {renderEventEditor(ev, index)}
                  </div>
                  <div className="shrink-0 pt-3 pr-3">
                    <button onClick={() => deleteEvent(index)} className="text-[#555] hover:text-red-400 p-1 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
