import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ScriptEvent, Character, Background, generateId } from './types';

const defaultProject: Project = {
  backgrounds: [
    {
      id: 'bg_classroom',
      name: 'Classroom',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=3132&auto=format&fit=crop',
    },
    {
      id: 'bg_street',
      name: 'Street',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=3556&auto=format&fit=crop',
    },
  ],
  characters: [
    {
      id: 'char_aiko',
      name: 'Aiko',
      color: '#ef4444',
      emotions: [
        { name: 'happy', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiko&mouth=smile' },
        { name: 'sad', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiko&mouth=sad' },
      ],
    },
    {
      id: 'char_kenji',
      name: 'Kenji',
      color: '#3b82f6',
      emotions: [
        { name: 'neutral', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji&mouth=default' },
      ],
    },
  ],
  music: [
    {
      id: 'bgm_theme',
      name: 'Calm Theme',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_27ef2f2ea6.mp3'
    }
  ],
  sounds: [
    {
      id: 'sfx_click',
      name: 'Pop',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82ecabf.mp3'
    }
  ],
  script: [
    { id: 'ev_1', type: 'scene', backgroundId: 'bg_classroom' },
    { id: 'ev_2', type: 'show', characterId: 'char_aiko', emotion: 'happy', position: 'center' },
    { id: 'ev_3', type: 'dialogue', characterId: 'char_aiko', text: 'Welcome to the Visual Novel Engine!' },
    { id: 'ev_4', type: 'dialogue', characterId: null, text: 'You can create your own stories, add characters, and play them instantly.' },
    { id: 'ev_5', type: 'show', characterId: 'char_aiko', emotion: 'sad', position: 'left' },
    { id: 'ev_6', type: 'show', characterId: 'char_kenji', emotion: 'neutral', position: 'right' },
    { id: 'ev_7', type: 'dialogue', characterId: 'char_kenji', text: 'Checkout the Scene and Script editors to modify this project.' },
  ],
};

interface AppContextType {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project>(() => {
    const saved = localStorage.getItem('vn_project');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProject,
          ...parsed,
          // Ensure arrays exist even if they were missing in old save
          backgrounds: parsed.backgrounds || defaultProject.backgrounds,
          characters: parsed.characters || defaultProject.characters,
          music: parsed.music || defaultProject.music,
          sounds: parsed.sounds || defaultProject.sounds,
          script: parsed.script || defaultProject.script,
        };
      } catch (e) {
        return defaultProject;
      }
    }
    return defaultProject;
  });

  useEffect(() => {
    localStorage.setItem('vn_project', JSON.stringify(project));
  }, [project]);

  return (
    <AppContext.Provider value={{ project, setProject }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
