import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useGlobal } from '../GlobalContext';

// Import komponen modular per fitur
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminTransactions from '../components/admin/AdminTransactions';
import AdminReviews from '../components/admin/AdminReviews';
import AdminSettings from '../components/admin/AdminSettings';
import PackageModal from '../components/admin/PackageModal';
import ReviewModal from '../components/admin/ReviewModal';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    const { showToast } = useGlobal();

    const [bookings, setBookings] = useState([]);
    const [packages, setPackages] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [testimoniList, setTestimoniList] = useState([]);
    const [mediaList, setMediaList] = useState([]); 
    const [settings, setSettings] = useState({ id: null, brand_name: '', nomor_wa: '', email: '', alamat: '', instagram: '', facebook: '' });

    const [newMedia, setNewMedia] = useState({ tipe: 'photo', judul: '', subjudul: '', deskripsi: '' });
    const [mediaFile, setMediaFile] = useState(null);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null, type: 'danger' });

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
            const [bData, pData, kData, tData, sData, mData] = await Promise.all([
                supabase.from('data_booking').select('*, paket_wisata(nama_paket)').order('tanggal_pesan', { ascending: false }),
                supabase.from('paket_wisata').select('*').order('nama_paket', { ascending: true }),
                supabase.from('kategori').select('*').order('id', { ascending: true }),
                supabase.from('testimoni').select('*').order('id', { ascending: false }),
                supabase.from('pengaturan_web').select('*').limit(1),
                supabase.from('media_kegiatan').select('*').order('id', { ascending: false })
            ]);

            setBookings(bData.data || []);
            setPackages(pData.data || []);
            setKategoriList(kData.data || []);
            setTestimoniList(tData.data || []);
            setMediaList(mData.data || []);

            if (sData.data && sData.data.length > 0) {
                setSettings(sData.data[0]);
            }
        } catch (error) {
            showToast("Gagal memuat data dari database.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSaveMedia = async (e) => {
        e.preventDefault();
        if (!mediaFile) {
            showToast("Harap pilih file (Gambar/Video) untuk diunggah.", "error");
            return;
        }

        setIsUploadingMedia(true);
        try {
            const fileExt = mediaFile.name.split('.').pop();
            const fileName = `media_${newMedia.tipe}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('wisata_media').upload(`dokumentasi/${fileName}`, mediaFile);
            if (uploadError) throw uploadError;

            const url_media = supabase.storage.from('wisata_media').getPublicUrl(`dokumentasi/${fileName}`).data.publicUrl;

            const { error: dbError } = await supabase.from('media_kegiatan').insert([{
                tipe: newMedia.tipe,
                judul: newMedia.judul,
                subjudul: newMedia.subjudul,
                deskripsi: newMedia.deskripsi,
                url_media: url_media
            }]);

            if (dbError) throw dbError;

            showToast(`Media ${newMedia.tipe} berhasil dipublikasikan!`, "success");
            setNewMedia({ tipe: 'photo', judul: '', subjudul: '', deskripsi: '' });
            setMediaFile(null);
            document.getElementById('media_file_input').value = '';
            fetchData();
        } catch (error) {
            showToast("Gagal unggah media: " + error.message, "error");
        } finally {
            setIsUploadingMedia(false);
        }
    };

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

    const deleteRecord = (table, colId, id, message) => {
        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'Hapus Data',
            message: 'Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Lanjutkan menghapus data?',
            action: async () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                const { error } = await supabase.from(table).delete().eq(colId, id);
                if (!error) { showToast(message, "success"); fetchData(); }
                else showToast("Gagal menghapus data.", "error");
            }
        });
    };

    const handleLogout = () => {
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
    const formatRupiah = (angka) => '$ ' + (angka / 15000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: 'fa-border-all' },
        { id: 'paket', label: 'Products', icon: 'fa-box' },
        { id: 'kategori', label: 'Categories', icon: 'fa-layer-group' },
        { id: 'booking', label: 'Transactions', icon: 'fa-file-invoice-dollar' },
        { id: 'testimoni', label: 'Reviews', icon: 'fa-comment-dots' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#F4F6F5] text-[#111827] font-sans selection:bg-[#D4F85A] selection:text-[#0A1610]">
            {/* SIDEBAR */}
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
                            {activeTab === 'dashboard' && <AdminDashboard bookings={bookings} totalRevenue={totalRevenue} formatRupiah={formatRupiah} setActiveTab={setActiveTab} />}
                            {activeTab === 'paket' && <AdminProducts packages={packages} openEditModal={openEditModal} deleteRecord={deleteRecord} />}
                            {activeTab === 'booking' && <AdminTransactions bookings={bookings} deleteRecord={deleteRecord} />}
                            {activeTab === 'kategori' && <AdminCategories kategoriList={kategoriList} newKategori={newKategori} setNewKategori={setNewKategori} handleAddKategori={handleAddKategori} deleteRecord={deleteRecord} />}
                            {activeTab === 'testimoni' && <AdminReviews testimoniList={testimoniList} setIsModalTestiOpen={setIsModalTestiOpen} deleteRecord={deleteRecord} />}
                            {activeTab === 'pengaturan' && <AdminSettings settings={settings} setSettings={setSettings} handleSavePengaturan={handleSavePengaturan} newMedia={newMedia} setNewMedia={setNewMedia} mediaFile={mediaFile} setMediaFile={setMediaFile} isUploadingMedia={isUploadingMedia} handleSaveMedia={handleSaveMedia} mediaList={mediaList} deleteRecord={deleteRecord} />}
                        </>
                    )}
                </div>
            </div>

            {/* CONFIRMATION DIALOG */}
            {confirmDialog.isOpen && (
                <div className="fixed inset-0 bg-[#0A1610]/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center border border-gray-100 animate-fade-in">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 ${confirmDialog.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-[#10291C]'}`}>
                            <i className={`fa-solid text-2xl ${confirmDialog.type === 'danger' ? 'fa-trash-can' : 'fa-right-from-bracket'}`}></i>
                        </div>
                        <h3 className="text-xl font-bold text-[#111827] mb-3">{confirmDialog.title}</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">{confirmDialog.message}</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition text-sm">Batal</button>
                            <button onClick={confirmDialog.action} className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition text-sm ${confirmDialog.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#10291C] hover:bg-[#1A3626]'}`}>Ya, Lanjutkan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}
            <PackageModal 
                isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} 
                isEditMode={isEditMode} editPackageId={editPackageId} 
                newPackage={newPackage} setNewPackage={setNewPackage} 
                kategoriList={kategoriList} thumbnailFile={thumbnailFile} 
                setThumbnailFile={setThumbnailFile} existingThumbnailUrl={existingThumbnailUrl} 
                setGalleryFiles={setGalleryFiles} itineraries={itineraries} 
                setItineraries={setItineraries} handleSavePackage={handleSavePackage} 
            />

            <ReviewModal 
                isModalTestiOpen={isModalTestiOpen} setIsModalTestiOpen={setIsModalTestiOpen} 
                newTestimoni={newTestimoni} setNewTestimoni={setNewTestimoni} 
                setTestiFotoFile={setTestiFotoFile} handleSaveTestimoni={handleSaveTestimoni} 
            />
        </div>
    );
};

export default Admin;