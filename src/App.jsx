import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Booking from './pages/Booking';
import Login from './pages/Login'; // <--- Baru
import Admin from './pages/Admin'; // <--- Baru

// Wrapper untuk menyembunyikan Navbar/Footer di halaman Admin
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  if (isAdminPage) {
    return <main className="flex-grow">{children}</main>;
  }

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
    <Router>
      <div className="bg-mentawaiBone text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
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
  );
}

export default App;