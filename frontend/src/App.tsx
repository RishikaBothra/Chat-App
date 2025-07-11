import { useEffect, useState,useRef } from 'react';
import './App.css'
import { LucideSend } from 'lucide-react';

function App() {

  const [messages, setMessages] = useState([" hi there", "how are you doing?"]);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  
  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      wsRef.current.send(JSON.stringify({
        type: "message",
        payload: {
          message: message,
        }
      }));
      
      // Add the message to local state immediately for better UX
      setMessages(m => [...m, `You: ${message}`]);
    } else {
      console.log('WebSocket not connected. ReadyState:', wsRef.current?.readyState);
      alert('Not connected to server');
    }
  };
  
  useEffect(() =>{
    const ws = new WebSocket("ws://localhost:8080");
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('Connected');
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }));
    };
    
    ws.onmessage = (event) =>{
      console.log('Received message:', event.data);
      setMessages(m => [...m, event.data]);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('Disconnected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };
    
    wsRef.current = ws;
    
    return () => {
      ws.close();
    };
  }, []);
  return (
    <div className='h-screen bg-black flex flex-col'>
      <div className="p-2 bg-gray-900 text-white text-center text-sm">
        Status: {connectionStatus}
      </div>
      <div className='h-[95vh] bg-black overflow-y-auto'>
      {messages.map((message, index) => <div key={index} className='m-8'>
        <span className='bg-gray-800 text-white p-4 rounded-lg'>{message}
          </span>
          </div>)}
        </div>
        <div className="flex items-center gap-2 p-4 bg-gray-900">
          <input 
            type="text" 
            id="message"
            className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 " 
            placeholder="Type a message..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const messageInput = e.target as HTMLInputElement;
                const message = messageInput.value.trim();
                
                if (message) {
                  sendMessage(message);
                  messageInput.value = "";
                }
              }
            }}
          />
          <button 
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={()=>{
              const messageInput = document.getElementById("message") as HTMLInputElement | null;
              const message = messageInput?.value.trim();
              
              if (message && messageInput) {
                sendMessage(message);
                messageInput.value = "";
              }
            }}
          >
            <LucideSend size={20} />
          </button>
        </div>
    </div>
  );
}

export default App
