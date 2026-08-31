import React from 'react';

const AdminProducts = ({ packages, openEditModal, deleteRecord }) => {
    return (
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
    );
};

export default AdminProducts;