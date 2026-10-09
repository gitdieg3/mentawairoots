import React from 'react';

const PackageCard = ({ pkg }) => {
    return (
        <div className="bg-white rounded-3xl border border-mentawaiDark/5 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-500 flex flex-col group relative">
            <div className="relative overflow-hidden h-72">
                <img src={pkg.gambar} alt={pkg.nama_paket} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-mentawaiDark/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-mentawaiMint uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-mentawaiMint"></span> {pkg.kategori}
                </div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] font-black text-mentawaiDark shadow-sm">
                    {pkg.durasi}
                </div>
            </div>
            <div className="p-8 flex flex-col flex-grow bg-white">
                <h3 className="font-serif font-semibold text-2xl mb-3 text-mentawaiDark leading-tight group-hover:text-mentawaiSage transition">{pkg.nama_paket}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3">{pkg.deskripsi_singkat}</p>

                <div className="mt-auto pt-6 border-t border-mentawaiDark/5 flex justify-between items-center">
                    <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Travel Investment</span>
                        <span className="font-black text-mentawaiSage text-xl">
                            {pkg.harga > 0 ? (
                                <>Rp {pkg.harga.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">/ pax</span></>
                            ) : (
                                <span className="text-lg italic">Booking Now</span>
                            )}
                        </span>
                    </div>
                    <a href={`/detail?id=${pkg.id_paket}`} className="bg-mentawaiDark hover:bg-mentawaiMint text-white hover:text-mentawaiDark px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-sm">
                        Details <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PackageCard;