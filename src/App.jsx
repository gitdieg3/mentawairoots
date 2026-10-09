import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GlobalProvider, useGlobal } from './GlobalContext';
import { supabase } from './supabaseClient';
import { HelmetProvider } from 'react-helmet-async';

// Komponen Global & Layout (Tetap di-import normal agar langsung siap)
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp'; 
import Home from './pages/Home';


// Lazy Loading Halaman Sekunder (Hanya diunduh saat dikunjungi)
const Detail = lazy(() => import('./pages/Detail'));
const Booking = lazy(() => import('./pages/Booking'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const Reviews = lazy(() => import('./pages/Reviews'));
const GaleriPage = lazy(() => import('./pages/GalleryPage'));
const KatalogPage = lazy(() => import('./pages/KatalogPage')); // Pastikan ini ada jika pakai Katalog baru
const AboutPage = lazy(() => import('./pages/AboutPage'));

// ================= KOMPONEN PROTEKSI RUTE ADMIN (REAL-TIME) =================
const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0A1610] text-[#D4F85A] font-bold text-xl animate-pulse">
                <i className="fa-solid fa-shield-halved mr-3"></i> Memverifikasi ...
            </div>
        );
    }
    
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
            <TopBar />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    );
};

// ================= KOMPONEN LOADING FALLBACK =================
const PageLoader = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-[#0A1610]">
        <i className="fa-solid fa-compass fa-spin text-4xl mb-3 text-mentawaiMint"></i>
        <p className="font-bold text-xs uppercase tracking-widest animate-pulse">Memuat halaman...</p>
    </div>
);

function App() {
    return (
        <GlobalProvider>
            <Router>
                <div className="bg-[#FAF8F5] text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen flex flex-col relative">
                    <GlobalToast />
                    <LayoutWrapper>
                        {/* Suspense membungkus rute yang di-lazy load */}
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/detail" element={<Detail />} />
                                <Route path="/booking" element={<Booking />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/reviews" element={<Reviews />} />
                                <Route path="/GaleriPage" element={<GaleriPage />} />
                                <Route path="/katalog" element={<KatalogPage />} />
                                <Route path="/about" element={<AboutPage />} /> 
                                {/* Rute Admin Dibungkus Gembok Keamanan */}
                                <Route path="/admin/*" element={
                                    <ProtectedRoute>
                                        <Admin />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </Suspense>
                    </LayoutWrapper>

                    {/* Widget WhatsApp Melayang Global */}
                    <FloatingWhatsApp />
                </div>
            </Router>
        </GlobalProvider>
    );
}

export default App;