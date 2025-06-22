import { useState } from 'react';
import axios from 'axios';
import logo from './update.png';


export default function FastMCPChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/query',  // <-- Updated endpoint
        { query: input },                   // <-- Payload matches FastAPI model
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const serverMsg = response.data?.response ?? "[No response]";
      const botMessage = { role: 'assistant', content: serverMsg };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "[Error contacting server]" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
        <div className="w-full flex justify-end mb-6">
  <img src={logo} alt="לוגו" className="h-28 w-auto mr-2" />
</div>
      <h1 className="text-2xl font-bold mb-4">שלומי</h1>


      <div className="border rounded p-4 h-96 overflow-y-scroll mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}