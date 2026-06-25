import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('pengaturan_web').select('*').limit(1).single();
            if (data) setSettings(data);
        };
        fetchSettings();
    }, []);

    // Format nomor WA
    let adminPhone = settings.nomor_wa || '628126774808';
    adminPhone = adminPhone.replace(/\D/g, ''); // <-- TAMBAHAN: Bersihkan semua simbol & spasi
    if (adminPhone.startsWith('0')) adminPhone = '62' + adminPhone.substring(1);

    return (
        <nav className="bg-[#FAF8F5]/90 backdrop-blur-md fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 border-b border-mentawaiDark/5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo Brand Dinamis */}
                <a href="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-mentawaiDark">
                    <span className="font-serif italic font-bold">Mentawai</span>
                    <span className="text-mentawaiSage font-sans font-light tracking-widest text-lg border-l border-mentawaiDark/20 pl-2">
                        {settings.brand_name ? settings.brand_name.replace('Mentawai ', '') : 'Hantage'}
                    </span>
                </a>

                {/* Hamburger Button (Mobile) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-mentawaiDark focus:outline-none text-2xl"
                >
                    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8 font-medium text-sm text-mentawaiDark/80">
                    <a href="/#packages" className="hover:text-mentawaiMint transition duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mentawaiMint hover:after:w-full after:transition-all">Our Packages</a>
                    <a href="/#media-gallery" className="hover:text-mentawaiMint transition duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mentawaiMint hover:after:w-full after:transition-all">Activities & media</a>
                    <a href="/reviews" className="hover:text-mentawaiMint transition duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mentawaiMint hover:after:w-full after:transition-all">Review</a>
                    <a href="/#about-us" className="hover:text-mentawaiMint transition duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mentawaiMint hover:after:w-full after:transition-all">about Us</a>
                </div>

                {/* Hubungi WA Action Button (Desktop) */}
                <div className="hidden md:block">
                    <a href={`https://wa.me/${adminPhone}`} target="_blank" rel="noreferrer"
                        className="bg-mentawaiDark text-white hover:bg-mentawaiSage px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition duration-300 shadow-lg shadow-mentawaiDark/10 hover:shadow-xl hover:shadow-mentawaiSage/20 transform hover:-translate-y-0.5">
                        Hubungi WA
                    </a>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#FAF8F5] border-b border-mentawaiDark/10 shadow-xl flex flex-col py-4 px-6 gap-4 animate-fade-in">
                    <a href="/#packages" onClick={() => setIsOpen(false)} className="font-bold text-mentawaiDark border-b border-mentawaiDark/5 pb-2">Our Packages</a>
                    <a href="/#media-gallery" onClick={() => setIsOpen(false)} className="font-bold text-mentawaiDark border-b border-mentawaiDark/5 pb-2">Activities & media</a>
                    <a href="/#about-us" onClick={() => setIsOpen(false)} className="font-bold text-mentawaiDark border-b border-mentawaiDark/5 pb-2">about Us</a>
                    <a href="/reviews" onClick={() => setIsOpen(false)} className="font-bold text-mentawaiDark border-b border-mentawaiDark/5 pb-2">Review</a>
                    <a href={`https://wa.me/${adminPhone}`} target="_blank" rel="noreferrer" className="mt-2 bg-mentawaiDark text-center text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs">
                        <i className="fa-brands fa-whatsapp text-mentawaiMint mr-2"></i> Contact Admin
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;