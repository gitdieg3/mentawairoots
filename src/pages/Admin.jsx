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
const [settings, setSettings] = useState({ id: null, brand_name: '', nomor_wa: '', email: '', alamat: '', instagram: '', facebook: '' });

// ================= STATE NOTIFIKASI =================
const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
};

// ================= STATE CUSTOM DIALOG (PENGGANTI ALERT/CONFIRM BAWAAN) =================
const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null, type: 'danger' });

// ================= STATE FORM MODAL =================
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [editPackageId, setEditPackageId] = useState(null);
const [existingThumbnailUrl, setExistingThumbnailUrl] = useState('');
const [newPackage, setNewPackage] = useState({ nama_paket: '', kategori: 'Private Trip', durasi: '', harga: '', deskripsi_singkat: '', deskripsi_lengkap: '', fasilitas_include: '', fasilitas_exclude: '' });
const [itineraries, setItineraries] = useState([{ hari_ke: 1, judul_kegiatan: '', detail_kegiatan: '' }]);
const [thumbnailFile, setThumbnailFile] = useState(null);
const [galleryFiles, setGalleryFiles] = useState([]);

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
        const [bData, pData, kData, tData, sData] = await Promise.all([
            supabase.from('data_booking').select('*, paket_wisata(nama_paket)').order('tanggal_pesan', { ascending: false }),
            supabase.from('paket_wisata').select('*').order('nama_paket', { ascending: true }),
            supabase.from('kategori').select('*').order('id', { ascending: true }),
            supabase.from('testimoni').select('*').order('id', { ascending: false }),
            supabase.from('pengaturan_web').select('*').limit(1) 
        ]);

        setBookings(bData.data || []);
        setPackages(pData.data || []);
        setKategoriList(kData.data || []);
        setTestimoniList(tData.data || []);
        
        if (sData.data && sData.data.length > 0) {
            setSettings(sData.data[0]);
        }
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

// ================= FUNGSI CRUD LAINNYA (DENGAN MODERN CONFIRM) =================
const deleteRecord = (table, colId, id, message) => {
    // Menggunakan Custom Dialog pengganti window.confirm()
    setConfirmDialog({
        isOpen: true,
        type: 'danger',
        title: 'Hapus Data',
        message: 'Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Lanjutkan menghapus data?',
        action: async () => {
            setConfirmDialog(prev => ({ ...prev, isOpen: false })); // Tutup dialog
            const { error } = await supabase.from(table).delete().eq(colId, id);
            if (!error) { showToast(message, "success"); fetchData(); }
            else showToast("Gagal menghapus data.", "error");
        }
    });
};

const handleLogout = () => {
    // Menggunakan Custom Dialog untuk konfirmasi logout
    setConfirmDialog({
        isOpen: true,
        type: 'warning',
        title: 'Keluar Sistem',
        message: 'Anda akan keluar dari sesi administrator. Pastikan semua perubahan telah tersimpan. Lanjutkan?',
        action: async () => {
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            await supabase.auth.signOut(); 
            navigate('/login');
        }
    });
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
        showToast("Gagal: " + error.message, "error");
    }
};

const handleSaveTestimoni = async (e) => {
    e.preventDefault();
    try {
        let fotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(newTestimoni.nama)}&background=163A24&color=D4F85A`;
        if (testiFotoFile) {
            const fileName = `testi_${Date.now()}.${testiFotoFile.name.split('.').pop()}`;
            await supabase.storage.from('wisata_media').upload(`testimoni/${fileName}`, testiFotoFile);
            fotoUrl = supabase.storage.from('wisata_media').getPublicUrl(`testimoni/${fileName}`).data.publicUrl;
        }
        await supabase.from('testimoni').insert([{ ...newTestimoni, foto: fotoUrl }]);
        showToast("Testimoni berhasil disimpan!", "success");
        setIsModalTestiOpen(false); setNewTestimoni({ nama: '', asal: '', rating: '5', ulasan: '' }); setTestiFotoFile(null);
        fetchData();
    } catch (error) { showToast("Gagal menyimpan testimoni", "error"); }
};

const handleSavePengaturan = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            brand_name: settings.brand_name,
            nomor_wa: settings.nomor_wa, 
            email: settings.email,
            alamat: settings.alamat,
            instagram: settings.instagram,
            facebook: settings.facebook
        };

        if (settings.id) {
            const { error } = await supabase.from('pengaturan_web').update(payload).eq('id', settings.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('pengaturan_web').insert([payload]);
            if (error) throw error;
        }

        showToast("Konfigurasi website berhasil diperbarui!", "success");
        fetchData(); 
    } catch (error) {
        showToast("Gagal update pengaturan: " + error.message, "error");
    }
};

const totalRevenue = bookings.reduce((sum, item) => sum + Number(item.total_harga || 0), 0);
const formatRupiah = (angka) => '$ ' + (angka / 15000).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0}); 

// Helper for navigation
const navItems = [
    { id: 'dashboard', label: 'Overview', icon: 'fa-border-all' },
    { id: 'paket', label: 'Products', icon: 'fa-box' },
    { id: 'kategori', label: 'Categories', icon: 'fa-layer-group' },
    { id: 'booking', label: 'Transactions', icon: 'fa-file-invoice-dollar' },
    { id: 'testimoni', label: 'Reviews', icon: 'fa-comment-dots' },
];

return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6F5] text-[#111827] font-sans selection:bg-[#D4F85A] selection:text-[#0A1610]">

        {/* PREMIUM TOAST */}
        {toast.show && (
            <div className={`fixed top-6 right-6 px-5 py-3.5 rounded-xl shadow-xl border font-medium z-[100] animate-fade-in flex items-center gap-3 text-sm ${toast.type === 'success' ? 'bg-[#0A1610] border-[#1A3626] text-[#D4F85A]' : 'bg-red-50 border-red-200 text-red-600'}`}>
                <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                {toast.message}
            </div>
        )}

        {/* SIDEBAR (Dark Forest Green) */}
        <div className="w-64 bg-[#0A1610] text-[#8F9B94] flex flex-col h-full z-20 relative border-r border-[#1A3626]">
            <div className="p-8 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <i className="fa-solid fa-asterisk text-[#D4F85A] text-sm"></i> 
                    {settings.brand_name || 'Siohioma'}
                </h2>
            </div>

            <div className="flex-grow overflow-y-auto pt-4">
                <p className="px-8 text-[10px] uppercase font-bold tracking-widest text-[#5C6E64] mb-3">Menu</p>
                <ul className="space-y-1 mb-8">
                    {navItems.map(tab => (
                        <li key={tab.id}>
                            <button 
                                onClick={() => setActiveTab(tab.id)} 
                                className={`w-full flex items-center gap-4 px-8 py-3.5 font-medium transition-all text-sm border-l-4 ${activeTab === tab.id ? 'text-[#D4F85A] border-[#D4F85A] bg-[#1A3626]/40' : 'border-transparent hover:text-white hover:bg-white/5'}`}
                            >
                                <i className={`fa-solid ${tab.icon} w-4 text-center`}></i>
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <p className="px-8 text-[10px] uppercase font-bold tracking-widest text-[#5C6E64] mb-3">General</p>
                <ul className="space-y-1">
                    <li>
                        <button 
                            onClick={() => setActiveTab('pengaturan')} 
                            className={`w-full flex items-center gap-4 px-8 py-3.5 font-medium transition-all text-sm border-l-4 ${activeTab === 'pengaturan' ? 'text-[#D4F85A] border-[#D4F85A] bg-[#1A3626]/40' : 'border-transparent hover:text-white hover:bg-white/5'}`}
                        >
                            <i className="fa-solid fa-gear w-4 text-center"></i> Settings
                        </button>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-8 py-3.5 font-medium transition-all text-sm border-l-4 border-transparent text-[#8F9B94] hover:text-red-400 hover:bg-red-500/10">
                            <i className="fa-solid fa-shield-halved w-4 text-center"></i> Security (Logout)
                        </button>
                    </li>
                </ul>
            </div>

            <div className="p-6">
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#1A3626] text-[#D4F85A] py-3 rounded-xl text-xs font-bold hover:bg-[#D4F85A] hover:text-[#0A1610] transition">
                    View Live Site <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto">
            {/* TOP HEADER */}
            <div className="bg-[#F4F6F5] px-10 py-6 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3 cursor-pointer group">
                    <h1 className="text-lg font-bold text-[#111827]">Sales Admin</h1>
                    <i className="fa-solid fa-chevron-down text-xs text-gray-400 group-hover:text-gray-800 transition"></i>
                </div>
                <div className="flex items-center gap-5">
                    <div className="relative hidden md:block">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input type="text" placeholder="Search anything in system..." className="w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:border-[#0A1610] transition" />
                    </div>
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50"><i className="fa-regular fa-bell"></i></div>
                    <button onClick={openAddModal} className="bg-[#D4F85A] hover:bg-[#c2e846] text-[#0A1610] font-bold px-5 py-2.5 rounded-full text-sm transition flex items-center gap-2 shadow-sm">
                        <i className="fa-solid fa-plus"></i> Add new product
                    </button>
                </div>
            </div>

            <div className="p-10 max-w-[1400px] w-full">
                {loading ? (<div className="text-center py-20 font-bold text-[#0A1610] animate-pulse"><i className="fa-solid fa-circle-notch fa-spin text-3xl mb-3 block text-[#D4F85A]"></i> Syncing Data...</div>) : (
                    <>
                        {/* TAB: DASHBOARD */}
                        {activeTab === 'dashboard' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[#111827]">Dashboard</h2>
                                        <p className="text-sm text-gray-500 mt-1">An easy way to manage sales with care and precision.</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                        <i className="fa-regular fa-calendar"></i> January 2024 - May 2024 <i className="fa-solid fa-chevron-down text-xs ml-2"></i>
                                    </div>
                                </div>

                                {/* HERO METRICS */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                    {/* Highlight Card */}
                                    <div className="bg-[#10291C] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4F85A] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                                        <div>
                                            <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4 border border-red-500/20">
                                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span> Update
                                            </span>
                                            <p className="text-xs text-gray-400 font-medium mb-1">Feb 12th 2024</p>
                                            <h3 className="text-lg font-medium leading-snug">Sales revenue increased <br/><span className="text-[#D4F85A] font-bold">40%</span> in 1 week</h3>
                                        </div>
                                        <button onClick={() => setActiveTab('booking')} className="text-sm text-[#D4F85A] font-medium text-left mt-6 flex items-center gap-1 hover:gap-2 transition-all">See Statistics <i className="fa-solid fa-arrow-right text-xs"></i></button>
                                    </div>

                                    {/* Stat Card 1 */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-sm font-medium text-gray-500">Net Income</p>
                                            <i className="fa-solid fa-ellipsis text-gray-400 cursor-pointer"></i>
                                        </div>
                                        <h3 className="text-4xl font-bold text-[#111827] tracking-tight">{formatRupiah(totalRevenue * 15000)}</h3>
                                        <div className="flex items-center gap-2 mt-4 text-xs">
                                            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1"><i className="fa-solid fa-arrow-trend-up"></i> +35%</span>
                                            <span className="text-gray-400">from last month</span>
                                        </div>
                                    </div>

                                    {/* Stat Card 2 */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-sm font-medium text-gray-500">Total Leads</p>
                                            <i className="fa-solid fa-ellipsis text-gray-400 cursor-pointer"></i>
                                        </div>
                                        <h3 className="text-4xl font-bold text-[#111827] tracking-tight">{bookings.length}</h3>
                                        <div className="flex items-center gap-2 mt-4 text-xs">
                                            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1"><i className="fa-solid fa-arrow-trend-up"></i> +12%</span>
                                            <span className="text-gray-400">from last month</span>
                                        </div>
                                    </div>
                                </div>

                                {/* TRANSACTIONS TABLE */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-base font-bold text-[#111827]">Transactions</h3>
                                        <i className="fa-solid fa-ellipsis text-gray-400 cursor-pointer"></i>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <tbody className="divide-y divide-gray-50">
                                                {bookings.slice(0, 5).map((rec, idx) => (
                                                    <tr key={rec.id_booking} className="group hover:bg-gray-50/50 transition">
                                                        <td className="py-4 w-12 text-center"><div className="w-10 h-10 bg-[#F4F6F5] rounded-full flex items-center justify-center text-gray-600"><i className="fa-solid fa-file-invoice"></i></div></td>
                                                        <td className="py-4 px-4">
                                                            <p className="font-bold text-sm text-[#111827]">{rec.paket_wisata?.nama_paket || 'Custom Order'}</p>
                                                            <p className="text-[11px] text-gray-500 mt-0.5">{rec.nama_lengkap} &middot; {rec.tanggal_trip}</p>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <span className="text-[#10291C] font-bold text-xs bg-[#D4F85A]/20 px-2.5 py-1 rounded">Pending</span>
                                                            <p className="text-[10px] text-gray-400 font-mono mt-1">ID:{rec.id_booking}</p>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {bookings.length === 0 && <tr><td colSpan="3" className="py-8 text-center text-sm text-gray-400">No recent transactions.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: KELOLA PAKET */}
                        {activeTab === 'paket' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-center mb-8">
                                    <div><h2 className="text-2xl font-bold text-[#111827]">Products</h2><p className="text-sm text-gray-500 mt-1">Manage your expedition catalog.</p></div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#F4F6F5] border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                            <tr><th className="p-4 w-16 text-center">ID</th><th className="p-4">Visual</th><th className="p-4">Product Info</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4 text-right pr-8">Action</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {packages.map((pkg, index) => (
                                                <tr key={pkg.id_paket} className="hover:bg-gray-50 transition">
                                                    <td className="p-4 text-center font-mono text-xs text-gray-400">{(index + 1).toString().padStart(2, '0')}</td>
                                                    <td className="p-4"><img src={pkg.gambar} alt="thumb" className="w-12 h-12 object-cover rounded-lg border border-gray-200" /></td>
                                                    <td className="p-4"><p className="font-bold text-[#111827] text-sm">{pkg.nama_paket}</p><p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">{pkg.deskripsi_singkat}</p></td>
                                                    <td className="p-4"><span className="bg-[#F4F6F5] border border-gray-200 text-gray-600 px-2.5 py-1 rounded text-[10px] font-bold uppercase">{pkg.kategori}</span></td>
                                                    <td className="p-4 font-bold text-[#111827] text-sm">Rp {pkg.harga.toLocaleString('id-ID')}</td>
                                                    <td className="p-4 text-right pr-8">
                                                        <div className="flex justify-end gap-3">
                                                            <button onClick={() => openEditModal(pkg)} className="text-gray-400 hover:text-[#10291C] transition"><i className="fa-regular fa-pen-to-square"></i></button>
                                                            <button onClick={() => deleteRecord('paket_wisata', 'id_paket', pkg.id_paket, 'Paket dihapus!')} className="text-gray-400 hover:text-red-500 transition"><i className="fa-regular fa-trash-can"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {packages.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-sm text-gray-400">No products available.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB: DATA BOOKING */}
                        {activeTab === 'booking' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-center mb-8">
                                    <div><h2 className="text-2xl font-bold text-[#111827]">Transactions</h2><p className="text-sm text-gray-500 mt-1">Review and manage client leads.</p></div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#F4F6F5] border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                            <tr><th className="p-5 w-16 text-center">ID</th><th className="p-5">Client Identity</th><th className="p-5">Order Details</th><th className="p-5">Value</th><th className="p-5 text-right pr-8">Action</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {bookings.map((data, index) => (
                                                <tr key={data.id_booking} className="hover:bg-gray-50 transition">
                                                    <td className="p-5 text-center font-mono font-medium text-gray-400 text-xs">#{String(index + 1).padStart(4, '0')}</td>
                                                    <td className="p-5"><p className="font-bold text-[#111827] text-sm">{data.nama_lengkap}</p><p className="text-xs text-gray-500 mt-1">{data.email}</p><p className="text-xs font-medium text-gray-600 mt-0.5">{data.nomor_wa}</p></td>
                                                    <td className="p-5"><p className="font-semibold text-sm text-[#10291C]">{data.paket_wisata?.nama_paket || 'Custom Order'}</p><div className="flex gap-2 mt-1.5"><span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{data.tanggal_trip}</span><span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{data.jumlah_pax} Pax</span></div></td>
                                                    <td className="p-5 font-bold text-[#111827] text-sm">Rp {data.total_harga.toLocaleString('id-ID')}</td>
                                                    <td className="p-5 text-right pr-8">
                                                        <div className="flex justify-end gap-4 items-center">
                                                            <a href={`https://wa.me/${data.nomor_wa}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition flex items-center gap-1.5"><i className="fa-brands fa-whatsapp"></i> Chat</a>
                                                            <button onClick={() => deleteRecord('data_booking', 'id_booking', data.id_booking, 'Lead dihapus!')} className="text-gray-400 hover:text-red-500 transition"><i className="fa-regular fa-trash-can"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {bookings.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-sm text-gray-400">No leads available.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB: KELOLA KATEGORI */}
                        {activeTab === 'kategori' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                                <div className="md:col-span-1">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                        <h3 className="font-bold text-lg text-[#111827] mb-6">Add Category</h3>
                                        <form onSubmit={handleAddKategori}>
                                            <div className="mb-6"><label className="block text-xs font-medium text-gray-500 mb-2">Category Name</label><input type="text" value={newKategori} onChange={(e) => setNewKategori(e.target.value)} required placeholder="Ex: Premium Trip" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                                            <button type="submit" className="w-full bg-[#10291C] hover:bg-[#1A3626] text-white font-medium py-3 rounded-xl transition">Save Category</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-[#F4F6F5] border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                                <tr><th className="p-5 w-16 text-center">ID</th><th className="p-5">Category Name</th><th className="p-5 text-right pr-8">Action</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {kategoriList.map((kat, index) => (
                                                    <tr key={kat.id} className="hover:bg-gray-50 transition">
                                                        <td className="p-5 text-center font-mono text-xs text-gray-400">{(index + 1).toString().padStart(2, '0')}</td>
                                                        <td className="p-5 font-medium text-[#111827] text-sm">{kat.nama}</td>
                                                        <td className="p-5 text-right pr-8"><button onClick={() => deleteRecord('kategori', 'id', kat.id, 'Kategori Dihapus')} className="text-gray-400 hover:text-red-500 transition"><i className="fa-regular fa-trash-can"></i></button></td>
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
                                <div className="flex justify-between items-center mb-8">
                                    <div><h2 className="text-2xl font-bold text-[#111827]">Customer Reviews</h2></div>
                                    <button onClick={() => setIsModalTestiOpen(true)} className="bg-[#10291C] hover:bg-[#1A3626] text-white font-medium px-5 py-2.5 rounded-full transition flex items-center gap-2 text-sm"><i className="fa-solid fa-plus"></i> Add Review</button>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#F4F6F5] border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                            <tr><th className="p-5 w-16 text-center">ID</th><th className="p-5 w-20">Profile</th><th className="p-5">Client</th><th className="p-5 w-1/3">Review Quote</th><th className="p-5 text-center">Score</th><th className="p-5 text-right pr-8">Action</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {testimoniList.map((data, index) => (
                                                <tr key={data.id} className="hover:bg-gray-50 transition">
                                                    <td className="p-5 text-center font-mono text-xs text-gray-400">{(index + 1).toString().padStart(2, '0')}</td>
                                                    <td className="p-5"><img src={data.foto} alt="klien" className="w-10 h-10 object-cover rounded-full border border-gray-100" /></td>
                                                    <td className="p-5"><p className="font-medium text-[#111827] text-sm">{data.nama}</p><p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{data.asal}</p></td>
                                                    <td className="p-5 text-gray-500 text-sm font-light italic">"{data.ulasan}"</td>
                                                    <td className="p-5 text-center text-[#D4F85A] text-xs">{[...Array(parseInt(data.rating) || 5)].map((_, i) => <i key={i} className="fa-solid fa-star drop-shadow-sm"></i>)}</td>
                                                    <td className="p-5 text-right pr-8"><button onClick={() => deleteRecord('testimoni', 'id', data.id, 'Testimoni dihapus!')} className="text-gray-400 hover:text-red-500 transition"><i className="fa-regular fa-trash-can"></i></button></td>
                                                </tr>
                                            ))}
                                            {testimoniList.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-sm text-gray-400">No reviews found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB: PENGATURAN WEB */}
                        {activeTab === 'pengaturan' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-4xl animate-fade-in">
                                <div className="mb-8 border-b border-gray-100 pb-6"><h2 className="text-2xl font-bold text-[#111827]">General Settings</h2><p className="text-gray-500 text-sm mt-1">Manage global properties for your storefront.</p></div>
                                <form onSubmit={handleSavePengaturan}>
                                    <h3 className="font-bold text-[#10291C] mb-5 text-sm uppercase tracking-wider">Business Identity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div><label className="block text-xs font-medium text-gray-500 mb-2">Brand Name</label><input type="text" value={settings.brand_name || ''} onChange={e => setSettings({ ...settings, brand_name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                                        <div><label className="block text-xs font-medium text-gray-500 mb-2">WhatsApp Number</label><input type="text" value={settings.nomor_wa || ''} onChange={e => setSettings({ ...settings, nomor_wa: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                                    </div>
                                    <div className="mb-6"><label className="block text-xs font-medium text-gray-500 mb-2">Support Email</label><input type="email" value={settings.email || ''} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                                    <div className="mb-10"><label className="block text-xs font-medium text-gray-500 mb-2">Office Address</label><textarea rows="3" value={settings.alamat || ''} onChange={e => setSettings({ ...settings, alamat: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm"></textarea></div>

                                    <h3 className="font-bold text-[#10291C] mb-5 text-sm uppercase tracking-wider">Social Media</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                        <div><label className="block text-xs font-medium text-gray-500 mb-2">Instagram URL</label><input type="text" value={settings.instagram || ''} onChange={e => setSettings({ ...settings, instagram: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                                        <div><label className="block text-xs font-medium text-gray-500 mb-2">Facebook URL</label><input type="text" value={settings.facebook || ''} onChange={e => setSettings({ ...settings, facebook: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                                    </div>
                                    <div className="flex justify-end pt-6 border-t border-gray-100">
                                        <button type="submit" className="bg-[#10291C] hover:bg-[#1A3626] text-white font-medium px-8 py-3 rounded-xl transition">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

        {/* ================= CUSTOM CONFIRMATION DIALOG (MODERN) ================= */}
        {confirmDialog.isOpen && (
            <div className="fixed inset-0 bg-[#0A1610]/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center border border-gray-100 animate-fade-in">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 ${confirmDialog.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-[#10291C]'}`}>
                        <i className={`fa-solid text-2xl ${confirmDialog.type === 'danger' ? 'fa-trash-can' : 'fa-right-from-bracket'}`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-[#111827] mb-3">{confirmDialog.title}</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">{confirmDialog.message}</p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} 
                            className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition text-sm"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={confirmDialog.action} 
                            className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition text-sm ${confirmDialog.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20' : 'bg-[#10291C] hover:bg-[#1A3626] shadow-md shadow-[#10291C]/20'}`}
                        >
                            Ya, Lanjutkan
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* ================= MODAL: FORM PAKET ================= */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-[#0A1610]/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-100">
                    <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                        <div><h3 className="font-bold text-xl text-[#111827]">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3><p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">{isEditMode ? `ID: #${editPackageId}` : 'Database Input'}</p></div>
                        <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-[#111827] rounded-full flex items-center justify-center transition"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <form onSubmit={handleSavePackage} className="p-10">
                        <h4 className="font-bold text-[#10291C] mb-4 text-sm uppercase tracking-wider">1. Master Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Package Name</label><input type="text" value={newPackage.nama_paket} onChange={e => setNewPackage({ ...newPackage, nama_paket: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Category</label><select value={newPackage.kategori} onChange={e => setNewPackage({ ...newPackage, kategori: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm">{kategoriList.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}<option value="Lainnya">Lainnya...</option></select></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Duration</label><input type="text" value={newPackage.durasi} onChange={e => setNewPackage({ ...newPackage, durasi: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Price (Rp)</label><input type="text" value={newPackage.harga} onChange={e => setNewPackage({ ...newPackage, harga: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                        </div>
                        <div className="mb-6"><label className="block text-xs font-medium text-gray-500 mb-2">Short Summary</label><textarea rows="2" value={newPackage.deskripsi_singkat} onChange={e => setNewPackage({ ...newPackage, deskripsi_singkat: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm"></textarea></div>
                        <div className="mb-10"><label className="block text-xs font-medium text-gray-500 mb-2">Full Description</label><textarea rows="4" value={newPackage.deskripsi_lengkap} onChange={e => setNewPackage({ ...newPackage, deskripsi_lengkap: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm"></textarea></div>

                        <h4 className="font-bold text-[#10291C] mb-4 text-sm uppercase tracking-wider">2. Facilities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Included</label><textarea rows="3" value={newPackage.fasilitas_include} onChange={e => setNewPackage({ ...newPackage, fasilitas_include: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm"></textarea></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Excluded</label><textarea rows="3" value={newPackage.fasilitas_exclude} onChange={e => setNewPackage({ ...newPackage, fasilitas_exclude: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm"></textarea></div>
                        </div>

                        <h4 className="font-bold text-[#10291C] mb-4 text-sm uppercase tracking-wider">3. Visual Media</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bg-[#F4F6F5] p-6 rounded-2xl border border-gray-200"><label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">Thumbnail Cover</label><input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-[#10291C] file:text-white cursor-pointer bg-white border border-gray-200 rounded-lg p-1" />{isEditMode && existingThumbnailUrl && !thumbnailFile && <p className="text-[10px] text-gray-400 mt-2 italic">*Current photo is preserved.</p>}</div>
                            <div className="bg-[#F4F6F5] p-6 rounded-2xl border border-gray-200"><label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">Gallery Slider</label><input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(Array.from(e.target.files))} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-gray-200 file:text-gray-700 cursor-pointer bg-white border border-gray-200 rounded-lg p-1" /></div>
                        </div>

                        <div className="flex justify-between items-end border-b border-gray-100 pb-3 mb-5">
                            <h4 className="font-bold text-[#10291C] text-sm uppercase tracking-wider">4. Itinerary Timeline</h4>
                            <button type="button" onClick={() => setItineraries([...itineraries, { hari_ke: itineraries.length + 1, judul_kegiatan: '', detail_kegiatan: '' }])} className="text-sm font-medium text-[#10291C] hover:text-[#D4F85A] transition"><i className="fa-solid fa-plus mr-1"></i> Add Day</button>
                        </div>
                        <div className="mb-10 space-y-4">
                            {itineraries.map((itin, index) => (
                                <div key={index} className="bg-white p-5 rounded-2xl border border-gray-200 relative group shadow-sm">
                                    {itineraries.length > 1 && <button type="button" onClick={() => setItineraries(itineraries.filter((_, i) => i !== index).map((it, idx) => ({ ...it, hari_ke: idx + 1 })))} className="absolute -top-3 -right-3 w-7 h-7 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"><i className="fa-solid fa-xmark text-xs"></i></button>}
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Day</label><input type="number" value={itin.hari_ke} readOnly className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-center font-bold outline-none text-gray-500" /></div>
                                        <div className="col-span-10"><label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Title</label><input type="text" required value={itin.judul_kegiatan} onChange={(e) => { const newItin = [...itineraries]; newItin[index].judul_kegiatan = e.target.value; setItineraries(newItin); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#10291C] text-sm" /></div>
                                        <div className="col-span-12"><label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Description</label><textarea required rows="2" value={itin.detail_kegiatan} onChange={(e) => { const newItin = [...itineraries]; newItin[index].detail_kegiatan = e.target.value; setItineraries(newItin); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#10291C] text-sm"></textarea></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-sm pt-5 border-t border-gray-100">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition text-sm">Cancel</button>
                            <button type="submit" className="bg-[#10291C] hover:bg-[#1A3626] text-white px-8 py-3 rounded-xl font-medium transition text-sm">{isEditMode ? 'Save Changes' : 'Publish Product'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* ================= MODAL: TAMBAH TESTIMONI ================= */}
        {isModalTestiOpen && (
            <div className="fixed inset-0 bg-[#0A1610]/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in border border-gray-100">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg text-[#111827]">Add Review</h3><button onClick={() => setIsModalTestiOpen(false)} className="w-8 h-8 bg-gray-50 text-gray-400 hover:text-[#111827] rounded-full flex items-center justify-center"><i className="fa-solid fa-xmark"></i></button></div>
                    <form onSubmit={handleSaveTestimoni} className="p-8">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Client Name</label><input type="text" value={newTestimoni.nama} onChange={e => setNewTestimoni({ ...newTestimoni, nama: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-2">Location/Origin</label><input type="text" value={newTestimoni.asal} onChange={e => setNewTestimoni({ ...newTestimoni, asal: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" /></div>
                        </div>
                        <div className="mb-6"><label className="block text-xs font-medium text-gray-500 mb-2">Rating</label><select value={newTestimoni.rating} onChange={e => setNewTestimoni({ ...newTestimoni, rating: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm"><option value="5">5 Stars (Excellent)</option><option value="4">4 Stars (Good)</option><option value="3">3 Stars (Average)</option></select></div>
                        <div className="mb-6"><label className="block text-xs font-medium text-gray-500 mb-2">Review Quote</label><textarea rows="3" value={newTestimoni.ulasan} onChange={e => setNewTestimoni({ ...newTestimoni, ulasan: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm"></textarea></div>
                        <div className="mb-8"><label className="block text-xs font-medium text-gray-500 mb-2">Upload Photo (Optional)</label><input type="file" accept="image/*" onChange={e => setTestiFotoFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-gray-100 file:text-gray-700 cursor-pointer border border-gray-200 rounded-lg p-1" /></div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100"><button type="button" onClick={() => setIsModalTestiOpen(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl text-sm">Cancel</button><button type="submit" className="bg-[#10291C] hover:bg-[#1A3626] text-white px-8 py-3 rounded-xl font-medium text-sm">Save Review</button></div>
                    </form>
                </div>
            </div>
        )}
    </div>
);


};

export default Admin;