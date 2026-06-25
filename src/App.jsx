import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GlobalProvider, useGlobal } from './GlobalContext';
import { supabase } from './supabaseClient'; // Pastikan import supabase untuk ngecek sesi

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Reviews from './pages/Reviews';

// ================= KOMPONEN PROTEKSI RUTE ADMIN =================
const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek sesi login saat ini
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0A1610] text-[#D4F85A] font-bold text-xl animate-pulse">
                <i className="fa-solid fa-shield-halved mr-3"></i> Memverifikasi Keamanan...
            </div>
        );
    }
    
    // Jika tidak ada sesi, langsung tendang ke login (tanpa render halaman Admin)
    if (!session) return <Navigate to="/login" replace />;
    
    return children;
};

// ================= KOMPONEN TOAST GLOBAL =================
const GlobalToast = () => {
    const { toast } = useGlobal();
    if (!toast.show) return null;
    return (
        <div className={`fixed top-6 right-6 px-5 py-3.5 rounded-xl shadow-2xl border font-medium z-[200] animate-fade-in flex items-center gap-3 text-sm ${toast.type === 'success' ? 'bg-[#0A1610] border-[#1A3626] text-[#D4F85A]' : 'bg-red-50 border-red-200 text-red-600'}`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
            {toast.message}
        </div>
    );
};

// ================= WRAPPER LAYOUT (NAVBAR & FOOTER) =================
const LayoutWrapper = ({ children }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

    if (isAdminPage) return <main className="flex-grow">{children}</main>;

    return (
        <>
            <div className="bg-[#0A1610] text-white/80 py-2.5 px-6 text-center text-xs tracking-wider font-semibold border-b border-white/10">
                <span className="text-[#a8c69f]">EXCLUSIVE OFFER:</span> Rasakan Kehidupan Suku Mentawai Asli & Ombak Legendaris
            </div>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    );
};

function App() {
    return (
        <GlobalProvider>
            <Router>
                <div className="bg-[#FAF8F5] text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen flex flex-col relative">
                    <GlobalToast />
                    <LayoutWrapper>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/detail" element={<Detail />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/reviews" element={<Reviews />} />
                            
                            {/* Rute Admin Sudah Dibungkus Gembok Keamanan */}
                            <Route path="/admin/*" element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </LayoutWrapper>
                </div>
            </Router>
        </GlobalProvider>
    );
}

export default App;