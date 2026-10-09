import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
    const navigate = useNavigate();

    return (
        <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-[#FAF8F5]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Visual Section: Overlapping Images */}
                <div className="order-2 lg:order-1 relative">
                    <div className="aspect-[4/5] w-4/5 rounded-2xl overflow-hidden shadow-xl ml-auto border border-mentawaiDark/5">
                        <img 
                            src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=800&q=80" 
                            alt="Mentawai Deep Jungle" 
                            loading="lazy"
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    {/* Floating Secondary Image */}
                    <div className="absolute bottom-10 left-0 w-2/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FAF8F5]">
                        <img 
                            src="/asset/favicon.webp" 
                            alt="Mentawai Sikerei" 
                            loading="lazy"
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div className="order-1 lg:order-2">
                    <p className="text-[10px] font-bold text-mentawaiSage uppercase tracking-widest mb-4 border-l-2 border-mentawaiMint pl-3">
                        Our Roots
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-mentawaiDark mb-6 leading-tight">
                        More Than Just <br className="hidden md:block" /> a Journey.
                    </h2>
                    <p className="text-slate-600 font-light leading-relaxed mb-6 text-sm md:text-base">
                        Mentawai Roots is not a conventional travel agency. We are a bridge connecting passionate travelers directly with the indigenous communities of Siberut. 
                    </p>
                    <p className="text-slate-600 font-light leading-relaxed mb-10 text-sm md:text-base">
                        Born from a deep respect for the Arat Sabulungan traditions and the raw beauty of the islands, we curate regenerative expeditions that prioritize cultural preservation, fair trade, and authentic human connection.
                    </p>
                    <button 
                        onClick={() => navigate('/about')} 
                        className="group flex items-center gap-3 text-mentawaiDark font-bold text-xs uppercase tracking-wider hover:text-mentawaiSage transition"
                    >
                        <span className="border-b-2 border-mentawaiDark group-hover:border-mentawaiSage pb-1 transition">
                            Read Our Full Story
                        </span>
                        <i className="fa-solid fa-arrow-right transform group-hover:translate-x-2 transition"></i>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;