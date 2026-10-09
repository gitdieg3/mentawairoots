import React, { useState } from 'react';
import { useGlobal } from '../GlobalContext';

const HeroMentawaiRoots = () => {
    const { settings } = useGlobal();

    // State for the search form
    const [activeTab, setActiveTab] = useState('Cultural Exploration');
    const [duration, setDuration] = useState('All Durations');
    const [experience, setExperience] = useState('All Activities');

    const tabs = ['Cultural Exploration', 'Tribal Immersion', 'Surf & Nature', 'Ecotourism'];

    const handleSearchWA = (e) => {
        e.preventDefault();

        // Format Phone Number from Settings
        let phone = settings?.nomor_wa || '628126774808';
        phone = phone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);

        // Construct WhatsApp Message
        const message = `Hello Mentawai Roots!\n\nI am looking for an expedition package with the following details:\n\n` +
            `*Category:* ${activeTab}\n` +
            `*Duration:* ${duration}\n` +
            `*Experience:* ${experience}\n\n` +
            `Are there any schedules or recommended packages available for these criteria? Thank you!`;

        // Open WhatsApp Tab
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <section className="relative bg-[#FAF8F5] pt-12 pb-24 px-4 sm:px-8 lg:px-16 overflow-hidden">

            {/* 1. TEXT HEADER */}
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1C3A27] font-bold tracking-tight leading-tight">
                    Living in harmony with the Mentawai Tribe
                </h1>
                <p className="text-slate-600 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
                    Escape the ordinary. Immerse yourself in the deep jungle to discover ancient traditions, authentic tribal art, and the wild beauty of Mentawai alongside our expert local guides.
                </p>
                <div className="pt-2">
                    <a
                        href="/katalog"
                        className="inline-block bg-[#1C3A27] hover:bg-[#12271A] text-white text-xs font-bold px-7 py-3.5 rounded-full transition shadow-md uppercase tracking-wider"
                    >
                        Explore Expeditions
                    </a>
                </div>
            </div>

            {/* 2. HERO IMAGE BANNER */}
            <div className="max-w-5xl mx-auto h-[340px] sm:h-[420px] rounded-3xl overflow-hidden shadow-xl relative mb-12 border border-black/5">
                <img
                    src="/asset/banner.webp"
                    alt="Sikerei Mentawai Culture"
                    fetchpriority="high"
                    loading="eager"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* 3. FLOATING FILTER CARD */}
            <div className="max-w-4xl mx-auto -mt-24 relative z-20">
                <div className="bg-white rounded-[1.25rem] p-6 shadow-xl shadow-[#1C3A27]/5 border border-slate-100">

                    {/* Category Tabs */}
                    <div className="flex items-center gap-8 border-b border-slate-100 mb-6 overflow-x-auto hide-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm whitespace-nowrap transition-all duration-300 relative ${activeTab === tab
                                    ? 'text-[#1C3A27] font-bold'
                                    : 'text-slate-400 font-medium hover:text-slate-600'
                                    }`}
                            >
                                {tab}
                                {/* Active Tab Indicator */}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1C3A27] rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Filter Inputs Form */}
                    <form onSubmit={handleSearchWA} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

                        {/* Program Duration */}
                        <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-slate-200/80 relative group hover:border-[#1C3A27]/30 transition">
                            <label className="block text-[10px] font-bold text-[#7C8B9D] uppercase tracking-wider mb-1">
                                Program Duration
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                aria-label="Program Duration"
                                className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer"
                            >
                                <option value="All Durations">All Durations</option>
                                <option value="Short Trip (3D2N)">Short Trip (3D2N)</option>
                                <option value="Cultural Stay (5D4N)">Cultural Stay (5D4N)</option>
                                <option value="Deep Immersion (7D+)">Deep Immersion (7D+)</option>
                            </select>
                            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                        </div>

                        {/* Experience Type */}
                        <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-slate-200/80 relative group hover:border-[#1C3A27]/30 transition">
                            <label className="block text-[10px] font-bold text-[#7C8B9D] uppercase tracking-wider mb-1">
                                Experience Type
                            </label>
                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                aria-label="Experience Type"
                                className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer"
                            >
                                <option value="All Activities">All Activities</option>
                                <option value="Living in Sikerei Uma">Living in Sikerei Uma</option>
                                <option value="Tattoo & Traditional Crafts">Tattoo & Traditional Crafts</option>
                                <option value="Jungle Survival">Jungle Survival</option>
                            </select>
                            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                        </div>

                        {/* Filter Button */}
                        <button
                            type="submit"
                            className="bg-[#1C3A27] hover:bg-[#12271A] text-white w-full h-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2.5 active:scale-[0.98]"
                        >
                            <i className="fa-solid fa-compass"></i>
                            <span>Find Expedition</span>
                        </button>

                    </form>

                </div>
            </div>

        </section>
    );
};

export default HeroMentawaiRoots;