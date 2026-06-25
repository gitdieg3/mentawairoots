import React, { useState } from 'react';

const MediaGallery = ({ mediaData }) => {
    const [activeTab, setActiveTab] = useState('photos');
    const [lightbox, setLightbox] = useState({ isOpen: false, type: 'photo', src: '', title: '', caption: '' });

    // Filter data berdasarkan tipe
    const photos = mediaData.filter(item => item.tipe === 'photo');
    const videos = mediaData.filter(item => item.tipe === 'video');

    const handleOpenPhoto = (src, caption) => {
        setLightbox({ isOpen: true, type: 'photo', src, caption, title: '' });
        document.body.style.overflow = 'hidden';
    };

    const handleOpenVideo = (src, title, caption) => {
        setLightbox({ isOpen: true, type: 'video', title, caption, src });
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightbox({ ...lightbox, isOpen: false });
        document.body.style.overflow = 'auto';
    };

    return (
        <section id="media-gallery" className="bg-[#103D2E] text-white py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80')" }}></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Live the Experience</p>
                    <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4 text-white">Activity Documentation & Media</h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">Take a closer look at the actual journey. Click the tabs below to see original photos or cinematic video footage of our adventures.</p>

                    <div className="flex justify-center mt-10 gap-3">
                        <button onClick={() => setActiveTab('photos')} className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center gap-2 ${activeTab === 'photos' ? 'bg-mentawaiMint text-mentawaiDark shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            <i className="fa-solid fa-images text-sm"></i> Activity Photos ({photos.length})
                        </button>
                        <button onClick={() => setActiveTab('videos')} className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center gap-2 ${activeTab === 'videos' ? 'bg-mentawaiMint text-mentawaiDark shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            <i className="fa-solid fa-circle-play text-sm"></i> Cinematic Video ({videos.length})
                        </button>
                    </div>
                </div>

                {activeTab === 'photos' && (
                    <div className="animate-fade-in">
                        {photos.length === 0 ? (
                            <p className="text-center text-white/50 py-10">No documentation photos have been uploaded yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md cursor-zoom-in border border-white/10" onClick={() => handleOpenPhoto(photo.url_media, photo.deskripsi)}>
                                        <img src={photo.url_media} alt={photo.judul} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{photo.judul}</h4>
                                                <p className="text-[10px] text-mentawaiMint">{photo.subjudul}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="animate-fade-in">
                        {videos.length === 0 ? (
                            <p className="text-center text-white/50 py-10">No documentation photos have been uploaded yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {videos.map((video) => (
                                    <div key={video.id} className="bg-mentawaiDark/40 border border-white/10 rounded-3xl p-4 flex flex-col justify-between">
                                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center group">
                                            {/* Pakai tag video untuk jadi thumbnail bg yang nge-loop, atau gambar biasa */}
                                            <video src={video.url_media} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" muted loop playsInline></video>
                                            <div className="relative z-10 w-20 h-20 bg-mentawaiMint text-mentawaiDark rounded-full flex items-center justify-center text-3xl cursor-pointer group-hover:bg-white group-hover:scale-110 transition duration-300 shadow-xl" onClick={() => handleOpenVideo(video.url_media, video.judul, video.deskripsi)}>
                                                <i className="fa-solid fa-play ml-1"></i>
                                            </div>
                                        </div>
                                        <div className="mt-4 px-2">
                                            <h3 className="font-serif text-xl font-bold mb-1">{video.judul}</h3>
                                            <p className="text-[10px] text-mentawaiMint uppercase tracking-widest mb-2">{video.subjudul}</p>
                                            <p className="text-sm text-white/60">{video.deskripsi}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* LIGHTBOX MODAL */}
            {lightbox.isOpen && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6 transition-all duration-300">
                    <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-3xl hover:text-mentawaiMint transition z-50">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="max-w-4xl w-full text-center flex flex-col justify-center items-center relative">
                        {lightbox.type === 'photo' ? (
                            <img src={lightbox.src} className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10" alt="Enlarged" />
                        ) : (
                            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative border border-white/10 shadow-2xl">
                                <video src={lightbox.src} controls autoPlay className="w-full h-full object-contain"></video>
                            </div>
                        )}
                        {lightbox.title && <h3 className="text-2xl font-serif text-white font-bold mt-6 mb-1">{lightbox.title}</h3>}
                        <p className="text-white/80 font-medium mt-3 text-sm md:text-base">{lightbox.caption}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MediaGallery;