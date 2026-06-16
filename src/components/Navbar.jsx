import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 transition-all duration-300 border-b border-mentawaiDark/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            {/* Logo Brand */}
            <a href="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-mentawaiDark">
                <span className="font-serif italic font-bold">Mentawai</span>
                <span className="text-mentawaiSage font-sans font-light tracking-widest text-lg border-l border-mentawaiDark/20 pl-2">Hantage</span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-mentawaiDark/80">
                <a href="/#packages" className="hover:text-mentawaiMint transition duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mentawaiMint hover:after:w-full after:transition-all">Our Packages</a>
                <a href="/#media-gallery" className="hover:text-mentawaiMint transition duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mentawaiMint hover:after:w-full after:transition-all">Kegiatan & Media</a>
                <a href="/#about-us" className="hover:text-mentawaiMint transition duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mentawaiMint hover:after:w-full after:transition-all">Tentang Kami</a>
            </div>

            {/* Hubungi WA Action Button */}
            <div className="hidden md:block">
                <a href="https://wa.me/62895395002626" 
                   target="_blank" 
                   rel="noreferrer"
                   className="bg-mentawaiDark text-white hover:bg-mentawaiSage px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition duration-300 shadow-lg shadow-mentawaiDark/10 hover:shadow-xl hover:shadow-mentawaiSage/20 transform hover:-translate-y-0.5">
                    Hubungi WA
                </a>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;