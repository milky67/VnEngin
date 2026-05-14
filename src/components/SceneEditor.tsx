import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Background, Character, Emotion, AudioAsset, generateId } from '../types';
import { Plus, Trash2, Music, Volume2 } from 'lucide-react';

export default function SceneEditor() {
  const { project, setProject } = useAppContext();
  const [activeTab, setActiveTab] = useState<'backgrounds' | 'characters' | 'music' | 'sounds'>('backgrounds');

  const addBackground = () => {
    const newBg: Background = { id: generateId(), name: 'New Background', url: '' };
    setProject({ ...project, backgrounds: [...project.backgrounds, newBg] });
  };

  const updateBackground = (id: string, updates: Partial<Background>) => {
    setProject({
      ...project,
      backgrounds: project.backgrounds.map(bg => bg.id === id ? { ...bg, ...updates } : bg)
    });
  };

  const deleteBackground = (id: string) => {
    setProject({
      ...project,
      backgrounds: project.backgrounds.filter(bg => bg.id !== id)
    });
  };

  const addAudio = (type: 'music' | 'sounds') => {
    const newAudio: AudioAsset = { id: generateId(), name: `New ${type === 'music' ? 'Music' : 'Sound'}`, url: '' };
    setProject({ ...project, [type]: [...project[type], newAudio] });
  };

  const updateAudio = (type: 'music' | 'sounds', id: string, updates: Partial<AudioAsset>) => {
    setProject({
      ...project,
      [type]: project[type].map(a => a.id === id ? { ...a, ...updates } : a)
    });
  };

  const deleteAudio = (type: 'music' | 'sounds', id: string) => {
    setProject({
      ...project,
      [type]: project[type].filter(a => a.id !== id)
    });
  };

  const addCharacter = () => {
    const newChar: Character = { 
      id: generateId(), 
      name: 'New Character', 
      color: '#ffffff', 
      emotions: [{ name: 'neutral', url: '' }] 
    };
    setProject({ ...project, characters: [...project.characters, newChar] });
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setProject({
      ...project,
      characters: project.characters.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  const deleteCharacter = (id: string) => {
    setProject({
      ...project,
      characters: project.characters.filter(c => c.id !== id)
    });
  };

  const addEmotion = (charId: string) => {
    setProject({
      ...project,
      characters: project.characters.map(c => {
        if (c.id !== charId) return c;
        return { ...c, emotions: [...c.emotions, { name: 'new', url: '' }] };
      })
    });
  };

  const updateEmotion = (charId: string, emotionIndex: number, updates: Partial<Emotion>) => {
    setProject({
      ...project,
      characters: project.characters.map(c => {
        if (c.id !== charId) return c;
        const newEmotions = [...c.emotions];
        newEmotions[emotionIndex] = { ...newEmotions[emotionIndex], ...updates };
        return { ...c, emotions: newEmotions };
      })
    });
  };

  const deleteEmotion = (charId: string, emotionIndex: number) => {
    setProject({
      ...project,
      characters: project.characters.map(c => {
        if (c.id !== charId) return c;
        const newEmotions = c.emotions.filter((_, idx) => idx !== emotionIndex);
        return { ...c, emotions: newEmotions };
      })
    });
  };

  const renderAudioEditor = (type: 'music' | 'sounds', title: string) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#D1D1D1]">{title}</h2>
        <button onClick={() => addAudio(type)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add {type === 'music' ? 'Music' : 'Sound'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project[type].map(audio => (
          <div key={audio.id} className="bg-[#151518] border border-[#2D2D33] rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between relative group">
              <div className="flex-1">
                {type === 'music' ? <Music className="w-6 h-6 text-indigo-400 mb-1" /> : <Volume2 className="w-6 h-6 text-orange-400 mb-1" />}
              </div>
              <button onClick={() => deleteAudio(type, audio.id)} className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {audio.url && (
               <audio controls className="w-full h-8" src={audio.url} />
            )}
            <input
              type="text"
              className="w-full bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              placeholder="Name"
              value={audio.name}
              onChange={(e) => updateAudio(type, audio.id, { name: e.target.value })}
            />
            <input
              type="text"
              className="w-full bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              placeholder="Audio URL"
              value={audio.url}
              onChange={(e) => updateAudio(type, audio.id, { url: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[#0C0C0F]">
      {/* Navbar/Sidebar for Asset Types */}
      <div className="md:w-56 bg-[#151518] border-b md:border-b-0 md:border-r border-[#2D2D33] p-2 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto whitespace-nowrap md:whitespace-normal">
        <div className="hidden md:flex p-2 text-[10px] font-bold uppercase tracking-wider text-[#555] justify-between items-center mb-1">
          <span>Asset Browser</span>
        </div>
        <button
          onClick={() => setActiveTab('backgrounds')}
          className={`text-left p-2 rounded cursor-pointer flex items-center gap-2 text-xs transition-colors font-medium border border-transparent ${activeTab === 'backgrounds' ? 'bg-[#25252A] text-white border-[#2D2D33]' : 'text-[#888] hover:bg-[#25252A] hover:text-white'}`}
        >
          Backgrounds
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`text-left p-2 rounded cursor-pointer flex items-center gap-2 text-xs transition-colors font-medium border border-transparent ${activeTab === 'characters' ? 'bg-[#25252A] text-white border-[#2D2D33]' : 'text-[#888] hover:bg-[#25252A] hover:text-white'}`}
        >
          Characters
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`text-left p-2 rounded cursor-pointer flex items-center gap-2 text-xs transition-colors font-medium border border-transparent ${activeTab === 'music' ? 'bg-[#25252A] text-white border-[#2D2D33]' : 'text-[#888] hover:bg-[#25252A] hover:text-white'}`}
        >
          Music
        </button>
        <button
          onClick={() => setActiveTab('sounds')}
          className={`text-left p-2 rounded cursor-pointer flex items-center gap-2 text-xs transition-colors font-medium border border-transparent ${activeTab === 'sounds' ? 'bg-[#25252A] text-white border-[#2D2D33]' : 'text-[#888] hover:bg-[#25252A] hover:text-white'}`}
        >
          Sound Effects
        </button>
      </div>

      {/* Main Edit Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'backgrounds' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-[#D1D1D1]">Backgrounds</h2>
                <button onClick={addBackground} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Background
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.backgrounds.map(bg => (
                  <div key={bg.id} className="bg-[#151518] border border-[#2D2D33] rounded-md p-3 space-y-3">
                    <div className="aspect-video bg-[#0C0C0F] rounded overflow-hidden relative group border border-[#2D2D33]">
                      {bg.url ? (
                        <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#555] text-xs">No Image URL</div>
                      )}
                      <button onClick={() => deleteBackground(bg.id)} className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="Background Name (e.g. bg_room)"
                      value={bg.name}
                      onChange={(e) => updateBackground(bg.id, { name: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="Image URL"
                      value={bg.url}
                      onChange={(e) => updateBackground(bg.id, { url: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-[#D1D1D1]">Characters</h2>
                <button onClick={addCharacter} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Character
                </button>
              </div>

              <div className="space-y-6">
                {project.characters.map(char => (
                  <div key={char.id} className="bg-[#151518] border border-[#2D2D33] rounded-md p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#555] uppercase tracking-wider mb-1">Name</label>
                          <input
                            type="text"
                            className="w-full bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                            value={char.name}
                            onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#555] uppercase tracking-wider mb-1">Name Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              className="h-7 w-7 rounded border border-[#2D2D33] cursor-pointer p-0.5 bg-[#0C0C0F]"
                              value={char.color}
                              onChange={(e) => updateCharacter(char.id, { color: e.target.value })}
                            />
                            <input
                              type="text"
                              className="flex-1 bg-[#0C0C0F] border border-[#2D2D33] text-[#D1D1D1] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                              value={char.color}
                              onChange={(e) => updateCharacter(char.id, { color: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteCharacter(char.id)} className="p-1.5 text-[#555] hover:text-red-400 hover:bg-[#25252A] rounded transition-colors mt-4">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Emotions */}
                    <div className="pt-4 border-t border-[#2D2D33]">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider">Emotions / Poses</h3>
                        <button onClick={() => addEmotion(char.id)} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider cursor-pointer">
                          + Add Emotion
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {char.emotions.map((emo, idx) => (
                          <div key={idx} className="bg-[#0C0C0F] border border-[#2D2D33] rounded p-2 space-y-2 relative group">
                             <button onClick={() => deleteEmotion(char.id, idx)} className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <div className="aspect-[3/4] bg-[#151518] rounded overflow-hidden flex items-center justify-center relative border border-[#2D2D33]">
                               {emo.url ? (
                                <img src={emo.url} alt={emo.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-[10px] text-[#555]">No Image</span>
                              )}
                            </div>
                            <input
                              type="text"
                              className="w-full bg-[#151518] border border-[#2D2D33] text-[#D1D1D1] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
                              placeholder="Emotion (e.g. happy)"
                              value={emo.name}
                              onChange={(e) => updateEmotion(char.id, idx, { name: e.target.value })}
                            />
                            <input
                              type="text"
                              className="w-full bg-[#151518] border border-[#2D2D33] text-[#D1D1D1] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
                              placeholder="Image URL"
                              value={emo.url}
                              onChange={(e) => updateEmotion(char.id, idx, { url: e.target.value })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'music' && renderAudioEditor('music', 'Music Tracks')}
          {activeTab === 'sounds' && renderAudioEditor('sounds', 'Sound Effects')}
        </div>
      </div>
    </div>
  );
}
