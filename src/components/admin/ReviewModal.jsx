import React from 'react';

const ReviewModal = ({ 
    isModalTestiOpen, setIsModalTestiOpen, 
    newTestimoni, setNewTestimoni, setTestiFotoFile, handleSaveTestimoni 
}) => {
    if (!isModalTestiOpen) return null;

    return (
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
    );
};

export default ReviewModal;