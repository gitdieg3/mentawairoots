import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // ================= STATE DATA DATABASE =================
    const [bookings, setBookings] = useState([]);
    const [packages, setPackages] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [testimoniList, setTestimoniList] = useState([]);
    const [settings, setSettings] = useState({ brand_name: '', whatsapp: '', email: '', alamat: '', instagram: '', facebook: '' });

    // ================= STATE NOTIFIKASI =================
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // ================= STATE FORM MODAL =================
    // Paket
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editPackageId, setEditPackageId] = useState(null);
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState('');
    const [newPackage, setNewPackage] = useState({ nama_paket: '', kategori: 'Private Trip', durasi: '', harga: '', deskripsi_singkat: '', deskripsi_lengkap: '', fasilitas_include: '', fasilitas_exclude: '' });
    const [itineraries, setItineraries] = useState([{ hari_ke: 1, judul_kegiatan: '', detail_kegiatan: '' }]);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    // Kategori & Testimoni
    const [newKategori, setNewKategori] = useState('');
    const [isModalTestiOpen, setIsModalTestiOpen] = useState(false);
    const [newTestimoni, setNewTestimoni] = useState({ nama: '', asal: '', rating: '5', ulasan: '' });
    const [testiFotoFile, setTestiFotoFile] = useState(null);

    // ================= FETCHING DATA =================
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) navigate('/login');
        };
        checkUser();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Tarik semua data secara paralel biar ngebut
            const [bData, pData, kData, tData, sData] = await Promise.all([
                supabase.from('data_booking').select('*, paket_wisata(nama_paket)').order('tanggal_pesan', { ascending: false }),
                supabase.from('paket_wisata').select('*').order('nama_paket', { ascending: true }),
                supabase.from('kategori').select('*').order('id', { ascending: true }),
                supabase.from('testimoni').select('*').order('id', { ascending: false }),
                supabase.from('pengaturan_web').select('*').eq('id', 1).single()
            ]);

            setBookings(bData.data || []);
            setPackages(pData.data || []);
            setKategoriList(kData.data || []);
            setTestimoniList(tData.data || []);
            if (sData.data) setSettings(sData.data);
        } catch (error) {
            showToast("Gagal memuat data dari database.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [activeTab]);

    // ================= FUNGSI CRUD PAKET =================
    const openAddModal = () => {
        setIsEditMode(false); setEditPackageId(null);
        setNewPackage({ nama_paket: '', kategori: 'Private Trip', durasi: '', harga: '', deskripsi_singkat: '', deskripsi_lengkap: '', fasilitas_include: '', fasilitas_exclude: '' });
        setItineraries([{ hari_ke: 1, judul_kegiatan: '', detail_kegiatan: '' }]);
        setThumbnailFile(null); setGalleryFiles([]); setExistingThumbnailUrl('');
        setIsModalOpen(true);
    };

    const openEditModal = async (pkg) => {
        setIsEditMode(true); setEditPackageId(pkg.id_paket);
        setNewPackage({ nama_paket: pkg.nama_paket, kategori: pkg.kategori, durasi: pkg.durasi, harga: String(pkg.harga), deskripsi_singkat: pkg.deskripsi_singkat, deskripsi_lengkap: pkg.deskripsi_lengkap, fasilitas_include: pkg.fasilitas_include || '', fasilitas_exclude: pkg.fasilitas_exclude || '' });
        setExistingThumbnailUrl(pkg.gambar); setThumbnailFile(null); setGalleryFiles([]);
        const { data: itinData } = await supabase.from('itinerary').select('*').eq('id_paket', pkg.id_paket).order('hari_ke', { ascending: true });
        setItineraries(itinData?.length > 0 ? itinData : [{ hari_ke: 1, judul_kegiatan: '', detail_kegiatan: '' }]);
        setIsModalOpen(true);
    };

    const handleSavePackage = async (e) => {
        e.preventDefault();
        try {
            const cleanPrice = parseInt(newPackage.harga.replace(/[^0-9]/g, '')) || 0;
            let finalThumbnailUrl = existingThumbnailUrl || "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=800&q=80";

            if (thumbnailFile) {
                const fileName = `thumb_${Date.now()}.${thumbnailFile.name.split('.').pop()}`;
                await supabase.storage.from('wisata_media').upload(`thumbnails/${fileName}`, thumbnailFile);
                finalThumbnailUrl = supabase.storage.from('wisata_media').getPublicUrl(`thumbnails/${fileName}`).data.publicUrl;
            }

            const payload = { ...newPackage, harga: cleanPrice, gambar: finalThumbnailUrl };
            let savedPackageId = null;

            if (isEditMode) {
                await supabase.from('paket_wisata').update(payload).eq('id_paket', editPackageId);
                savedPackageId = editPackageId;
                await supabase.from('itinerary').delete().eq('id_paket', editPackageId);
                showToast("Data paket berhasil diupdate!", "success");
            } else {
                const { data } = await supabase.from('paket_wisata').insert([payload]).select().single();
                savedPackageId = data.id_paket;
                showToast("Paket baru berhasil diterbitkan!", "success");
            }

            const itinData = itineraries.map((it, idx) => ({ id_paket: savedPackageId, hari_ke: idx + 1, judul_kegiatan: it.judul_kegiatan, detail_kegiatan: it.detail_kegiatan }));
            await supabase.from('itinerary').insert(itinData);

            if (galleryFiles.length > 0) {
                for (let i = 0; i < galleryFiles.length; i++) {
                    const fileName = `galeri_${savedPackageId}_${Date.now()}_${i}.${galleryFiles[i].name.split('.').pop()}`;
                    const { error } = await supabase.storage.from('wisata_media').upload(`gallery/${fileName}`, galleryFiles[i]);
                    if (!error) await supabase.from('galeri_paket').insert([{ id_paket: savedPackageId, nama_file: supabase.storage.from('wisata_media').getPublicUrl(`gallery/${fileName}`).data.publicUrl }]);
                }
            }
            setIsModalOpen(false); fetchData();
        } catch (error) { showToast(error.message, "error"); }
    };

    // ================= FUNGSI CRUD LAINNYA =================
    const deleteRecord = async (table, colId, id, message) => {
        if (window.confirm("Aksi ini tidak dapat dibatalkan. Lanjutkan hapus?")) {
            const { error } = await supabase.from(table).delete().eq(colId, id);
            if (!error) { showToast(message, "success"); fetchData(); }
            else showToast("Gagal menghapus data.", "error");
        }
    };

    const handleAddKategori = async (e) => {
        e.preventDefault();
        if (!newKategori.trim()) return;

        try {
            const { error } = await supabase.from('kategori').insert([{ nama: newKategori }]);
            if (error) throw error;

            showToast("Kategori berhasil ditambahkan!", "success");
            setNewKategori('');
            fetchData();
        } catch (error) {
            // Nah ini dia yang bikin kita tau errornya apa
            showToast("Gagal: " + error.message, "error");
            console.error("Error Tambah Kategori:", error);
        }
    };

    const handleSaveTestimoni = async (e) => {
        e.preventDefault();
        try {
            let fotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(newTestimoni.nama)}&background=2563eb&color=ffffff`;
            if (testiFotoFile) {
                const fileName = `testi_${Date.now()}.${testiFotoFile.name.split('.').pop()}`;
                await supabase.storage.from('wisata_media').upload(`testimoni/${fileName}`, testiFotoFile);
                fotoUrl = supabase.storage.from('wisata_media').getPublicUrl(`testimoni/${fileName}`).data.publicUrl;
            }
            await supabase.from('testimoni').insert([{ ...newTestimoni, foto: fotoUrl }]);
            showToast("Testimoni berhasil disimpan!");
            setIsModalTestiOpen(false); setNewTestimoni({ nama: '', asal: '', rating: '5', ulasan: '' }); setTestiFotoFile(null);
            fetchData();
        } catch (error) { showToast("Gagal menyimpan testimoni", "error"); }
    };


    // GANTI FUNGSI HANDLE SAVE PENGATURAN JADI INI
    const handleSavePengaturan = async (e) => {
        e.preventDefault();
        try {
            // Kita petakan state 'whatsapp' ke kolom 'nomor_wa' yang ada di database lu
            const payload = {
                brand_name: settings.brand_name,
                nomor_wa: settings.whatsapp, // <--- DISINI PERUBAHANNYA
                email: settings.email,
                alamat: settings.alamat,
                instagram: settings.instagram,
                facebook: settings.facebook
            };

            const { error } = await supabase.from('pengaturan_web').update(payload).eq('id', 1);
            if (error) throw error;
            showToast("Konfigurasi website berhasil diperbarui!", "success");
        } catch (error) {
            showToast("Gagal update pengaturan: " + error.message, "error");
        }
    };

    const handleLogout = async () => { if (window.confirm("Keluar dari Panel?")) { await supabase.auth.signOut(); navigate('/login'); } };

    const totalRevenue = bookings.reduce((sum, item) => sum + Number(item.total_harga || 0), 0);
    const formatRupiah = (angka) => 'Rp ' + angka.toLocaleString('id-ID');

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900">

            {/* TOAST NOTIFIKASI */}
            {toast.show && (
                <div className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-2xl border font-bold z-[100] animate-fade-in flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'} text-lg`}></i>
                    {toast.message}
                </div>
            )}

            {/* SIDEBAR */}
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full z-20 relative shadow-xl">
                <div className="p-6 pb-2">
                    <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2"><i className="fa-solid fa-anchor text-blue-500"></i> Mentawai.</h2>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Admin Dashboard</p>
                </div>
                <ul className="space-y-1 flex-grow px-4 mt-6">
                    {['dashboard', 'paket', 'kategori', 'booking', 'testimoni'].map(tab => (
                        <li key={tab}>
                            <button onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
                                <i className={`fa-solid w-5 text-center ${tab === 'dashboard' ? 'fa-chart-pie' : tab === 'paket' ? 'fa-box-open' : tab === 'kategori' ? 'fa-tags' : tab === 'booking' ? 'fa-users' : 'fa-star'}`}></i>
                                {tab === 'dashboard' ? 'Overview' : tab === 'paket' ? 'Data Paket' : tab === 'kategori' ? 'Kategori' : tab === 'booking' ? 'Leads & Booking' : 'Testimoni'}
                            </button>
                        </li>
                    ))}
                    <li className="pt-6 mt-6 border-t border-slate-800">
                        <button onClick={() => setActiveTab('pengaturan')} className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 ${activeTab === 'pengaturan' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <i className="fa-solid fa-gear w-5 text-center"></i> Pengaturan
                        </button>
                    </li>
                </ul>
                <div className="p-4 bg-slate-950/50 mt-auto">
                    <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2 font-semibold text-slate-400 hover:text-white transition"><i className="fa-solid fa-arrow-up-right-from-square w-5"></i> View Website</a>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 font-semibold transition mt-1"><i className="fa-solid fa-power-off w-5"></i> Logout</button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-full relative overflow-y-auto">
                <div className="bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')} Panel</h1>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-800">Diego Milito</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Superadmin</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg"><i className="fa-solid fa-user-astronaut"></i></div>
                    </div>
                </div>

                <div className="p-8 max-w-7xl mx-auto w-full">
                    {loading ? (<div className="text-center py-20 font-bold text-blue-600 animate-pulse"><i className="fa-solid fa-compass fa-spin text-3xl mb-3 block"></i> Sinkronisasi Data...</div>) : (
                        <>
                            {/* TAB: DASHBOARD */}
                            {activeTab === 'dashboard' && (
                                <div className="animate-fade-in">
                                    <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                                        <div className="relative z-10 md:w-3/4">
                                            <h2 className="text-3xl font-black mb-2">Sistem Operasional Aktif.</h2>
                                            <p className="text-blue-100 text-sm leading-relaxed mb-6 font-medium">Pantau performa bisnis dan tindak lanjuti prospek pelanggan secara instan untuk memaksimalkan omset perusahaan.</p>
                                            <button onClick={() => setActiveTab('booking')} className="bg-white text-blue-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-50 transition cursor-pointer">Follow Up Leads <i className="fa-solid fa-arrow-right ml-1"></i></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><div className="flex justify-between items-start"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Est. Revenue</p><h3 className="text-2xl font-black text-emerald-600">{formatRupiah(totalRevenue)}</h3></div><div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center text-lg"><i className="fa-solid fa-wallet"></i></div></div></div>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><div className="flex justify-between items-start"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Leads</p><h3 className="text-2xl font-black text-blue-600">{bookings.length} Orang</h3></div><div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-lg"><i className="fa-solid fa-users"></i></div></div></div>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><div className="flex justify-between items-start"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Packages</p><h3 className="text-2xl font-black text-indigo-600">{packages.length} Trip</h3></div><div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center text-lg"><i className="fa-solid fa-box-open"></i></div></div></div>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><div className="flex justify-between items-start"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Reviews</p><h3 className="text-2xl font-black text-amber-500">{testimoniList.length} Ulasan</h3></div><div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-lg"><i className="fa-solid fa-star"></i></div></div></div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2"><i className="fa-solid fa-bolt text-amber-400"></i> Leads Terbaru</h3>
                                        <table className="w-full text-left border-collapse">
                                            <thead className="border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                                <tr><th className="pb-3 w-10">ID</th><th className="pb-3">Client Name</th><th className="pb-3">Trip Date</th><th className="pb-3 text-right">Action</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {bookings.slice(0, 5).map((rec, idx) => (
                                                    <tr key={rec.id_booking}>
                                                        <td className="py-4 text-slate-400 font-mono text-xs">{(idx + 1).toString().padStart(2, '0')}</td>
                                                        <td className="py-4 font-bold text-slate-800">{rec.nama_lengkap}</td>
                                                        <td className="py-4 text-slate-500 font-medium text-xs">{rec.tanggal_trip}</td>
                                                        <td className="py-4 text-right"><a href={`https://wa.me/${rec.nomor_wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"><i className="fa-brands fa-whatsapp"></i> Chat</a></td>
                                                    </tr>
                                                ))}
                                                {bookings.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-slate-400 font-medium">Belum ada leads masuk.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB: KELOLA PAKET */}
                            {activeTab === 'paket' && (
                                <div className="animate-fade-in">
                                    <div className="flex justify-between items-center mb-6">
                                        <div><h2 className="text-2xl font-black text-slate-800">Katalog Paket</h2><p className="text-sm text-slate-500 font-medium">Atur produk, harga, dan itinerary detail.</p></div>
                                        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"><i className="fa-solid fa-plus"></i> Tambah Paket</button>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                                <tr><th className="p-4 w-16 text-center">ID</th><th className="p-4">Visual</th><th className="p-4">Informasi Trip</th><th className="p-4">Kategori</th><th className="p-4">Harga</th><th className="p-4 text-center">Aksi</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {packages.map((pkg, index) => (
                                                    <tr key={pkg.id_paket} className="hover:bg-slate-50 transition">
                                                        <td className="p-4 text-center font-mono text-xs text-slate-400">{(index + 1).toString().padStart(2, '0')}</td>
                                                        <td className="p-4"><img src={pkg.gambar} alt="thumb" className="w-16 h-16 object-cover rounded-xl shadow-sm" /></td>
                                                        <td className="p-4"><p className="font-bold text-slate-800 text-base">{pkg.nama_paket}</p><p className="text-xs text-slate-500 mt-1 line-clamp-1">{pkg.deskripsi_singkat}</p></td>
                                                        <td className="p-4"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase">{pkg.kategori}</span></td>
                                                        <td className="p-4 font-black text-emerald-600">{formatRupiah(pkg.harga)}</td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <button onClick={() => openEditModal(pkg)} className="bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer"><i className="fa-solid fa-pen"></i></button>
                                                                <button onClick={() => deleteRecord('paket_wisata', 'id_paket', pkg.id_paket, 'Paket dihapus!')} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer"><i className="fa-solid fa-trash"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {packages.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-400">Belum ada paket wisata.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB: DATA BOOKING */}
                            {activeTab === 'booking' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                            <tr><th className="p-5 w-16 text-center">ID</th><th className="p-5">Identitas Lead</th><th className="p-5">Permintaan Trip</th><th className="p-5">Est. Nilai</th><th className="p-5 text-center">Action</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {bookings.map((data, index) => (
                                                <tr key={data.id_booking} className="hover:bg-slate-50 transition">
                                                    <td className="p-5 text-center font-mono font-bold text-slate-400 text-xs">#{String(index + 1).padStart(4, '0')}</td>
                                                    <td className="p-5"><p className="font-bold text-slate-800 text-base">{data.nama_lengkap}</p><p className="text-xs text-slate-500 mt-1">{data.email}</p><p className="text-xs font-bold text-slate-700 mt-0.5">{data.nomor_wa}</p></td>
                                                    <td className="p-5"><p className="font-bold text-blue-600">{data.paket_wisata?.nama_paket || 'Custom/Shaman Trip'}</p><div className="flex gap-2 mt-2"><span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{data.tanggal_trip}</span><span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{data.jumlah_pax} Pax</span></div>{data.catatan_khusus && data.catatan_khusus !== '-' && <p className="text-[10px] text-amber-600 mt-2 font-bold bg-amber-50 px-2 py-1 rounded-md inline-block max-w-xs truncate"><i className="fa-solid fa-bell mr-1"></i> {data.catatan_khusus}</p>}</td>
                                                    <td className="p-5 font-black text-emerald-600 text-lg">{formatRupiah(data.total_harga)}</td>
                                                    <td className="p-5 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <a href={`https://wa.me/${data.nomor_wa}`} target="_blank" rel="noreferrer" className="bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"><i className="fa-brands fa-whatsapp text-sm"></i> Connect</a>
                                                            <button onClick={() => deleteRecord('data_booking', 'id_booking', data.id_booking, 'Lead dihapus!')} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-9 h-9 flex items-center justify-center rounded-lg transition text-xs font-bold"><i className="fa-solid fa-trash"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {bookings.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">Belum ada leads.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* TAB: KELOLA KATEGORI */}
                            {activeTab === 'kategori' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                                    <div className="md:col-span-1">
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                            <h3 className="font-black text-lg text-slate-800 mb-4 pb-4 border-b border-slate-100">Tambah Kategori</h3>
                                            <form onSubmit={handleAddKategori}>
                                                <div className="mb-6"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Nama Kategori</label><input type="text" value={newKategori} onChange={(e) => setNewKategori(e.target.value)} required placeholder="Ex: Wisata Religi" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium" /></div>
                                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer">Simpan Kategori</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                                    <tr><th className="p-5 w-16 text-center">ID</th><th className="p-5">Nama Kategori</th><th className="p-5 text-center w-32">Aksi</th></tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {kategoriList.map((kat, index) => (
                                                        <tr key={kat.id} className="hover:bg-slate-50 transition">
                                                            <td className="p-5 text-center font-mono text-xs text-slate-400">{(index + 1).toString().padStart(2, '0')}</td>
                                                            <td className="p-5 font-bold text-slate-800">{kat.nama}</td>
                                                            <td className="p-5 text-center"><button onClick={() => deleteRecord('kategori', 'id', kat.id, 'Kategori Dihapus')} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition text-xs font-bold cursor-pointer"><i className="fa-solid fa-trash"></i></button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: TESTIMONI */}
                            {activeTab === 'testimoni' && (
                                <div className="animate-fade-in">
                                    <div className="flex justify-end mb-6">
                                        <button onClick={() => setIsModalTestiOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"><i className="fa-solid fa-plus"></i> Input Testimoni</button>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                                <tr><th className="p-5 w-16 text-center">ID</th><th className="p-5 w-24">Profil</th><th className="p-5">Klien</th><th className="p-5 w-1/3">Kutipan</th><th className="p-5 text-center">Skor</th><th className="p-5 text-center">Action</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {testimoniList.map((data, index) => (
                                                    <tr key={data.id} className="hover:bg-slate-50 transition">
                                                        <td className="p-5 text-center font-mono text-xs text-slate-400">{(index + 1).toString().padStart(2, '0')}</td>
                                                        <td className="p-5"><img src={data.foto} alt="klien" className="w-10 h-10 object-cover rounded-full border border-slate-200" /></td>
                                                        <td className="p-5"><p className="font-bold text-slate-800 text-sm">{data.nama}</p><p className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mt-0.5">{data.asal}</p></td>
                                                        <td className="p-5 text-slate-600 text-sm font-medium italic">"{data.ulasan}"</td>
                                                        <td className="p-5 text-center text-amber-400 text-xs">{[...Array(parseInt(data.rating) || 5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}</td>
                                                        <td className="p-5 text-center"><button onClick={() => deleteRecord('testimoni', 'id', data.id, 'Testimoni dihapus!')} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-9 h-9 rounded-lg transition text-xs font-bold cursor-pointer"><i className="fa-solid fa-trash"></i></button></td>
                                                    </tr>
                                                ))}
                                                {testimoniList.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-400">Belum ada testimoni.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB: PENGATURAN WEB */}
                            {activeTab === 'pengaturan' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-4xl animate-fade-in">
                                    <div className="mb-8 border-b border-slate-100 pb-6"><h2 className="text-2xl font-black text-slate-800">Global Settings</h2><p className="text-slate-500 text-sm mt-1">Data ini akan di-render langsung ke website pelanggan.</p></div>
                                    <form onSubmit={handleSavePengaturan}>
                                        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><i className="fa-solid fa-building text-blue-500"></i> Identitas Bisnis</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Brand Name</label><input type="text" value={settings.brand_name} onChange={e => setSettings({ ...settings, brand_name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium" /></div>
                                            <div><label className="block text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-widest"><i className="fa-brands fa-whatsapp"></i> WhatsApp Number</label><input type="text" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium" /></div>
                                        </div>
                                        <div className="mb-6"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Support Email</label><input type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium" /></div>
                                        <div className="mb-10"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Office Address</label><textarea rows="3" value={settings.alamat} onChange={e => setSettings({ ...settings, alamat: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"></textarea></div>

                                        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><i className="fa-solid fa-share-nodes text-blue-500"></i> Social Media Links</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                            <div><label className="block text-[10px] font-bold text-pink-500 mb-2 uppercase tracking-widest"><i className="fa-brands fa-instagram"></i> Instagram</label><input type="text" value={settings.instagram} onChange={e => setSettings({ ...settings, instagram: e.target.value })} className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 font-medium" /></div>
                                            <div><label className="block text-[10px] font-bold text-blue-600 mb-2 uppercase tracking-widest"><i className="fa-brands fa-facebook"></i> Facebook</label><input type="text" value={settings.facebook} onChange={e => setSettings({ ...settings, facebook: e.target.value })} className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium" /></div>
                                        </div>
                                        <div className="flex justify-end pt-6 border-t border-slate-100">
                                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition cursor-pointer flex items-center gap-2"><i className="fa-solid fa-save"></i> Simpan Pengaturan</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ================= MODAL: FORM PAKET ================= */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
                            <div><h3 className="font-black text-2xl text-slate-800">{isEditMode ? 'Edit Paket Wisata' : 'Registrasi Paket Baru'}</h3><p className="text-xs font-bold text-slate-500 uppercase mt-1">{isEditMode ? `ID: #${editPackageId}` : 'Database Input'}</p></div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center transition cursor-pointer"><i className="fa-solid fa-xmark text-lg"></i></button>
                        </div>
                        <form onSubmit={handleSavePackage} className="p-8">
                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">1. Master Data</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Label Paket</label><input type="text" value={newPackage.nama_paket} onChange={e => setNewPackage({ ...newPackage, nama_paket: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Klasifikasi</label><select value={newPackage.kategori} onChange={e => setNewPackage({ ...newPackage, kategori: e.target.value })} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500">{kategoriList.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}<option value="Lainnya">Lainnya...</option></select></div>
                                <div><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Durasi</label><input type="text" value={newPackage.durasi} onChange={e => setNewPackage({ ...newPackage, durasi: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Harga (Rp)</label><input type="text" value={newPackage.harga} onChange={e => setNewPackage({ ...newPackage, harga: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500" /></div>
                            </div>
                            <div className="mb-6"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Short Summary</label><textarea rows="2" value={newPackage.deskripsi_singkat} onChange={e => setNewPackage({ ...newPackage, deskripsi_singkat: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500"></textarea></div>
                            <div className="mb-10"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Full Description</label><textarea rows="4" value={newPackage.deskripsi_lengkap} onChange={e => setNewPackage({ ...newPackage, deskripsi_lengkap: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500"></textarea></div>

                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">2. Facilities</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div><label className="block text-[10px] font-bold text-emerald-600 mb-2 uppercase"><i className="fa-solid fa-check mr-1"></i> Included</label><textarea rows="3" value={newPackage.fasilitas_include} onChange={e => setNewPackage({ ...newPackage, fasilitas_include: e.target.value })} className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"></textarea></div>
                                <div><label className="block text-[10px] font-bold text-red-500 mb-2 uppercase"><i className="fa-solid fa-xmark mr-1"></i> Excluded</label><textarea rows="3" value={newPackage.fasilitas_exclude} onChange={e => setNewPackage({ ...newPackage, fasilitas_exclude: e.target.value })} className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:border-red-500"></textarea></div>
                            </div>

                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">3. Visual Media</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100"><label className="block text-[10px] font-bold text-blue-800 mb-3 uppercase">Thumbnail Cover</label><input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer bg-white border border-blue-200 rounded-lg p-1" />{isEditMode && existingThumbnailUrl && !thumbnailFile && <p className="text-[10px] text-blue-600 mt-2 italic">*Foto lama masih terpasang.</p>}</div>
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100"><label className="block text-[10px] font-bold text-indigo-800 mb-3 uppercase">Gallery Slider</label><input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(Array.from(e.target.files))} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white cursor-pointer bg-white border border-indigo-200 rounded-lg p-1" /></div>
                            </div>

                            <div className="flex justify-between items-end border-b border-slate-100 pb-3 mb-5">
                                <h4 className="font-bold text-slate-800 border-l-4 border-blue-500 pl-3">4. Itinerary Timeline</h4>
                                <button type="button" onClick={() => setItineraries([...itineraries, { hari_ke: itineraries.length + 1, judul_kegiatan: '', detail_kegiatan: '' }])} className="bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"><i className="fa-solid fa-plus"></i> Add Day</button>
                            </div>
                            <div className="mb-10 space-y-4">
                                {itineraries.map((itin, index) => (
                                    <div key={index} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative group">
                                        {itineraries.length > 1 && <button type="button" onClick={() => setItineraries(itineraries.filter((_, i) => i !== index).map((it, idx) => ({ ...it, hari_ke: idx + 1 })))} className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-500 hover:text-white cursor-pointer"><i className="fa-solid fa-xmark"></i></button>}
                                        <div className="grid grid-cols-12 gap-5">
                                            <div className="col-span-2"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Day</label><input type="number" value={itin.hari_ke} readOnly className="w-full px-4 py-3 bg-slate-200 rounded-xl text-center font-black outline-none text-slate-600" /></div>
                                            <div className="col-span-10"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Title</label><input type="text" required value={itin.judul_kegiatan} onChange={(e) => { const newItin = [...itineraries]; newItin[index].judul_kegiatan = e.target.value; setItineraries(newItin); }} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500" /></div>
                                            <div className="col-span-12"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Description</label><textarea required rows="2" value={itin.detail_kegiatan} onChange={(e) => { const newItin = [...itineraries]; newItin[index].detail_kegiatan = e.target.value; setItineraries(newItin); }} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500"></textarea></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 sticky bottom-0 bg-white/90 backdrop-blur-md pt-5 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer">Batal</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition cursor-pointer flex items-center gap-2"><i className="fa-solid fa-cloud-arrow-up"></i> {isEditMode ? 'Simpan Perubahan' : 'Publish Paket'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL: TAMBAH TESTIMONI ================= */}
            {isModalTestiOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in border border-slate-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center"><h3 className="font-black text-xl text-slate-800">Tambah Review Asli</h3><button onClick={() => setIsModalTestiOpen(false)} className="w-8 h-8 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center cursor-pointer"><i className="fa-solid fa-xmark"></i></button></div>
                        <form onSubmit={handleSaveTestimoni} className="p-8">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Nama Lengkap</label><input type="text" value={newTestimoni.nama} onChange={e => setNewTestimoni({ ...newTestimoni, nama: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Asal Kota/Negara</label><input type="text" value={newTestimoni.asal} onChange={e => setNewTestimoni({ ...newTestimoni, asal: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500" /></div>
                            </div>
                            <div className="mb-6"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Rating</label><select value={newTestimoni.rating} onChange={e => setNewTestimoni({ ...newTestimoni, rating: e.target.value })} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500"><option value="5">5 Bintang (Sangat Puas)</option><option value="4">4 Bintang (Puas)</option><option value="3">3 Bintang (Cukup)</option></select></div>
                            <div className="mb-6"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Isi Ulasan</label><textarea rows="3" value={newTestimoni.ulasan} onChange={e => setNewTestimoni({ ...newTestimoni, ulasan: e.target.value })} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500"></textarea></div>
                            <div className="mb-8"><label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Upload Foto (Opsional)</label><input type="file" accept="image/*" onChange={e => setTestiFotoFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 cursor-pointer border rounded-lg p-1" /></div>
                            <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setIsModalTestiOpen(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl cursor-pointer">Batal</button><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold cursor-pointer">Simpan Testimoni</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;