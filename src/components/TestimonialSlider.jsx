import React, { useState, useEffect } from 'react';

const TestimonialSlider = ({ testimonials, loading }) => {
    const [testiPage, setTestiPage] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    // Deteksi ukuran layar otomatis
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsPerView(3);
            else if (window.innerWidth >= 768) setItemsPerView(2);
            else setItemsPerView(1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalTestiPages = Math.ceil(testimonials.length / itemsPerView);

    // Auto-Slide Otomatis setiap 5 Detik
    useEffect(() => {
        if (totalTestiPages <= 1) return;
        const interval = setInterval(() => {
            setTestiPage((prev) => (prev >= totalTestiPages - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [totalTestiPages]);

    return (
        <section id="testimoni" className="py-24 px-6 bg-[#0B2B20] text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Authentic Voices</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-white font-semibold">What Our Travelers Say</h2>
                    <div className="w-16 h-1 bg-mentawaiMint mx-auto mt-6 rounded-full"></div>
                </div>

                {loading ? (
                    <div className="text-center text-mentawaiMint font-bold animate-pulse">
                        Memuat Ulasan Pelancong...
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center text-white/50">
                        Belum ada ulasan yang ditampilkan. Jadilah yang pertama memberikan ulasan!
                    </div>
                ) : (
                    <div className="relative w-full">
                        {/* Track Slider */}
                        <div className="overflow-hidden w-full -mx-4 px-4">
                            <div
                                className="flex transition-transform duration-1000 ease-in-out"
                                style={{ transform: `translateX(-${testiPage * 100}%)` }}
                            >
                                {testimonials.map((testi) => (
                                    <div key={testi.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-4">
                                        <div className="bg-white/[0.03] backdrop-blur-md p-8 rounded-3xl border border-white/5 relative hover:-translate-y-2 transition duration-300 h-full flex flex-col group">
                                            <i className="fa-solid fa-quote-right text-5xl text-mentawaiMint absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity"></i>
                                            <div className="flex text-mentawaiMint text-xs mb-6 gap-1">
                                                {[...Array(parseInt(testi.rating) || 5)].map((_, i) => (
                                                    <i key={i} className="fa-solid fa-star"></i>
                                                ))}
                                            </div>
                                            <p className="text-white/80 italic mb-8 leading-relaxed text-sm flex-grow">"{testi.ulasan}"</p>
                                            <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                                                <img
                                                    src={testi.foto || `https://ui-avatars.com/api/?name=${testi.nama.replace(' ', '+')}&background=59C394&color=0B2B20`}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-mentawaiMint"
                                                    alt="Reviewer"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{testi.nama}</h4>
                                                    <span className="text-xs text-white/40">{testi.asal}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigasi Titik (Dots) di Bawah Slider */}
                        {totalTestiPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-12">
                                {[...Array(totalTestiPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setTestiPage(i)}
                                        className={`transition-all duration-500 rounded-full ${testiPage === i ? 'w-8 h-2.5 bg-mentawaiMint shadow-[0_0_10px_rgba(89,195,148,0.5)]' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'}`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    ></button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TestimonialSlider;