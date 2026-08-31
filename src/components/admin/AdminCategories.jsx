import React from 'react';

const AdminCategories = ({ kategoriList, newKategori, setNewKategori, handleAddKategori, deleteRecord }) => {
    return (
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
    );
};

export default AdminCategories;