import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useGlobal } from '../GlobalContext'; // <-- 1. IMPORT JANTUNGNYA

const Detail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const packageId = searchParams.get('id');

    // <-- 2. TARIK TOOLS TOAST DARI JANTUNG
    const { showToast } = useGlobal();

    // STATE UNTUK DATA SUPABASE
    const [packageData, setPackageData] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);

    // STATE UNTUK GALERI GAMBAR & BOOKING WIDGET
    const [mainImage, setMainImage] = useState('');
    const [pax, setPax] = useState(1);
    const [date, setDate] = useState('');

    useEffect(() => {
        if (!packageId) {
            navigate('/');
            return;
        }

        const fetchDetailData = async () => {
            try {
                const { data: pkg, error: pkgError } = await supabase
                    .from('paket_wisata')
                    .select('*')
                    .eq('id_paket', packageId)
                    .single();

                if (pkgError) throw pkgError;
                setPackageData(pkg);
                setMainImage(pkg.gambar);

                const { data: itin } = await supabase
                    .from('itinerary')
                    .select('*')
                    .eq('id_paket', packageId)
                    .order('hari_ke', { ascending: true });
                setItineraries(itin || []);

                const { data: gal } = await supabase
                    .from('galeri_paket')
                    .select('*')
                    .eq('id_paket', packageId);
                setGalleries(gal || []);

            } catch (error) {
                console.error("Error fetching detail:", error.message);

                // <-- 3. GANTI ALERT JADI TOAST ELEGAN
                showToast("Gagal memuat detail paket atau paket tidak ditemukan.", "error");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchDetailData();

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
    }, [packageId, navigate, showToast]);

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        navigate(`/booking?id=${packageId}&date=${date}&pax=${pax}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
                <div className="text-center text-mentawaiDark font-bold animate-pulse text-xl font-serif">
                    <i className="fa-solid fa-compass fa-spin text-4xl mb-4 block text-mentawaiMint"></i>
                    Mempersiapkan Rute Ekspedisi Anda...
                </div>
            </div>
        );
    }

    const renderFasilitas = (text) => {
        if (!text) return <p className="text-sm text-gray-500 italic">Tidak ada data.</p>;
        const items = text.split('\n').filter(item => item.trim() !== '');
        return items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
                <i className="fa-solid fa-circle text-[6px] mt-2 opacity-70"></i>
                <span>{item}</span>
            </li>
        ));
    };

    return (
        <>
            <style>{`
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }
                .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(11, 43, 32, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(61, 122, 90, 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(89, 195, 148, 0.6); }
            `}</style>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <a href="/" className="inline-flex items-center gap-2 text-mentawaiSage hover:text-mentawaiMint font-bold text-xs uppercase tracking-wider transition mb-8">
                    <i className="fa-solid fa-arrow-left"></i> Kembali ke Katalog
                </a>

                {/* HEADER PAKET */}
                <div className="mb-10">
                    <div className="flex flex-wrap gap-2.5 mb-4">
                        <span className="bg-mentawaiDark text-mentawaiMint border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-mentawaiMint"></span> {packageData.kategori}
                        </span>
                        <span className="bg-white/90 border border-mentawaiDark/10 text-mentawaiDark px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <i className="fa-regular fa-clock text-mentawaiGold mr-1.5 text-xs"></i> {packageData.durasi}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-semibold text-mentawaiDark leading-tight max-w-4xl">
                        {packageData.nama_paket}
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3">
                        <div className="mb-12">
                            <div className="relative overflow-hidden rounded-3xl shadow-lg border border-mentawaiDark/5 mb-4 aspect-[16/10]">
                                <img src={mainImage} className="w-full h-full object-cover transition duration-500" alt="Main Expedition" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto snap-x pb-3 custom-scrollbar">
                                <img
                                    src={packageData.gambar}
                                    className={`gallery-thumb w-28 h-20 object-cover rounded-2xl snap-start shadow-sm border-2 transition duration-300 cursor-pointer ${mainImage === packageData.gambar ? 'border-mentawaiMint opacity-100' : 'border-transparent opacity-70 hover:opacity-100 hover:border-mentawaiSage'}`}
                                    onClick={() => setMainImage(packageData.gambar)}
                                    alt="Thumbnail Utama"
                                />
                                {galleries.map((gal) => (
                                    <img
                                        key={gal.id_galeri}
                                        src={gal.nama_file}
                                        className={`gallery-thumb w-28 h-20 object-cover rounded-2xl snap-start shadow-sm border-2 transition duration-300 cursor-pointer ${mainImage === gal.nama_file ? 'border-mentawaiMint opacity-100' : 'border-transparent opacity-70 hover:opacity-100 hover:border-mentawaiSage'}`}
                                        onClick={() => setMainImage(gal.nama_file)}
                                        alt="Thumbnail Galeri"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-12 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-mentawaiDark/5">
                            <h2 className="text-2xl font-serif font-bold text-mentawaiDark mb-5 border-b border-mentawaiDark/5 pb-3">Trip Overview</h2>
                            <div className="text-gray-600 font-light leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                {packageData.deskripsi_lengkap}
                            </div>
                        </div>

                        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#103D2E]/5 p-8 rounded-3xl border border-[#103D2E]/10">
                                <h3 className="text-sm font-bold text-mentawaiDark mb-5 uppercase tracking-wider flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-mentawaiMint/20 text-mentawaiSage flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></span> What's Included
                                </h3>
                                <ul className="space-y-4 text-xs md:text-sm text-gray-600 font-light [&>li>i]:text-mentawaiMint">
                                    {renderFasilitas(packageData.fasilitas_include)}
                                </ul>
                            </div>

                            <div className="bg-amber-500/5 p-8 rounded-3xl border border-amber-500/10">
                                <h3 className="text-sm font-bold text-amber-900 mb-5 uppercase tracking-wider flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center text-xs"><i className="fa-solid fa-xmark"></i></span> What's Excluded
                                </h3>
                                <ul className="space-y-4 text-xs md:text-sm text-gray-600 font-light [&>li>i]:text-amber-500">
                                    {renderFasilitas(packageData.fasilitas_exclude)}
                                </ul>
                            </div>
                        </div>

                        <div className="mb-12 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-mentawaiDark/5">
                            <h2 className="text-2xl font-serif font-bold text-mentawaiDark mb-8 border-b border-mentawaiDark/5 pb-3">Detail Itinerary</h2>

                            <div className="space-y-5">
                                {itineraries.length === 0 ? (
                                    <p className="text-gray-500 italic text-sm">Jadwal itinerary belum tersedia untuk paket ini.</p>
                                ) : (
                                    itineraries.map((itin, idx) => (
                                        <details key={itin.id_itinerary} className="group bg-[#FAF8F5] rounded-2xl border border-mentawaiDark/5" open={idx === 0}>
                                            <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-mentawaiDark">
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-mentawaiDark text-mentawaiMint w-10 h-10 flex items-center justify-center rounded-full text-xs font-mono font-bold">D{itin.hari_ke}</span>
                                                    <span className="text-base md:text-lg font-serif">{itin.judul_kegiatan}</span>
                                                </div>
                                                <span className="transition group-open:rotate-180 text-mentawaiSage"><i className="fa-solid fa-chevron-down text-sm"></i></span>
                                            </summary>
                                            <div className="text-gray-600 font-light px-6 pb-6 pt-2 text-sm md:text-base leading-relaxed border-t border-mentawaiDark/5 mt-2 whitespace-pre-wrap">
                                                {itin.detail_kegiatan}
                                            </div>
                                        </details>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-mentawaiDark/5 sticky top-28">

                            <div className="mb-8 border-b border-mentawaiDark/5 pb-6">

                                <p className="text-3xl font-black text-mentawaiDark font-serif">
                                    {packageData.harga > 0 ? (
                                        <>Rp {packageData.harga.toLocaleString('id-ID')} <span className="text-xs font-sans font-normal text-gray-400">/ pax</span></>
                                    ) : (
                                        <span className="text-2xl italic">Flexible Pricing</span>
                                    )}
                                </p>
                            </div>

                            <form onSubmit={handleBookingSubmit}>
                                <div className="mb-5">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Pilih Tanggal Trip</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-regular fa-calendar text-mentawaiSage"></i>
                                        </div>
                                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition text-sm [color-scheme:light]" />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Jumlah Peserta (Pax)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-user-group text-mentawaiSage"></i>
                                        </div>
                                        <select value={pax} onChange={(e) => setPax(Number(e.target.value))} required className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition text-sm appearance-none cursor-pointer">
                                            {[...Array(10).keys()].map(n => (
                                                <option key={n + 1} value={n + 1}>{n + 1} Orang</option>
                                            ))}
                                            <option value="11">Rombongan Besar (Hubungi Kami)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8 p-4 bg-[#FAF8F5] border border-mentawaiDark/5 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Estimasi Total Biaya</span>
                                        <span className="font-extrabold text-mentawaiSage text-xl">
                                            {packageData.harga > 0 ? `Rp ${(packageData.harga * pax).toLocaleString('id-ID')}` : 'Custom Price'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-mentawaiMint bg-mentawaiDark px-2.5 py-1 rounded-full border border-white/5 uppercase tracking-wider">Secure</span>
                                </div>

                                <button type="submit" className="w-full bg-[#103D2E] hover:bg-mentawaiSage text-[#FAF8F5] font-extrabold text-sm uppercase tracking-widest py-4 rounded-2xl transition duration-300 shadow-lg shadow-[#103D2E]/10 flex justify-center items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer">
                                    Lanjut ke Form Data <i className="fa-solid fa-arrow-right text-xs"></i>
                                </button>

                                <p className="text-center text-[10px] text-gray-400 mt-4"><i className="fa-solid fa-shield-halved text-mentawaiMint mr-1.5"></i> Slot terbatas. Amankan kursi Anda sekarang.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Detail;