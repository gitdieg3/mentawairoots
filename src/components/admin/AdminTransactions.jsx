import React from 'react';

const AdminTransactions = ({ bookings, deleteRecord }) => {
    return (
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
    );
};

export default AdminTransactions;