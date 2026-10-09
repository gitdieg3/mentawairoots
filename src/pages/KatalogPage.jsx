import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useGlobal } from '../GlobalContext';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const KatalogPage = () => {
    const navigate = useNavigate();
    
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [priceFilter, setPriceFilter] = useState('ALL');

    useEffect(() => {
  
        const fetchData = async () => {
            try {
                const [pkgRes, catRes] = await Promise.all([
                    supabase.from('paket_wisata').select('*').order('id_paket', { ascending: false }),
                    supabase.from('kategori').select('*').order('id', { ascending: true })
                ]);

                if (pkgRes.data) setPackages(pkgRes.data);
                if (catRes.data) setCategories(catRes.data);
            } catch (error) {
                console.error("Failed to fetch catalog data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter Logic
    const filteredPackages = useMemo(() => {
        return packages.filter(pkg => {
            // Keyword Match
            const matchesSearch = pkg.nama_paket?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  pkg.deskripsi_singkat?.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Category Match
            const matchesCategory = selectedCategory === 'ALL' || pkg.kategori === selectedCategory;

            // Price Range Match
            let matchesPrice = true;
            if (priceFilter === 'UNDER_2M') matchesPrice = pkg.harga < 2000000;
            else if (priceFilter === '2M_5M') matchesPrice = pkg.harga >= 2000000 && pkg.harga <= 5000000;
            else if (priceFilter === 'ABOVE_5M') matchesPrice = pkg.harga > 5000000;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [packages, searchTerm, selectedCategory, priceFilter]);

    return (
        
        <main className="bg-[#FAF8F5] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Title */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-mentawaiDark tracking-tight mb-4">
                        Expeditions & Packages
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                        Discover authentic journeys deep into the Mentawai jungle, legendary surfing waves, and exclusive eco-resort stays.
                    </p>
                </div>

                {/* Filter Box - Less Rounded */}
                <div className="bg-white rounded-xl shadow-sm border border-mentawaiDark/5 p-5 sm:p-7 mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* Search Input */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                <i className="fa-solid fa-magnifying-glass text-mentawaiMint"></i> Search Trip
                            </label>
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Type package name..." 
                                className="w-full bg-[#FAF8F5] border border-slate-200 text-sm font-semibold rounded-lg px-4 py-3 focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                <i className="fa-solid fa-layer-group text-mentawaiMint"></i> Category
                            </label>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-[#FAF8F5] border border-slate-200 text-sm font-semibold rounded-lg px-4 py-3 focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint cursor-pointer appearance-none"
                            >
                                <option value="ALL">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.nama}>{cat.nama}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                <i className="fa-solid fa-wallet text-mentawaiMint"></i> Price Range
                            </label>
                            <select 
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="w-full bg-[#FAF8F5] border border-slate-200 text-sm font-semibold rounded-lg px-4 py-3 focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint cursor-pointer appearance-none"
                            >
                                <option value="ALL">All Prices</option>
                                <option value="UNDER_2M">&lt; Rp 2.000.000</option>
                                <option value="2M_5M">Rp 2.000.000 - Rp 5.000.000</option>
                                <option value="ABOVE_5M">&gt; Rp 5.000.000</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading / Empty State / Grid */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 animate-pulse text-mentawaiDark">
                        <i className="fa-solid fa-compass fa-spin text-4xl mb-3 text-mentawaiMint"></i>
                        <p className="font-semibold text-sm">Aligning expedition routes...</p>
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-mentawaiDark/5 rounded-full flex items-center justify-center mx-auto mb-4 text-mentawaiDark text-2xl">
                            <i className="fa-solid fa-box-open"></i>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-slate-800 mb-1">No Packages Found</h3>
                        <p className="text-slate-500 text-sm mb-5">Try adjusting your keywords or resetting the search filters.</p>
                        <button onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); setPriceFilter('ALL'); }} className="px-6 py-2.5 bg-mentawaiDark hover:bg-mentawaiSage text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow">
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredPackages.map(pkg => (
                            <div key={pkg.id_paket} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                                <div>
                                    {/* Image Container - Less Rounded */}
                                    <div className="relative h-56 overflow-hidden bg-slate-100">
                                        <img src={pkg.gambar || 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35'} alt={pkg.nama_paket} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                        
                                        {/* Kategori Badge */}
                                        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-md shadow-lg">
                                            {pkg.kategori}
                                        </div>
                                        {/* Durasi Badge */}
                                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-mentawaiDark text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-md shadow-md">
                                            <i className="fa-regular fa-clock text-mentawaiSage mr-1"></i> {pkg.durasi}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-mentawaiSage transition line-clamp-2 leading-tight">
                                            {pkg.nama_paket}
                                        </h3>
                                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                            {pkg.deskripsi_singkat}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Card - Single "View Details" Button */}
                                <div className="p-6 pt-0 mt-auto">
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Start From</span>
                                            <div className="text-mentawaiDark font-black text-lg font-serif">
                                                {pkg.harga > 0 ? `Rp ${pkg.harga.toLocaleString('id-ID')}` : 'Ask Price'} <span className="text-[10px] text-slate-400 font-sans font-normal">/pax</span>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => navigate(`/detail?id=${pkg.id_paket}`)} 
                                            className="bg-mentawaiDark hover:bg-[#07261C] text-mentawaiMint text-xs font-bold px-5 py-2.5 rounded-lg shadow-md transition flex items-center gap-1.5 transform active:scale-95 uppercase tracking-wider"
                                        >
                                            <span>Details</span>
                                            <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default KatalogPage;