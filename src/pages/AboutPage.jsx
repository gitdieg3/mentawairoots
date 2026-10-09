import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <main className="bg-[#FAF8F5] min-h-screen font-sans text-slate-800">
            
            {/* Hero Section */}
            <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <img 
                    src="/asset/mentawai.webp" 
                    alt="Siberut Jungle" 
                    className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-mentawaiDark/60"></div>
                <div className="relative z-10 text-center px-6 mt-16">
                    <p className="text-mentawaiMint text-xs font-bold uppercase tracking-widest mb-4">Discover the Truth</p>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#FAF8F5] tracking-tight">The Heart of Siberut</h1>
                </div>
            </section>

            {/* Chapter 1: The Land (Center Aligned) */}
            <section className="py-24 px-6 max-w-3xl mx-auto text-center">
                <h2 className="text-sm font-bold text-mentawaiSage uppercase tracking-widest mb-6">Chapter I: The Land</h2>
                <p className="text-xl md:text-2xl text-mentawaiDark font-serif italic leading-relaxed mb-8">
                    "Separated from mainland Sumatra by deep oceanic trenches, the Mentawai archipelago remained an isolated sanctuary for thousands of years."
                </p>
                <p className="text-slate-600 font-light leading-loose text-sm md:text-base">
                    This geographical isolation gave birth to one of the most pristine and biodiverse ecosystems in the world. Dense, ancient rainforests cover the island of Siberut, serving as the lungs of the archipelago and the provider of life. Beyond the jungle, world-class swells crash onto untouched coral reefs, drawing surfers who seek the ultimate oceanic pilgrimage. But the true magic of this land lies deep within the canopy.
                </p>
            </section>

            {/* Chapter 2: The People (Alternating Layout) */}
            <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-mentawaiSage uppercase tracking-widest">Chapter II: The People</h2>
                </div>

                {/* Block 1: Text Left, Image Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 lg:order-1">
                        <h3 className="text-3xl font-serif font-bold text-mentawaiDark mb-6">Guardians of Arat Sabulungan</h3>
                        <p className="text-slate-600 font-light leading-loose mb-6">
                            For the indigenous Mentawai people, the jungle is not just a habitat; it is a sacred space alive with spirits. Their traditional belief system, Arat Sabulungan, teaches profound respect for nature. Every tree cut and every animal hunted requires a ritual to appease its spirit.
                        </p>
                        <p className="text-slate-600 font-light leading-loose">
                            The Sikerei (shamans) act as healers and mediators between the human and spiritual worlds. Their bodies, adorned with the oldest tattoo art in the world, map their connection to the forest, their ancestors, and their life's journey.
                        </p>
                    </div>
                    <div className="order-1 lg:order-2 aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        <img 
                            src="/asset/penjaga adat.webp" 
                            alt="Sikerei Shaman" 
                            loading="lazy"
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>

                {/* Block 2: Image Left, Text Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        <img 
                            src="/asset/rumh.webp" 
                            alt="Mentawai Uma Daily Life" 
                            loading="lazy"
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div>
                        <h3 className="text-3xl font-serif font-bold text-mentawaiDark mb-6">Living in the Uma</h3>
                        <p className="text-slate-600 font-light leading-loose">
                            The Uma, a large traditional wooden longhouse, is the center of Mentawai communal life. Built without a single nail, it houses multiple families and serves as the gathering place for ceremonies. When you travel with Mentawai Roots, you don't just visit; you live within the Uma, eating sago, sharing stories by the fire, and becoming part of the community's daily rhythm.
                        </p>
                    </div>
                </div>
            </section>

            {/* Chapter 3: The Vision (Solid Dark Background) */}
            <section className="bg-mentawaiDark py-24 px-6 text-[#FAF8F5]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 relative">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                            <img 
                                src="/asset/Ucok.webp" 
                                alt="Mentawai Local Guide" 
                                loading="lazy"
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-7 lg:pl-10">
                        <h2 className="text-sm font-bold text-mentawaiMint uppercase tracking-widest mb-6">Chapter III: Our Mission</h2>
                        <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">Empowering Locals Through Ethical Travel.</h3>
                        <p className="text-white/70 font-light leading-loose mb-6">
                            Mentawai Roots was founded on a simple premise: tourism should regenerate, not exploit. For decades, standard tourism models often sidelined the very people whose culture was being showcased. We aim to change that narrative.
                        </p>
                        <p className="text-white/70 font-light leading-loose mb-10">
                            100% of our expeditions are led by native Mentawai guides. We guarantee fair pay, direct community investment, and strict ethical guidelines for all our travelers. By choosing us, you are directly contributing to the preservation of the Mentawai heritage and the protection of their ancestral lands.
                        </p>
                        <button 
                            onClick={() => navigate('/katalog')} 
                            className="bg-mentawaiMint hover:bg-white text-mentawaiDark text-xs font-bold px-6 py-3.5 rounded-lg shadow-md transition uppercase tracking-wider"
                        >
                            Join Our Expedition
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;