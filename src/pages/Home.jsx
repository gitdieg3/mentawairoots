import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PackageCard from '../components/PackageCard';

const Home = () => {
    // ================= 1. STATE MANAGEMENT =================
    const [activeTab, setActiveTab] = useState('photos');
    const [lightbox, setLightbox] = useState({ isOpen: false, type: 'photo', src: '', title: '', caption: '' });

    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [testimonials, setTestimonials] = useState([]); // State baru untuk Testimoni
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    // ================= 2. FETCH DATA DARI SUPABASE =================
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Tarik data Paket, Kategori, dan Testimoni secara bersamaan!
                const [pkgRes, catRes, testiRes] = await Promise.all([
                    supabase.from('paket_wisata').select('*').order('id_paket', { ascending: false }),
                    supabase.from('kategori').select('*').order('id', { ascending: true }),
                    // Ambil 6 testimoni terbaru aja biar beranda nggak kepanjangan
                    supabase.from('testimoni').select('*').order('id', { ascending: false }).limit(6) 
                ]);

                if (pkgRes.error) throw pkgRes.error;
                if (catRes.error) throw catRes.error;
                if (testiRes.error) throw testiRes.error;

                setPackages(pkgRes.data || []);
                setCategories(catRes.data || []);
                setTestimonials(testiRes.data || []); // Simpan data testimoni ke state
            } catch (error) {
                console.error("Gagal menarik data Home:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // ================= 3. LOGIKA FILTER PAKET =================
    const filteredPackages = activeCategory === 'All'
        ? packages
        : packages.filter(pkg => pkg.kategori === activeCategory);

    // ================= 4. FUNGSI HELPER =================
    const kirimPesanWA = () => {
        let kategori = document.getElementById('wa_kategori').value;
        let tanggal = document.getElementById('wa_tanggal').value;
        let peserta = document.getElementById('wa_peserta').value;

        if (!tanggal) {
            alert('Pemberitahuan: Silakan tentukan tanggal keberangkatan yang Anda inginkan.');
            return;
        }

        let textPesan = `Halo Mentawai Hantage!\n\nSaya ingin berkonsultasi mengenai petualangan ekspedisi Mentawai dengan rincian berikut:\n` +
            `- *Kategori Adventure:* ${kategori}\n` +
            `- *Tanggal Keberangkatan:* ${tanggal}\n` +
            `- *Jumlah Peserta:* ${peserta}\n\n` +
            `Apakah kuota perjalanan untuk rute ini masih tersedia? Terima kasih!`;

        window.open(`https://wa.me/62895395002626?text=${encodeURIComponent(textPesan)}`, '_blank');
    };

    const handleOpenPhoto = (src, caption) => {
        setLightbox({ isOpen: true, type: 'photo', src, caption, title: '' });
        document.body.style.overflow = 'hidden';
    };

    const handleOpenVideo = (title) => {
        setLightbox({ isOpen: true, type: 'video', title, caption: 'Sinematik Mentawai Odyssey - Dokumentasi Petualang', src: '' });
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightbox({ ...lightbox, isOpen: false });
        document.body.style.overflow = 'auto';
    };

    // ================= 5. RENDER UI TAMPILAN =================
    return (
        <>
            {/* 1. HERO SECTION */}
            <section className="relative min-h-[92vh] flex flex-col justify-between items-center text-center pb-20 pt-16 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="../public/banner.jpeg" alt="Mentawai Jungle" className="w-full h-full object-cover object-center scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B20] via-[#0B2B20]/70 to-[#0B2B20]/45"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center items-center mt-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-down">
                        <span className="w-2 h-2 rounded-full bg-mentawaiMint animate-pulse"></span>
                        <span className="text-white text-xs font-bold uppercase tracking-widest">West Sumatra, Indonesia</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-[1.1] drop-shadow-sm font-light">
                        Where the Jungle <br /><span className="text-mentawaiMint italic font-medium">Meets the Wave.</span>
                    </h1>
                    <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Tinggalkan jalur turis biasa. Jelajahi keindahan liar, budaya asli suku pedalaman tato tertua, dan ombak magis kepulauan Mentawai bersama pemandu lokal kami.
                    </p>
                </div>

                <div className="relative z-20 w-full max-w-5xl mx-auto mt-6">
                    <div className="bg-[#103D2E]/90 backdrop-blur-lg p-5 md:p-4 rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-left focus-within:border-mentawaiMint focus-within:bg-white/10 transition">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Kategori Wisata</label>
                            <div className="relative">
                                {/* DROPDOWN DINAMIS */}
                                <select id="wa_kategori" className="w-full font-bold text-white outline-none bg-transparent appearance-none cursor-pointer pr-6">
                                    {categories.length === 0 ? (
                                        <option className="bg-mentawaiDark text-white">Memuat Kategori...</option>
                                    ) : (
                                        categories.map(kat => (
                                            <option key={kat.id} value={kat.nama} className="bg-mentawaiDark text-white">{kat.nama}</option>
                                        ))
                                    )}
                                </select>
                                <i className="fa-solid fa-chevron-down text-white/60 absolute right-1 top-1 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-left focus-within:border-mentawaiMint focus-within:bg-white/10 transition">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Keberangkatan</label>
                            <input type="date" id="wa_tanggal" className="w-full font-bold text-white outline-none bg-transparent cursor-pointer text-sm [color-scheme:dark]" />
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-left focus-within:border-mentawaiMint focus-within:bg-white/10 transition">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Jumlah Peserta</label>
                            <div className="relative">
                                <select id="wa_peserta" className="w-full font-bold text-white outline-none bg-transparent appearance-none cursor-pointer pr-6">
                                    <option value="1 - 3 Adventurers" className="bg-mentawaiDark text-white">1 - 3 Orang</option>
                                    <option value="4 - 7 Adventurers" className="bg-mentawaiDark text-white">4 - 7 Orang</option>
                                    <option value="Rombongan Besar (8+)" className="bg-mentawaiDark text-white">Rombongan (8+)</option>
                                </select>
                                <i className="fa-solid fa-chevron-down text-white/60 absolute right-1 top-1 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                        <button onClick={kirimPesanWA} className="bg-mentawaiMint hover:bg-[#47b283] text-mentawaiDark font-extrabold px-8 py-4 rounded-2xl transition duration-300 shadow-lg shadow-mentawaiMint/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer text-sm">
                            Explore Packages <i className="fa-solid fa-arrow-right text-xs"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. PACKAGES SECTION (DENGAN FILTER DINAMIS) */}
            <section id="packages" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Our Curated Adventures</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-mentawaiDark leading-tight">Choose Your <br />Adventure Level</h2>
                    </div>
                    <div>
                        <a href="#media-gallery" className="inline-flex items-center gap-2 border border-mentawaiDark/20 hover:border-mentawaiMint hover:bg-mentawaiMint/5 text-mentawaiDark hover:text-mentawaiMint px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300">
                            Lihat Galeri Dokumentasi <i className="fa-solid fa-photo-film"></i>
                        </a>
                    </div>
                </div>

                {/* TOMBOL FILTER */}
                <div className="flex flex-wrap gap-2.5 mb-12">
                    <button 
                        onClick={() => setActiveCategory('All')}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all ${activeCategory === 'All' ? 'bg-[#103D2E] text-[#FAF8F5]' : 'bg-white hover:bg-mentawaiDark/5 text-mentawaiDark/80 border border-mentawaiDark/10'}`}
                    >
                        All Expeditions
                    </button>
                    
                    {categories.map(kat => (
                        <button 
                            key={kat.id}
                            onClick={() => setActiveCategory(kat.nama)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all ${activeCategory === kat.nama ? 'bg-[#103D2E] text-[#FAF8F5]' : 'bg-white hover:bg-mentawaiDark/5 text-mentawaiDark/80 border border-mentawaiDark/10'}`}
                        >
                            {kat.nama}
                        </button>
                    ))}
                </div>

                {/* GRID CARD PAKET */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 text-center py-10 text-mentawaiMint font-bold animate-pulse">
                            Memuat Petualangan Anda...
                        </div>
                    ) : filteredPackages.length === 0 ? (
                        <div className="col-span-3 text-center py-10 text-gray-500">
                            Paket wisata untuk kategori ini belum tersedia.
                        </div>
                    ) : (
                        filteredPackages.map((pkg) => (
                            <PackageCard key={pkg.id_paket} pkg={pkg} />
                        ))
                    )}
                </div>
            </section>

            {/* 3. MEDIA GALLERY */}
            <section id="media-gallery" className="bg-[#103D2E] text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80')" }}></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Live the Experience</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4 text-white">Dokumentasi & Media Kegiatan</h2>
                        <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">Melihat lebih dekat perjalanan sesungguhnya. Klik tab di bawah untuk melihat foto orisinal atau cuplikan video sinematik petualang kami.</p>

                        <div className="flex justify-center mt-10 gap-3">
                            <button onClick={() => setActiveTab('photos')} className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center gap-2 ${activeTab === 'photos' ? 'bg-mentawaiMint text-mentawaiDark shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                <i className="fa-solid fa-images text-sm"></i> Foto Kegiatan
                            </button>
                            <button onClick={() => setActiveTab('videos')} className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center gap-2 ${activeTab === 'videos' ? 'bg-mentawaiMint text-mentawaiDark shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                <i className="fa-solid fa-circle-play text-sm"></i> Video Sinematik
                            </button>
                        </div>
                    </div>

                    {activeTab === 'photos' && (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { src: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647', title: 'Upacara Adat Sikerei', subtitle: 'Kebudayaan Asli Pedalaman', desc: 'Upacara Adat Suku Mentawai' },
                                    { src: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62', title: 'Rumah Adat Uma', subtitle: 'Akomodasi Tradisional Autentik', desc: 'Uma Mentawai di Tengah Hutan' },
                                    { src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc', title: 'Trekking Hutan Hujan', subtitle: 'Eksplorasi Flora & Fauna Liar', desc: 'Hutan Hujan Tropis Mentawai' },
                                    { src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2', title: 'Transportasi Sampan Tradisional', subtitle: 'Menyusuri Arus Sungai Rimba', desc: 'Kehidupan Pinggir Sungai' },
                                    { src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', title: 'Ombak Kelas Dunia', subtitle: 'Surga Selancar Internasional', desc: 'Ombak Mentawai Legendaris' },
                                    { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', title: 'Pulau Tak Berpenghuni', subtitle: 'Sunset & Pasir Putih Berkilau', desc: 'Pasir Putih Mentawai' },
                                    { src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206', title: 'Seni Titi Tato Mentawai', subtitle: 'Seni Tato Tertua di Dunia', desc: 'Tato Tradisional Tertua Mentawai' },
                                    { src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8', title: 'Kuliner Tradisional', subtitle: 'Sajian Keladi & Sagu Organik', desc: 'Persiapan Makan Malam di Uma' }
                                ].map((photo, i) => (
                                    <div key={i} className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md cursor-zoom-in" onClick={() => handleOpenPhoto(`${photo.src}?auto=format&fit=crop&w=1000&q=80`, photo.desc)}>
                                        <img src={`${photo.src}?auto=format&fit=crop&w=400&q=80`} alt={photo.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{photo.title}</h4>
                                                <p className="text-[10px] text-mentawaiMint">{photo.subtitle}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'videos' && (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-mentawaiDark/40 border border-white/10 rounded-3xl p-4 flex flex-col justify-between">
                                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center group">
                                        <img src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1000&q=80" alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" />
                                        <div className="relative z-10 w-20 h-20 bg-mentawaiMint text-mentawaiDark rounded-full flex items-center justify-center text-3xl cursor-pointer group-hover:bg-white group-hover:scale-110 transition duration-300 shadow-xl" onClick={() => handleOpenVideo('Featured Video: Journey Into the Mentawai Heartland')}>
                                            <i className="fa-solid fa-play ml-1"></i>
                                        </div>
                                        <span className="absolute bottom-4 right-4 bg-black/75 px-3 py-1 rounded-lg text-xs font-mono">03:45</span>
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h3 className="font-serif text-xl font-bold mb-1">Edisi Dokumenter: Menembus Jantung Adat Siberut</h3>
                                        <p className="text-sm text-white/60">Ekspedisi menelusuri pedalaman hutan hujan Mentawai untuk mendokumentasikan kehidupan harian Sikerei, pembuatan racun panah, dan kehidupan Uma adat.</p>
                                    </div>
                                </div>

                                <div className="bg-mentawaiDark/40 border border-white/10 rounded-3xl p-4 flex flex-col justify-between">
                                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center group">
                                        <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80" alt="Surf video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" />
                                        <div className="relative z-10 w-20 h-20 bg-mentawaiMint text-mentawaiDark rounded-full flex items-center justify-center text-3xl cursor-pointer group-hover:bg-white group-hover:scale-110 transition duration-300 shadow-xl" onClick={() => handleOpenVideo('Surfing Expedition: Mentawai Barrel Odyssey')}>
                                            <i className="fa-solid fa-play ml-1"></i>
                                        </div>
                                        <span className="absolute bottom-4 right-4 bg-black/75 px-3 py-1 rounded-lg text-xs font-mono">02:18</span>
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h3 className="font-serif text-xl font-bold mb-1">Sinematik Ombak: Mentawai Barrel Paradise</h3>
                                        <p className="text-sm text-white/60">Pengalaman berselancar di ombak legendaris bersama peselancar profesional lokal. Menampilkan keindahan laut Mentawai dari ketinggian udara drone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. STATS GRID */}
            <section className="py-16 bg-white border-b border-mentawaiDark/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">500+</h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Adventurers Guided</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">12+</h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Years in the Field</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">6</h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Villages Partnered</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">98%</h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Would Return</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. ABOUT US SECTION */}
            <section id="about-us" className="py-24 px-6 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl z-10 border-4 border-white">
                                <img src="../public/Ucok.jpeg" alt="Sikerei Mentawai Pemandu" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                                    <div>
                                        <p className="text-mentawaiMint text-xs font-bold uppercase tracking-widest mb-1">Indigenous Guide & Cultural Advisor</p>
                                        <h4 className="text-white text-2xl font-serif font-bold">Aman Silaing & Tim Lokal</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-mentawaiDark text-white p-6 rounded-2xl shadow-xl z-20 max-w-[240px] border border-white/10 hidden md:block">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-mentawaiMint"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-mentawaiMint">100% Native</span>
                                </div>
                                <p className="text-xs text-white/80 leading-relaxed font-light">Dipandu langsung oleh putra daerah asli Mentawai yang menjaga tradisi turun-temurun hutan Siberut.</p>
                            </div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-mentawaiMint/10 rounded-full blur-3xl z-0"></div>
                        </div>

                        <div className="lg:col-span-7 flex flex-col justify-center">
                            <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Meet the Protectors of the Forest</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-mentawaiDark leading-tight mb-6">Tentang Kami & Pemandu Lokal Anda</h2>
                            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-sm md:text-base">
                                <p>
                                    Selamat datang di <strong className="text-mentawaiDark font-semibold">Mentawai Hantage</strong>. Kami bukan sekadar agen perjalanan biasa; kami adalah jembatan hidup antara penjelajah dunia dengan peradaban tertua yang masih terjaga murni di pedalaman pulau Siberut.
                                </p>
                                <p>
                                    Didirikan oleh koalisi pemandu lokal asli suku Mentawai dan pegiat ekowisata Sumatera Barat, misi utama kami adalah melestarikan kebudayaan luhur tato, pengobatan alami <em className="italic">Sikerei</em> (dukun adat), serta menjaga kelestarian ekosistem hutan hujan tropis kami.
                                </p>
                                <p className="border-l-4 border-mentawaiMint pl-4 italic text-mentawaiSage bg-mentawaiSage/5 py-3 rounded-r-xl">
                                    "Setiap rupiah yang Anda belanjakan dalam ekspedisi ini langsung disalurkan untuk mendukung ekonomi keluarga suku pedalaman, pendidikan anak-anak suku, dan konservasi alam Siberut."
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-mentawaiDark/5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-mentawaiMint/15 text-mentawaiSage flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-heart text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-mentawaiDark text-sm mb-1">Ethical Travel</h4>
                                        <p className="text-xs text-gray-500">Kunjungan yang menghargai adat, privasi, dan tidak mengubah tatanan hidup suku asli.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-mentawaiMint/15 text-mentawaiSage flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-shield-halved text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-mentawaiDark text-sm mb-1">Keamanan Ekspedisi</h4>
                                        <p className="text-xs text-gray-500">Peralatan trekking lengkap, obat-obatan, dan navigasi rimba berpengalaman.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIALS SECTION (DINAMIS DARI DATABASE) */}
            <section id="testimoni" className="py-24 px-6 bg-[#0B2B20] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Authentic Voices</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-white font-semibold">What Our Travelers Say</h2>
                        <div className="w-16 h-1 bg-mentawaiMint mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-mentawaiMint font-bold animate-pulse">
                                Memuat Ulasan Pelancong...
                            </div>
                        ) : testimonials.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-white/50">
                                Belum ada ulasan yang ditampilkan. Jadilah yang pertama memberikan ulasan!
                            </div>
                        ) : (
                            testimonials.map((testi) => (
                                <div key={testi.id} className="bg-white/[0.03] backdrop-blur-md p-8 rounded-3xl border border-white/5 relative hover:-translate-y-2 transition duration-300">
                                    <i className="fa-solid fa-quote-right text-5xl text-mentawaiMint absolute top-6 right-6 opacity-10"></i>
                                    
                                    {/* Looping Bintang sesuai Rating */}
                                    <div className="flex text-mentawaiMint text-xs mb-6 gap-1">
                                        {[...Array(parseInt(testi.rating) || 5)].map((_, i) => (
                                            <i key={i} className="fa-solid fa-star"></i>
                                        ))}
                                    </div>
                                    
                                    <p className="text-white/80 italic mb-8 leading-relaxed text-sm">"{testi.ulasan}"</p>
                                    
                                    <div className="flex items-center gap-4 border-t border-white/5 pt-6">
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
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* 7. LIGHTBOX MODAL (POPUP FOTO/VIDEO) */}
            {lightbox.isOpen && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6 transition-all duration-300">
                    <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-3xl hover:text-mentawaiMint transition">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="max-w-4xl w-full text-center flex flex-col justify-center items-center">
                        {lightbox.type === 'photo' ? (
                            <img src={lightbox.src} className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl" alt="Enlarged" />
                        ) : (
                            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-mentawaiDark relative border border-white/10 shadow-2xl">
                                <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-gradient-to-b from-[#103D2E] to-black">
                                    <i className="fa-solid fa-circle-play text-7xl text-mentawaiMint mb-6 animate-pulse"></i>
                                    <h3 className="text-2xl font-serif text-white font-bold mb-2">{lightbox.title}</h3>
                                    <p className="text-sm text-white/60 mb-6 max-w-md">Pemutaran media simulasi. Di lingkungan nyata Anda bisa menghubungkannya ke YouTube, Vimeo, atau self-hosted video server.</p>
                                    <button onClick={closeLightbox} className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition">
                                        Tutup Pemutar
                                    </button>
                                </div>
                            </div>
                        )}
                        <p className="text-white/80 font-medium mt-6 text-lg font-serif">{lightbox.caption}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;