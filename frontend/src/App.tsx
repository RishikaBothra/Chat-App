import './App.css'
import { LucideSend } from 'lucide-react';

function App() {
  return (
    <div className='h-screen bg-black flex flex-col'>
      <div className='h-[95vh] bg-black'>
        </div>
        <div className="flex items-center gap-2 p-4 bg-gray-900">
          <input 
            type="text" 
            className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 " 
            placeholder="Type a message..." 
          />
          <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ">
            <LucideSend size={20} />
          </button>
        </div>
    </div>
  );
}

export default App
