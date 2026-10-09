import React, { useRef } from 'react';

// --- KOMPONEN KARTU PAKET ULTRA-PREMIUM ---
export const PackageCard = ({ pkg }) => {
    // Handling tag fitur agar selalu rapi


    return (
        <div className="w-[310px] sm:w-[350px] md:w-[370px] shrink-0 bg-white rounded-[28px] p-3 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(11,58,43,0.12)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between group">
            
            {/* 1. KONTEN FOTO & OVERLAY */}
            <div className="relative h-64 w-full rounded-[22px] overflow-hidden">
                <img 
                    src={pkg.gambar || 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=800&q=80'} 
                    alt={pkg.nama_paket} 
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
                />
                
                {/* Gradient Darkness Bottom Overlay (Bikin teks/badge makin terbaca) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

                {/* Badge Kategori - Frosted Glass (Top Left) */}
                <div className="absolute top-3.5 left-3.5 bg-black/40 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-lg">
                    {pkg.kategori || 'EXPEDITION'}
                </div>

                {/* Badge Durasi - Glassmorphism Badge (Bottom Right) */}
                <div className="absolute bottom-3.5 right-3.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    <i className="fa-regular fa-clock text-xs text-emerald-300"></i>
                    <span>{pkg.durasi || '5 Days / 4 Nights'}</span>
                </div>
            </div>

            {/* 2. KONTEN TEKS & DETAIL */}
            <div className="p-5 flex flex-col flex-grow justify-between gap-5">
                <div>
                    {/* Judul Paket */}
                    <h3 className="font-extrabold text-slate-900 text-xl leading-tight tracking-tight group-hover:text-[#0B3A2B] transition-colors line-clamp-2">
                        {pkg.nama_paket}
                    </h3>
                    
                    {/* Deskripsi Singkat */}
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-2.5 font-normal line-clamp-2">
                        {pkg.deskripsi_singkat || 'Nikmati pengalaman penjelajahan eksklusif dengan fasilitas terbaik dan keindahan alam autentik.'}
                    </p>

                   
                </div>

                {/* 3. FOOTER HARGA & CTA BUTTON */}
                <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">
                            STARTING FROM
                        </span>
                        <div className="text-slate-900 font-extrabold text-xl tracking-tight">
                            {pkg.harga > 0 ? (
                                <>
                                    Rp {pkg.harga.toLocaleString('id-ID')}
                                    <span className="text-xs font-medium text-slate-400"> /pax</span>
                                </>
                            ) : (
                                <span className="text-base font-bold text-[#0B3A2B]">Ask Price</span>
                            )}
                        </div>
                    </div>

                    {/* Tombol Book Now Luxury */}
                    <a 
                        href={`/detail?id=${pkg.id_paket}`} 
                        className="group/btn relative inline-flex items-center gap-2 bg-[#0B3A2B] hover:bg-[#07261C] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-[#0B3A2B]/20 transition-all duration-300 active:scale-95"
                    >
                        <span>Book Now</span>
                        <i className="fa-solid fa-arrow-right text-[11px] transform group-hover/btn:translate-x-1 transition-transform duration-300"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN UTAMA KATALOG SECTION ---
const KatalogSection = ({ packages = [], loading = false }) => {
    const sliderRef = useRef(null);

    // Fungsi Penggeser Kartu
    const handleScroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 390;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="packages" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
            {/* Header Section dengan Navigasi Panah */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3A27]">
                        Featured Mentawai Packages
                    </h2>
                </div>

    
            </div>

            {/* Content Slider Kartu */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <i className="fa-solid fa-compass fa-spin text-4xl text-[#0B3A2B] mb-3"></i>
                    <p className="text-slate-500 font-semibold text-sm animate-pulse">
                        Memuat paket eksklusif...
                    </p>
                </div>
            ) : packages.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[30px] border border-slate-100">
                    <p className="text-slate-400 font-medium">
                        Belum ada paket wisata yang tersedia.
                    </p>
                </div>
            ) : (
                <div 
                    ref={sliderRef}
                    className="flex gap-7 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
                >
                    {packages.map((pkg) => (
                        <div key={pkg.id_paket || pkg.id} className="snap-start">
                            <PackageCard pkg={pkg} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default KatalogSection;