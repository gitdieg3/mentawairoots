import React, { useRef } from 'react';

const TestimonialSlider = ({ testimonials = [], loading = false }) => {
    const sliderRef = useRef(null);

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    };

    const totalReviews = testimonials.length;
    const averageRating = totalReviews > 0
        ? (testimonials.reduce((acc, curr) => acc + (parseInt(curr.rating) || 5), 0) / totalReviews).toFixed(1)
        : "5.0";

    const handleScroll = (direction) => {
        if (sliderRef.current) {
            const cardWidth = 310;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -cardWidth : cardWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-12 px-4 sm:px-8 bg-[#F5F5F7] font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">
                        Inspiring Client Experiences
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500">
                        Join us and become our next success story
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12 text-slate-400 text-xs font-medium animate-pulse">
                        Memuat testimoni...
                    </div>
                ) : (
                    <>
                        <div
                            ref={sliderRef}
                            className="flex gap-5 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden items-stretch"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {/* Kartu Kuning Rating (Ukuran Terkunci) */}
                            <div className="w-[260px] sm:w-[290px] h-[320px] shrink-0 snap-start bg-[#FFDE31] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex text-slate-900 text-sm gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fa-solid fa-star"></i>
                                        ))}
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                        {averageRating} Rating
                                    </h3>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2.5 overflow-hidden">
                                        {testimonials.slice(0, 3).map((testi, idx) => (
                                            testi.foto ? (
                                                <img
                                                    key={idx}
                                                    src={testi.foto}
                                                    alt={testi.nama}
                                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#FFDE31] object-cover"
                                                />
                                            ) : (
                                                <div
                                                    key={idx}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-[10px] ring-2 ring-[#FFDE31]"
                                                >
                                                    {getInitials(testi.nama)}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <div>
                                        <span className="block font-extrabold text-xs text-slate-900 leading-none mb-0.5">
                                            {totalReviews > 0 ? `${totalReviews}k+` : '27k+'}
                                        </span>
                                        <span className="block text-[10px] font-medium text-slate-800">
                                            Trusted User
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Kartu Ulasan Putih (Ukuran Terkunci + Line Clamp) */}
                            {testimonials.map((testi) => (
                                <div
                                    key={testi.id || testi.id_ulasan}
                                    className="w-[260px] sm:w-[290px] h-[320px] shrink-0 snap-start bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-slate-100"
                                >
                                    <div className="overflow-hidden">
                                        <div className="text-[#FFDE31] text-2xl font-black leading-none mb-2 select-none">
                                            ““
                                        </div>
                                        <p className="text-slate-600 text-xs leading-relaxed font-normal line-clamp-6">
                                            {testi.ulasan}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-3 border-t border-slate-50 mt-2">
                                        {testi.foto ? (
                                            <img
                                                src={testi.foto}
                                                alt={testi.nama}
                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                                {getInitials(testi.nama)}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-900 text-xs truncate">
                                                {testi.nama}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 block truncate">
                                                {testi.asal || 'Verified Client'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tombol Navigasi Panah */}
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                onClick={() => handleScroll('left')}
                                className="w-8 h-8 rounded-full bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200 flex items-center justify-center transition hover:bg-slate-50"
                                aria-label="Previous"
                            >
                                <i className="fa-solid fa-chevron-left text-[10px]"></i>
                            </button>
                            <button
                                onClick={() => handleScroll('right')}
                                className="w-8 h-8 rounded-full bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200 flex items-center justify-center transition hover:bg-slate-50"
                                aria-label="Next"
                            >
                                <i className="fa-solid fa-chevron-right text-[10px]"></i>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default TestimonialSlider;