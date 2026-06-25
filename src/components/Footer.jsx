import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Footer = () => {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('pengaturan_web').select('*').limit(1).single();
            if (data) setSettings(data);
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-mentawaiDark text-white/70 pt-20 pb-10 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                {/* Logo & Brand Description */}
                <div>
                    <a href="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white mb-6">
                        <span className="font-serif italic font-bold">Mentawai</span><span className="text-mentawaiMint font-sans font-light tracking-widest text-lg border-l border-white/20 pl-2">
                            {settings.brand_name ? settings.brand_name.replace('Mentawai ', '') : 'Hantage'}
                        </span>
                    </a>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                        {settings.brand_name || 'Mentawai Hantage'}  Mentawairoots is a local travel agency specializing in guiding indigenous Siberut tribal expedition adventures, tropical jungle explorations, and surf charters in the Mentawai Islands.
                    </p>
                    <div className="flex gap-4">
                        {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-mentawaiMint hover:text-mentawaiDark flex items-center justify-center text-white transition"><i className="fa-brands fa-facebook-f"></i></a>}
                        {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-mentawaiMint hover:text-mentawaiDark flex items-center justify-center text-white transition"><i className="fa-brands fa-instagram"></i></a>}
                    </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="md:pl-12">
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Quick Links</h3>
                    <ul className="space-y-3.5 text-sm">
                        <li><a href="/" className="hover:text-mentawaiMint transition duration-300">Home</a></li>
                        <li><a href="/#packages" className="hover:text-mentawaiMint transition duration-300">Our Packages</a></li>
                        <li><a href="/#media-gallery" className="hover:text-mentawaiMint transition duration-300">Activities & Media</a></li>
                        <li><a href="/#about-us" className="hover:text-mentawaiMint transition duration-300">About us</a></li>
                    </ul>
                </div>

                {/* Contact & Address */}
                <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Contact</h3>
                    <ul className="space-y-4 text-sm text-white/60">
                        <li className="flex items-start gap-3">
                            <i className="fa-solid fa-map-pin text-mentawaiMint mt-1 text-base"></i>
                            <span>{settings.alamat || 'Muara Siberut, Kepulauan Mentawai, Sumatera Barat, Indonesia'}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <i className="fa-brands fa-whatsapp text-mentawaiMint text-base"></i>
                            <span>{settings.nomor_wa || '+62 812-6774-808'}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <i className="fa-solid fa-envelope text-mentawaiMint text-base"></i>
                            <span>{settings.email || 'mentawaitribebooking@gmail.com'}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
                <p>&copy; {new Date().getFullYear()} {settings.brand_name || 'Mentawai Roots'}. Crafted with love for the wild.</p>

                <div className="flex gap-6 items-center">
                    {/* TOMBOL RAHASIA LOGIN ADMIN */}
                    <a href="/login" className="hover:text-mentawaiMint transition duration-300 flex items-center gap-1.5 opacity-50 hover:opacity-100">
                        <i className="fa-solid fa-lock text-[10px]"></i> Portal
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;