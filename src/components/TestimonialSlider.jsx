import React, { useEffect, useRef } from 'react';

const TestimonialSlider = ({ testimonials, loading }) => {
    const sliderRef = useRef(null);

    // Bantuan Ambil Inisial
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        let initials = parts[0][0];
        if (parts.length > 1) {
            initials += parts[parts.length - 1][0];
        }
        return initials.toUpperCase();
    };

    // Auto Scroll Halus
    useEffect(() => {
        if (!testimonials || testimonials.length <= 1) return;

        const interval = setInterval(() => {
            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
                const isEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;

                if (isEnd) {
                    sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const cardWidth = sliderRef.current.children[0].clientWidth;
                    sliderRef.current.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
                }
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [testimonials]);

    return (
        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section (Simpel & Minimalis) */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-3">
                        Traveler Stories
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
                        Real experiences from adventurers who explored Mentawai with us
                    </p>
                </div>

                {/* Slider / Grid Container */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <i className="fa-solid fa-spinner fa-spin text-2xl text-slate-800 mb-3"></i>
                        <p className="text-slate-500 text-xs tracking-wider uppercase font-medium">Loading stories...</p>
                    </div>
                ) : !testimonials || testimonials.length === 0 ? (
                    <div className="text-center text-slate-400 py-12 text-sm">
                        No traveler stories available yet.
                    </div>
                ) : (
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto gap-5 pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                    >
                        {testimonials.map((testi) => {
                            const ratingCount = (parseInt(testi.rating) || 5).toFixed(1);

                            return (
                                <div
                                    key={testi.id}
                                    className="w-[280px] sm:w-[320px] md:w-[340px] flex-none snap-start bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                                >
                                    {/* Bagian Foto / Image Container */}
                                    <div className="relative h-48 sm:h-52 w-full bg-slate-200 overflow-hidden">
                                        {testi.foto ? (
                                            <img
                                                src={testi.foto}
                                                alt={testi.nama}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 text-white flex items-center justify-center font-bold text-2xl">
                                                {getInitials(testi.nama)}
                                            </div>
                                        )}

                                        {/* Rating Badge (Pojok Kanan Atas Transparan seperti di foto referensi) */}
                                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <span>{ratingCount}</span>
                                            <i className="fa-solid fa-star text-yellow-400 text-[10px]"></i>
                                        </div>
                                    </div>

                                    {/* Bagian Konten & Info User */}
                                    <div className="p-5 flex flex-col flex-grow justify-between bg-white">
                                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
                                            "{testi.ulasan}"
                                        </p>

                                        {/* Footer Card: Nama User & Tombol Panah Lingkaran Hitam */}
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm leading-snug truncate max-w-[180px]">
                                                    {testi.nama}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 font-medium">
                                                    {testi.asal || 'Traveler'}
                                                </p>
                                            </div>

                                            {/* Circular Arrow Button (Sama persis seperti referensi) */}
                                            <a 
                                                href="/reviews"
                                                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-700 transition-colors shadow-sm"
                                            >
                                                <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tombol Outlined "See all" (Seperti di contoh referensi) */}
                <div className="mt-8 text-center">
                    <a
                        href="/reviews"
                        className="inline-block px-7 py-2.5 rounded-full border border-slate-300 text-slate-800 hover:border-slate-900 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                    >
                        See all
                    </a>
                </div>

            </div>
        </section>
    );
};

export default TestimonialSlider;