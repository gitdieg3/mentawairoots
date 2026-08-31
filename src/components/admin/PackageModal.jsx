import React from 'react';

const PackageModal = ({ 
    isModalOpen, setIsModalOpen, isEditMode, editPackageId, 
    newPackage, setNewPackage, kategoriList, 
    thumbnailFile, setThumbnailFile, existingThumbnailUrl, setGalleryFiles, 
    itineraries, setItineraries, handleSavePackage 
}) => {
    if (!isModalOpen) return null;

    return (
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
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Price (Rp) <span className="text-gray-400 font-light">(Opsional)</span></label>
                            <input type="text" value={newPackage.harga} onChange={e => setNewPackage({ ...newPackage, harga: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10291C] text-sm" placeholder="Kosongkan jika harga fleksibel" />
                        </div>
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
    );
};

export default PackageModal;