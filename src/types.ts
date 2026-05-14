export type Position = 'left' | 'center' | 'right';

export interface Background {
  id: string;
  name: string;
  url: string;
}

export interface Emotion {
  name: string;
  url: string;
}

export interface Character {
  id: string;
  name: string;
  color: string;
  emotions: Emotion[];
}

export interface AudioAsset {
  id: string;
  name: string;
  url: string;
}

export type ScriptEvent =
  | { id: string; type: 'dialogue'; characterId: string | null; text: string }
  | { id: string; type: 'scene'; backgroundId: string }
  | { id: string; type: 'show'; characterId: string; emotion: string; position: Position }
  | { id: string; type: 'hide'; characterId: string }
  | { id: string; type: 'play_music'; musicId: string; loop: boolean }
  | { id: string; type: 'stop_music' }
  | { id: string; type: 'play_sound'; soundId: string };

export interface Project {
  backgrounds: Background[];
  characters: Character[];
  music: AudioAsset[];
  sounds: AudioAsset[];
  script: ScriptEvent[];
}

export const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
