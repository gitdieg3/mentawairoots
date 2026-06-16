import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Mengaktifkan jembatan Supabase

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Proses login aman menggunakan enkripsi Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(`Gagal Login: ${error.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate('/admin'); // Jika sukses, lempar ke halaman panel kontrol admin
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-tqmNavy p-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-wide text-white mb-1">
            Tqm<span className="text-tqmYellow">Travel</span>
          </h2>
          <p className="text-xs text-gray-300 font-medium tracking-widest uppercase">Secure Control Panel</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Administrator</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-tqmNavy transition text-sm" 
                placeholder="admin@tqmtravel.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-tqmNavy transition text-sm" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-tqmYellow hover:bg-yellow-500 text-tqmNavy font-extrabold py-3.5 rounded-xl transition duration-300 shadow-md flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? 'Memverifikasi...' : 'Login ke Panel'} <i className="fa-solid fa-arrow-right-to-bracket"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;