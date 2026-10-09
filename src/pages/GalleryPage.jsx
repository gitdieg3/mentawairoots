import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';

const GalleryPage = () => {
    const [mediaData, setMediaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [lightbox, setLightbox] = useState({ isOpen: false, item: null });

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('media_kegiatan')
                    .select('*')
                    .order('id', { ascending: false });

                if (error) {
                    console.error("Error fetching media:", error.message);
                } else if (data) {
                    setMediaData(data);
                }
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    const safeData = useMemo(() => {
        if (!Array.isArray(mediaData)) return [];
        return mediaData.map((item) => {
            const rawType = (item.tipe || 'photo').toLowerCase();
            const normalizedType = rawType.includes('video') ? 'video' : 'photo';
            
            return {
                ...item,
                id: item.id || Math.random(),
                url: item.url_media || '',
                title: item.judul || '',
                desc: item.deskripsi || '',
                category: item.subjudul || 'General',
                type: normalizedType
            };
        });
    }, [mediaData]);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(safeData.map(item => item.category).filter(Boolean)));
        return ['Semua', ...unique];
    }, [safeData]);

    const filteredMedia = useMemo(() => {
        return safeData.filter((item) => {
            const matchesTab = activeTab === 'all' || item.type === activeTab;
            const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
            return matchesTab && matchesCategory;
        });
    }, [safeData, activeTab, selectedCategory]);

    const openLightbox = (item) => {
        setLightbox({ isOpen: true, item });
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightbox({ isOpen: false, item: null });
        document.body.style.overflow = 'auto';
    };

    return (
        <main className="min-h-screen bg-[#FAF8F5] font-sans text-slate-900 pt-28 pb-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
            
            <header className="mb-10 border-b border-mentawaiDark/10 pb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-mentawaiDark uppercase">
                            Gallery & Visuals
                        </h1>
                        <p className="text-sm text-slate-500 mt-2 tracking-wide">
                            Archive of events, documentation, and creative showcase.
                        </p>
                    </div>

                    <nav className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase border-b border-transparent">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-1.5 transition-all ${
                                activeTab === 'all'
                                    ? 'text-mentawaiDark border-b-2 border-mentawaiDark'
                                    : 'text-slate-400 hover:text-mentawaiSage'
                            }`}
                        >
                            All ({safeData.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('photo')}
                            className={`pb-1.5 transition-all ${
                                activeTab === 'photo'
                                    ? 'text-mentawaiDark border-b-2 border-mentawaiDark'
                                    : 'text-slate-400 hover:text-mentawaiSage'
                            }`}
                        >
                            Photos ({safeData.filter(i => i.type === 'photo').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`pb-1.5 transition-all ${
                                activeTab === 'video'
                                    ? 'text-mentawaiDark border-b-2 border-mentawaiDark'
                                    : 'text-slate-400 hover:text-mentawaiSage'
                            }`}
                        >
                            Videos ({safeData.filter(i => i.type === 'video').length})
                        </button>
                    </nav>
                </div>

                {/* AREA FILTER YANG DIPERBAIKI */}
                {categories.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-2 no-scrollbar [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap mr-2">
                            Filter:
                        </span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 font-bold text-[11px] uppercase tracking-wider transition-all duration-300 rounded-md border ${
                                    selectedCategory === cat
                                        ? 'bg-mentawaiDark text-mentawaiGold border-mentawaiDark shadow-sm'
                                        : 'bg-transparent text-slate-500 border-slate-200 hover:border-mentawaiSage hover:text-mentawaiDark'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            {loading ? (
                <div className="py-24 text-center text-mentawaiDark">
                    <i className="fa-solid fa-compass fa-spin text-3xl mb-3 text-mentawaiMint"></i>
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
                        Loading Media Gallery...
                    </p>
                </div>
            ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    {filteredMedia.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => openLightbox(item)}
                            className="group relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer rounded-xl border border-mentawaiDark/5 shadow-sm"
                        >
                            {item.type === 'photo' ? (
                                <img
                                    src={item.url}
                                    alt={item.title || "Gallery Item"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full relative bg-mentawaiDark">
                                    <video
                                        src={item.url}
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                                        muted
                                        playsInline
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-mentawaiMint text-mentawaiDark flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                                            <i className="fa-solid fa-play ml-1"></i>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                                {item.title && (
                                    <p className="text-sm font-bold tracking-wide truncate">
                                        {item.title}
                                    </p>
                                )}
                                {item.category && item.category !== 'General' && (
                                    <span className="text-[10px] text-mentawaiMint uppercase tracking-widest mt-1">
                                        {item.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-white rounded-xl border border-dashed border-mentawaiDark/20 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        No Media Found
                    </p>
                </div>
            )}

            {lightbox.isOpen && lightbox.item && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/50 hover:text-mentawaiMint text-3xl w-10 h-10 flex items-center justify-center transition z-50"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <div className="max-w-5xl w-full text-center flex flex-col items-center">
                        {lightbox.item.type === 'photo' ? (
                            <img
                                src={lightbox.item.url}
                                alt={lightbox.item.title}
                                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                            />
                        ) : (
                            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10">
                                <video
                                    src={lightbox.item.url}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                ></video>
                            </div>
                        )}

                        {lightbox.item.title && (
                            <h3 className="text-xl font-serif font-bold text-white mt-6 tracking-wide">
                                {lightbox.item.title}
                            </h3>
                        )}
                        {lightbox.item.desc && (
                            <p className="text-sm text-white/70 max-w-2xl mt-2 font-normal leading-relaxed">
                                {lightbox.item.desc}
                            </p>
                        )}
                    </div>
                </div>
            )}

        </main>
    );
};

export default GalleryPage;