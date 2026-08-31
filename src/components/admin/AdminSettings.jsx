import React from 'react';

const AdminSettings = ({ 
    settings, setSettings, handleSavePengaturan, 
    newMedia, setNewMedia, mediaFile, setMediaFile, isUploadingMedia, handleSaveMedia, mediaList, deleteRecord 
}) => {
    return (
        <div className="animate-fade-in space-y-8">
            {/* CARD 1: GENERAL SETTINGS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-4xl">
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

            {/* CARD 2: KELOLA MEDIA DOKUMENTASI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-4xl">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold text-[#111827]">Media Gallery Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Unggah foto dan video dokumentasi untuk ditampilkan di beranda.</p>
                </div>

                <form onSubmit={handleSaveMedia} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-[#10291C] mb-4 text-sm uppercase tracking-wider">Unggah Media Baru</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Tipe Media</label>
                            <select value={newMedia.tipe} onChange={e => setNewMedia({ ...newMedia, tipe: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm">
                                <option value="photo">Foto Dokumentasi</option>
                                <option value="video">Video Dokumentasi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Pilih File (Maks. 10MB disarankan)</label>
                            <input type="file" id="media_file_input" accept={newMedia.tipe === 'photo' ? 'image/*' : 'video/*'} onChange={e => setMediaFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-[#10291C] file:text-white cursor-pointer bg-white border border-gray-200 rounded-xl p-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Judul Media</label>
                            <input type="text" value={newMedia.judul} onChange={e => setNewMedia({ ...newMedia, judul: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" placeholder="Contoh: Menombak Ikan" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Sub-Judul / Label</label>
                            <input type="text" value={newMedia.subjudul} onChange={e => setNewMedia({ ...newMedia, subjudul: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" placeholder="Contoh: Kehidupan Asli Mentawai" />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs font-medium text-gray-500 mb-2">Deskripsi Singkat (Tampil di pop-up)</label>
                        <input type="text" value={newMedia.deskripsi} onChange={e => setNewMedia({ ...newMedia, deskripsi: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" placeholder="Jelaskan sedikit tentang momen ini..." />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isUploadingMedia} className="bg-[#D4F85A] hover:bg-[#c2e846] text-[#0A1610] font-bold px-8 py-3 rounded-xl transition flex items-center gap-2">
                            {isUploadingMedia ? <><i className="fa-solid fa-spinner fa-spin"></i> Mengunggah...</> : <><i className="fa-solid fa-upload"></i> Unggah & Publikasikan</>}
                        </button>
                    </div>
                </form>

                <h3 className="font-bold text-[#111827] mb-4">Daftar Media Publik</h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr><th className="p-4 w-16 text-center">Tipe</th><th className="p-4">Visual</th><th className="p-4">Info Media</th><th className="p-4 text-right pr-6">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mediaList.map((media) => (
                                <tr key={media.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 text-center">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs ${media.tipe === 'photo' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}>
                                            <i className={`fa-solid ${media.tipe === 'photo' ? 'fa-image' : 'fa-video'}`}></i>
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {media.tipe === 'photo' ? (
                                            <img src={media.url_media} className="w-16 h-10 object-cover rounded-md border border-gray-200" alt="media" />
                                        ) : (
                                            <div className="w-16 h-10 bg-black flex items-center justify-center rounded-md border border-gray-200"><i className="fa-solid fa-play text-white text-xs"></i></div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-[#111827] text-sm">{media.judul}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{media.subjudul}</p>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <button onClick={() => deleteRecord('media_kegiatan', 'id', media.id, 'Media berhasil dihapus!')} className="text-gray-400 hover:text-red-500 transition">
                                            <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {mediaList.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-sm text-gray-400">Belum ada media yang diunggah.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;