import React, { useState, useEffect, useRef } from 'react';

const TestimonialSlider = ({ testimonials, loading }) => {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const sliderRef = useRef(null);

    // Fungsi bantuan untuk mengambil inisial nama jika foto kosong
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        let initials = parts[0][0];
        if (parts.length > 1) {
            initials += parts[parts.length - 1][0];
        }
        return initials.toUpperCase();
    };

    // Fungsi menentukan kategori dari isi ulasan
    const getTripCategory = (text) => {
        const lowerText = (text || '').toLowerCase();
        if (lowerText.includes('ombak') || lowerText.includes('surf')) {
            return { id: 'SURF', label: 'SURF CAMP', color: 'bg-blue-50 text-blue-600' };
        }
        return { id: 'CULTURAL', label: 'CULTURAL TRIP', color: 'bg-mentawaiMint/15 text-mentawaiSage' };
    };

    // --- LOGIKA PERHITUNGAN METRIK RATING ---
    const totalReviews = testimonials.length;

    const averageRating = totalReviews > 0
        ? (testimonials.reduce((acc, curr) => acc + (parseInt(curr.rating) || 5), 0) / totalReviews).toFixed(1)
        : "0.0";

    const ratingCounts = { 5: 0, 4: 0, 3: 0 };
    testimonials.forEach(testi => {
        const r = parseInt(testi.rating) || 5;
        if (r >= 5) ratingCounts[5]++;
        else if (r === 4) ratingCounts[4]++;
        else ratingCounts[3]++;
    });

    const getPercentage = (count) => totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

    // --- LOGIKA FILTER DATA ---
    const filteredTestimonials = testimonials.filter(testi => {
        if (activeFilter === 'ALL') return true;
        const cat = getTripCategory(testi.ulasan).id;
        return cat === activeFilter;
    });

    // --- LOGIKA AUTO SLIDER ---
    useEffect(() => {
        if (filteredTestimonials.length <= 1) return;

        const interval = setInterval(() => {
            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

                const isEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;

                if (isEnd) {
                    sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const cardWidth = sliderRef.current.children[0].clientWidth;
                    sliderRef.current.scrollBy({ left: cardWidth + 32, behavior: 'smooth' });
                }
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [filteredTestimonials.length, activeFilter]);

    return (
        <section className="py-24 px-6 bg-[#FAF8F5] relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-mentawaiDark mb-6">
                        Testimoni
                    </h1>
                </div>

                {/* 1. KOTAK METRIK RATING (DASHBOARD ATAS) */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-mentawaiDark/5 mb-12 flex flex-col md:flex-row items-center gap-12">
                    <div className="text-center md:w-1/3 md:border-r border-gray-100 md:pr-12">
                        <h2 className="text-6xl font-serif font-black text-mentawaiDark mb-2">{averageRating}</h2>

                        <div className="flex justify-center text-mentawaiGold text-xl gap-1 mb-2">
                            {[...Array(Math.floor(parseFloat(averageRating) || 0))].map((_, i) => (
                                <i key={`full-${i}`} className="fa-solid fa-star"></i>
                            ))}
                            {(parseFloat(averageRating) || 0) % 1 >= 0.5 && (
                                <i className="fa-solid fa-star-half-stroke"></i>
                            )}
                            {[...Array(5 - Math.floor(parseFloat(averageRating) || 0) - ((parseFloat(averageRating) || 0) % 1 >= 0.5 ? 1 : 0))].map((_, i) => (
                                <i key={`empty-${i}`} className="fa-regular fa-star"></i>
                            ))}
                        </div>

                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Average Rating ({totalReviews} Reviews)
                        </p>
                    </div>

                    <div className="md:w-2/3 w-full flex flex-col gap-4">
                        <p className="text-xs font-bold text-mentawaiDark uppercase tracking-widest mb-1">Traveler Satisfaction Metrics</p>
                        {[5, 4, 3].map((star) => (
                            <div key={star} className="flex items-center gap-4">
                                <div className="text-xs text-gray-500 w-16 text-right leading-tight">
                                    <span className="font-bold">{star}</span><br /><span className="text-[9px]">star</span>
                                </div>
                                <div className="flex-grow h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-mentawaiMint rounded-full transition-all duration-1000"
                                        style={{ width: `${getPercentage(ratingCounts[star])}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 w-10 text-right">
                                    {getPercentage(ratingCounts[star])}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mb-12">
                    <a
                        href="/reviews"
                        className="bg-mentawaiDark hover:bg-mentawaiSage text-mentawaiMint hover:text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-mentawaiDark/20 hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        READ ALL REVIEWS <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

                {/* 3. DAFTAR KARTU TESTIMONI (AUTO SLIDER) */}
                {loading ? (
                    <div className="flex justify-center items-center py-10 text-mentawaiMint font-bold animate-pulse">Memuat cerita petualang...</div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">Belum ada ulasan untuk kategori ini.</div>
                ) : (
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {filteredTestimonials.map((testi) => {
                            const category = getTripCategory(testi.ulasan);
                            const ratingCount = parseInt(testi.rating) || 5;

                            return (
                                <div
                                    key={testi.id}
                                    className="w-[85vw] md:w-[45vw] lg:w-[30vw] flex-none snap-center bg-white p-8 rounded-3xl border border-mentawaiDark/5 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex text-mentawaiGold text-xs gap-1">
                                                {[...Array(ratingCount)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                                                {[...Array(5 - ratingCount)].map((_, i) => <i key={i + ratingCount} className="fa-regular fa-star"></i>)}
                                            </div>
                                            <span className={`${category.color} text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded`}>
                                                {category.label}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 font-light leading-relaxed text-sm italic mb-8">"{testi.ulasan}"</p>
                                    </div>
                                    
                                    {/* SEKTOR AVATAR DAN IDENTITAS YANG SUDAH DIPERBAIKI */}
                                    <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
                                        {testi.foto ? (
                                            <img 
                                                src={testi.foto} 
                                                alt={testi.nama} 
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-slate-100 shadow-inner"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#0B2B20] text-mentawaiMint flex items-center justify-center font-serif font-bold text-lg shadow-inner flex-shrink-0">
                                                {getInitials(testi.nama)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm truncate w-32 md:w-48">{testi.nama}</h4>
                                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{testi.asal}</span>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TestimonialSlider;