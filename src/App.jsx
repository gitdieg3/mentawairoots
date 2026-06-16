import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GlobalProvider, useGlobal } from './GlobalContext'; // <-- JANTUNGNYA

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Admin from './pages/Admin';

// KOMPONEN TOAST GLOBAL
const GlobalToast = () => {
    const { toast } = useGlobal();
    if (!toast.show) return null;
    return (
        <div className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-2xl border font-bold z-[100] animate-fade-in flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'} text-lg`}></i>
            {toast.message}
        </div>
    );
};

const LayoutWrapper = ({ children }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

    if (isAdminPage) return <main className="flex-grow">{children}</main>;

    return (
        <>
            <div className="bg-mentawaiDark text-white/80 py-2.5 px-6 text-center text-xs tracking-wider font-semibold border-b border-white/10">
                <span className="text-mentawaiMint">EXCLUSIVE OFFER:</span> Rasakan Kehidupan Suku Mentawai Asli & Ombak Legendaris
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
                <div className="bg-mentawaiBone text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen flex flex-col relative">
                    <GlobalToast />
                    <LayoutWrapper>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/detail" element={<Detail />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/admin/*" element={<Admin />} />
                        </Routes>
                    </LayoutWrapper>
                </div>
            </Router>
        </GlobalProvider>
    );
}

export default App;