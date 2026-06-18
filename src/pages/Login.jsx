import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Gagal: ${error.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#1a2e28] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm bg-[#ffffff] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header dengan sentuhan warna alam */}
        <div className="bg-[#2d4a3e] p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            Mentawai<span className="text-[#a8c69f]">Roots</span>
          </h2>
          <p className="text-[10px] text-[#a8c69f] uppercase tracking-widest font-semibold">
            Admin Access Portal
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d4a3e] transition text-sm" 
              placeholder="" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d4a3e] transition text-sm" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2d4a3e] hover:bg-[#1a2e28] text-white font-bold py-3 rounded-lg transition duration-300 shadow-md mt-4"
          >
            {loading ? 'Authenticating...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;