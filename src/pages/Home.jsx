import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PackageCard from '../components/PackageCard';
import AboutSection from '../components/AboutSection';
import TestimonialSlider from '../components/TestimonialSlider';
import MediaGallery from '../components/MediaGallery'; // IMPORT KOMPONEN BARU

const Home = () => {
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [mediaList, setMediaList] = useState([]); // STATE UNTUK MEDIA
    const [settings, setSettings] = useState({});
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Tambahin fetch untuk 'media_kegiatan'
                const [pkgRes, catRes, testiRes, settingRes, mediaRes] = await Promise.all([
                    supabase.from('paket_wisata').select('*').order('id_paket', { ascending: false }),
                    supabase.from('kategori').select('*').order('id', { ascending: true }),
                    supabase.from('testimoni').select('*').order('id', { ascending: false }),
                    supabase.from('pengaturan_web').select('*').eq('id', 1).single(),
                    supabase.from('media_kegiatan').select('*').order('id', { ascending: false }) // TARIK MEDIA
                ]);

                if (pkgRes.error) throw pkgRes.error;
                if (catRes.error) throw catRes.error;

                setPackages(pkgRes.data || []);
                setCategories(catRes.data || []);
                setTestimonials(testiRes.data || []);
                setSettings(settingRes.data || {});
                setMediaList(mediaRes.data || []); // SIMPAN MEDIA
            } catch (error) {
                console.error("Gagal menarik data Home:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    // TAMBAHAN: Komponen Animasi Angka Bergulir (Sangat Ringan)
    const AnimatedNumber = ({ end, suffix = "", duration = 2000 }) => {
        const [count, setCount] = useState(0);
        const [isVisible, setIsVisible] = useState(false);
        const ref = React.useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
                { threshold: 0.1 }
            );
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, []);

        useEffect(() => {
            if (!isVisible) return;
            let startTime = null;
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                setCount(Math.floor(progress * end));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, [isVisible, end, duration]);

        return <span ref={ref}>{count}{suffix}</span>;
    };

    const filteredPackages = activeCategory === 'All'
        ? packages
        : packages.filter(pkg => pkg.kategori === activeCategory);

    const kirimPesanWA = () => {
        let kategori = document.getElementById('wa_kategori').value;
        let tanggal = document.getElementById('wa_tanggal').value;
        let peserta = document.getElementById('wa_peserta').value;

        if (!tanggal) {
            alert('Pemberitahuan: Silakan tentukan tanggal keberangkatan yang Anda inginkan.');
            return;
        }

        let textPesan = `Halo Mentawai roots!\n\nSaya ingin berkonsultasi mengenai petualangan ekspedisi Mentawai dengan rincian berikut:\n` +
            `- *Kategori Adventure:* ${kategori}\n` +
            `- *Tanggal Keberangkatan:* ${tanggal}\n` +
            `- *Jumlah Peserta:* ${peserta}\n\n` +
            `Apakah kuota perjalanan untuk rute ini masih tersedia? Terima kasih!`;

        let phone = settings.nomor_wa || '628126774808';
        phone = phone.replace(/\D/g, ''); // <-- TAMBAHAN: Bersihkan semua simbol & spasi
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textPesan)}`, '_blank');
    };

    return (
        <>
            {/* HERO SECTION */}
            <section className="relative min-h-[92vh] flex flex-col justify-between items-center text-center pb-20 pt-16 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://sltvfrfepmuvcmduhcgd.supabase.co/storage/v1/object/public/web_assets/banner.jpeg" alt="Mentawai Jungle" className="w-full h-full object-cover object-center scale-105" />
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
                        Escape the ordinary. Immerse yourself in the deep jungle to discover ancient traditions, authentic tribal art, and the wild beauty of Mentawai alongside our expert local guides
                    </p>
                </div>

                <div className="relative z-20 w-full max-w-5xl mx-auto mt-6">
                    <div className="bg-[#103D2E]/90 backdrop-blur-lg p-5 md:p-4 rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-left focus-within:border-mentawaiMint focus-within:bg-white/10 transition">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Touristm catagory</label>
                            <div className="relative">
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
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Daparture</label>
                            <input type="date" id="wa_tanggal" className="w-full font-bold text-white outline-none bg-transparent cursor-pointer text-sm [color-scheme:dark]" />
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-left focus-within:border-mentawaiMint focus-within:bg-white/10 transition">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Number of participants</label>
                            <div className="relative">
                                <select id="wa_peserta" className="w-full font-bold text-white outline-none bg-transparent appearance-none cursor-pointer pr-6">
                                    <option value="1 - 3 Adventurers" className="bg-mentawaiDark text-white">1 - 3  person</option>
                                    <option value="4 - 7 Adventurers" className="bg-mentawaiDark text-white">4 - 7 person</option>
                                    <option value="Large group (8+)" className="bg-mentawaiDark text-white">Group (8+)</option>
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

            {/* PACKAGES SECTION */}
            <section id="packages" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Our Curated Adventures</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-mentawaiDark leading-tight">Choose Your <br />Adventure Level</h2>
                    </div>
                    <div>
                        <a href="#media-gallery" className="inline-flex items-center gap-2 border border-mentawaiDark/20 hover:border-mentawaiMint hover:bg-mentawaiMint/5 text-mentawaiDark hover:text-mentawaiMint px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300">
                            View Documentation Gallery <i className="fa-solid fa-photo-film"></i>
                        </a>
                    </div>
                </div>

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

            {/* SEKARANG CUKUP PANGGIL KOMPONEN-KOMPONEN INI AJA, BERSIH BANGET KAN? */}
            <MediaGallery mediaData={mediaList} />

            <section className="py-16 bg-white border-b border-mentawaiDark/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">
                                <AnimatedNumber end={500} suffix="+" />
                            </h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Adventurers Guided</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">
                                <AnimatedNumber end={12} suffix="+" />
                            </h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Years in the Field</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">
                                <AnimatedNumber end={6} />
                            </h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Villages Partnered</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-serif font-black text-mentawaiDark">
                                <AnimatedNumber end={98} suffix="%" />
                            </h4>
                            <p className="text-xs text-mentawaiSage uppercase tracking-wider font-semibold mt-2">Would Return</p>
                        </div>
                    </div>
                </div>
            </section>

            <AboutSection settings={settings} />
            <TestimonialSlider testimonials={testimonials} loading={loading} />
        </>
    );
};

export default Home;