import React, { useState } from 'react';
import { Play, Settings2, FileText, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import Player from './components/Player';
import ScriptEditor from './components/ScriptEditor';
import SceneEditor from './components/SceneEditor';
import { useAppContext } from './store';

type Tab = 'play' | 'script' | 'assets';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('play');
  const { project, setProject } = useAppContext();

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'vn_project.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? (This will clear your local storage)')) {
      localStorage.removeItem('vn_project');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0F0F12] text-[#D1D1D1] font-sans overflow-hidden select-none">
      {/* Header */}
      <header className="h-12 bg-[#1A1A1E] border-b border-[#2D2D33] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 text-white rounded flex items-center justify-center font-bold text-xs"><Settings2 className="w-3.5 h-3.5" /></div>
            <span className="text-sm font-semibold tracking-tight text-white hidden sm:block">VN Engine <span className="text-[#666] font-normal">/ Untitled_Project</span></span>
          </div>
          
          <nav className="flex gap-4 text-xs font-medium text-[#888] h-full items-end">
             <button
              onClick={() => setActiveTab('assets')}
              className={`pb-3 px-1 border-b-2 hover:text-white transition-colors flex items-center gap-1.5 ${
                 activeTab === 'assets' ? 'text-white border-indigo-500' : 'border-transparent cursor-pointer'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Assets</span>
            </button>
            <button
              onClick={() => setActiveTab('script')}
               className={`pb-3 px-1 border-b-2 hover:text-white transition-colors flex items-center gap-1.5 ${
                 activeTab === 'script' ? 'text-white border-indigo-500' : 'border-transparent cursor-pointer'
               }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Script</span>
            </button>
             <button
              onClick={() => setActiveTab('play')}
               className={`pb-3 px-1 border-b-2 hover:text-white transition-colors flex items-center gap-1.5 ${
                 activeTab === 'play' ? 'text-white border-indigo-500' : 'border-transparent cursor-pointer'
               }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
            <button onClick={handleReset} className="bg-[#2D2D33] hover:bg-[#3D3D45] text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5" title="Reset All Data">
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
               Reset
            </button>
             <button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5" title="Download Project Data">
               <Download className="w-3.5 h-3.5" />
               Export
             </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'play' && <Player />}
        {activeTab === 'script' && <ScriptEditor />}
        {activeTab === 'assets' && <SceneEditor />}
      </main>
    </div>
  );
}
