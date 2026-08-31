import React from 'react';

const AdminReviews = ({ testimoniList, setIsModalTestiOpen, deleteRecord }) => {
    return (
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
    );
};

export default AdminReviews;