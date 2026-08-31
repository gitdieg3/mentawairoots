import React from 'react';

const AdminDashboard = ({ bookings, totalRevenue, formatRupiah, setActiveTab }) => {
    return (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#10291C] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4F85A] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                    <div>
                        <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4 border border-red-500/20">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span> Update
                        </span>
                        <p className="text-xs text-gray-400 font-medium mb-1">Feb 12th 2024</p>
                        <h3 className="text-lg font-medium leading-snug">Sales revenue increased <br /><span className="text-[#D4F85A] font-bold">40%</span> in 1 week</h3>
                    </div>
                    <button onClick={() => setActiveTab('booking')} className="text-sm text-[#D4F85A] font-medium text-left mt-6 flex items-center gap-1 hover:gap-2 transition-all">See Statistics <i className="fa-solid fa-arrow-right text-xs"></i></button>
                </div>

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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-[#111827]">Transactions</h3>
                    <i className="fa-solid fa-ellipsis text-gray-400 cursor-pointer"></i>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-gray-50">
                            {bookings.slice(0, 5).map((rec) => (
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
    );
};

export default AdminDashboard;