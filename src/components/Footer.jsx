import React from 'react';
import { useGlobal } from '../GlobalContext';

const Footer = () => {
    const { settings } = useGlobal();

    // Data integrasi
    const contactPhone = settings?.nomor_wa || '+62 812-3456-7890';
    const brandName = settings?.brand_name || 'Mentawai Roots';

    return (
        <footer className="bg-white border-t border-mentawaiDark/5 text-xs text-slate-500 pt-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                
                {/* Brand Column */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-mentawaiDark text-mentawaiMint rounded-lg flex items-center justify-center shadow-sm">
                            <i className="fa-solid fa-leaf text-sm"></i>
                        </div>
                        <span className="font-serif font-bold text-mentawaiDark tracking-tight text-lg">{brandName}</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                        Regenerative eco-cultural and surf expeditions connecting travelers directly with indigenous Mentawai communities.
                    </p>
                    <div className="flex items-center gap-4 text-slate-400 text-lg">
                        <a href={settings?.facebook || '#'} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-mentawaiSage transition"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href={settings?.instagram || '#'} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="hover:text-mentawaiSage transition"><i className="fa-brands fa-instagram"></i></a>
                        <a href="https://www.tripadvisor.co.id/Attraction_Review-g297726-d26613911-Reviews-Mentawai_Tribe-Padang_West_Sumatra_Sumatra.html" aria-label="TripAdvisor" target="_blank" rel="noopener noreferrer" className="hover:text-mentawaiSage transition"><i className="fa-brands fa-tripadvisor"></i>tripadvisor</a>
                        <a href={`https://wa.me/${contactPhone.replace(/\D/g, '')}`} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="hover:text-mentawaiSage transition"><i className="fa-brands fa-whatsapp"></i></a>
                    </div>
                </div>

                {/* Expeditions Navigation */}
                <nav aria-label="Footer Expeditions Navigation">
                    <p className="font-bold text-mentawaiDark uppercase tracking-widest mb-4 text-[11px]">Expeditions</p>
                    <ul className="space-y-3 font-medium">
                        <li><a href="/katalog" className="hover:text-mentawaiSage transition">Siberut Jungle Trekking</a></li>
                        <li><a href="/katalog" className="hover:text-mentawaiSage transition">Surf Charters & Camps</a></li>
                        <li><a href="/katalog" className="hover:text-mentawaiSage transition">Sikerei Tattoo & Culture</a></li>
                        <li><a href="/katalog" className="hover:text-mentawaiSage transition">Private Beach Eco-Villas</a></li>
                    </ul>
                </nav>

                {/* Company Navigation */}
                <nav aria-label="Footer Company Navigation">
                    <p className="font-bold text-mentawaiDark uppercase tracking-widest mb-4 text-[11px]">Company</p>
                    <ul className="space-y-3 font-medium">
                        <li><a href="/about" className="hover:text-mentawaiSage transition">About Our Native Guides</a></li>
                        <li><a href="/about" className="hover:text-mentawaiSage transition">Sustainability & Fair Pay</a></li>
                        <li><a href="/GaleriPage" className="hover:text-mentawaiSage transition">Photo Gallery</a></li>
                        <li><a href="/reviews" className="hover:text-mentawaiSage transition">Traveler Reviews</a></li>
                    </ul>
                </nav>

                {/* Contact & Legal */}
                <div>
                    <p className="font-bold text-mentawaiDark uppercase tracking-widest mb-4 text-[11px]">Emergency Contact</p>
                    <address className="not-italic">
                        <p className="mb-2 font-medium">Padang & Mentawai Operations Desk:</p>
                        <a href={`https://wa.me/${contactPhone.replace(/\D/g, '')}`} className="block font-bold text-mentawaiSage text-sm mb-2 hover:text-mentawaiDark transition">
                            {contactPhone}
                        </a>
                        <p className="text-[10px] text-slate-400 font-medium">Licensed West Sumatra Tour Operator #412/MTR/2024</p>
                    </address>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#FAF8F5] py-6 px-6 border-t border-mentawaiDark/5">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="font-medium text-slate-500 text-center sm:text-left">&copy; {new Date().getFullYear()} {brandName} Eco-Tourism. All rights reserved.</p>
                    
                    <div className="flex items-center flex-wrap justify-center gap-6 font-medium">
                        <a href="#" className="hover:text-mentawaiSage transition">Privacy Policy</a>
                        <a href="#" className="hover:text-mentawaiSage transition">Terms of Service</a>
                        <a href="#" className="hover:text-mentawaiSage transition">Travel Guidelines</a>
                        
                        {/* Tombol Portal Admin */}
                        <a 
                            href="/login" 
                            aria-label="Admin Portal"
                            className="flex items-center gap-1.5 ml-0 sm:ml-4 bg-mentawaiDark text-mentawaiMint px-3.5 py-1.5 rounded-md text-[11px] font-bold tracking-wide hover:bg-mentawaiSage hover:text-white transition shadow-sm border border-transparent hover:border-mentawaiMint/30"
                        >
                            <i className="fa-solid fa-lock text-[10px]"></i> Portal
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;