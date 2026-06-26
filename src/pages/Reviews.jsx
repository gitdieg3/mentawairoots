import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Reviews = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('testimoni') 
                    .select('*');

                if (error) throw error;
                if (data) setTestimonials(data);
            } catch (error) {
                console.error('Error fetching reviews:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        let initials = parts[0][0];
        if (parts.length > 1) {
            initials += parts[parts.length - 1][0];
        }
        return initials.toUpperCase();
    };

    const getTripCategory = (text) => {
        const lowerText = (text || '').toLowerCase();
        if (lowerText.includes('ombak') || lowerText.includes('surf')) {
            return { id: 'SURF', label: 'SURF CAMP', color: 'bg-blue-50 text-blue-600' };
        }
        return { id: 'CULTURAL', label: 'CULTURAL TRIP', color: 'bg-mentawaiMint/15 text-mentawaiSage' };
    };

    const filteredTestimonials = testimonials.filter(testi => {
        if (activeFilter === 'ALL') return true;
        const cat = getTripCategory(testi.ulasan).id;
        return cat === activeFilter;
    });

    return (
        <div className="bg-[#FAF8F5] min-h-screen flex flex-col">
            <Navbar />

            {}
            <main className="flex-grow pt-32 pb-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="text-center mb-16">
                        <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Unfiltered Experiences</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-mentawaiDark mb-6">
                            Traveler Stories
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                            Membaca pengalaman otentik dari mereka yang telah menembus pedalaman Siberut dan menaklukkan ombak Mentawai bersama kami.
                        </p>
                    </div>

                    {}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {['ALL', 'CULTURAL', 'SURF'].map(filterType => (
                            <button 
                                key={filterType}
                                onClick={() => setActiveFilter(filterType)}
                                className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border ${activeFilter === filterType ? 'bg-mentawaiDark text-white border-mentawaiDark shadow-md' : 'bg-white text-mentawaiDark border-gray-200 hover:border-mentawaiDark'}`}
                            >
                                {filterType === 'ALL' ? 'All Reviews' : filterType === 'CULTURAL' ? 'Cultural Trips' : 'Surf Camps'}
                            </button>
                        ))}
                    </div>

                    {}
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-mentawaiMint font-bold animate-pulse">
                            <i className="fa-solid fa-compass fa-spin mr-3 text-xl"></i> Memuat cerita petualang...
                        </div>
                    ) : filteredTestimonials.length === 0 ? (
                        <div className="text-center text-gray-400 py-20 bg-white rounded-3xl border border-mentawaiDark/5">
                            Belum ada ulasan untuk ditampilkan.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTestimonials.map((testi) => {
                                const category = getTripCategory(testi.ulasan);
                                const ratingCount = parseInt(testi.rating) || 5;

                                return (
                                    <div 
                                        key={testi.id} 
                                        className="bg-white p-8 rounded-3xl border border-mentawaiDark/5 shadow-sm hover:shadow-xl transition duration-300 flex flex-col h-full group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex text-mentawaiGold text-xs gap-1">
                                                {[...Array(ratingCount)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                                                {[...Array(5 - ratingCount)].map((_, i) => <i key={i + ratingCount} className="fa-regular fa-star"></i>)}
                                            </div>
                                            <span className={`${category.color} text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded`}>
                                                {category.label}
                                            </span>
                                        </div>
                                        
                                        <div className="flex-grow mb-6">
                                            <p className="text-slate-600 font-light leading-relaxed text-sm italic text-justify">
                                                "{testi.ulasan}"
                                            </p>
                                        </div>

                                        {}
                                        <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
                                            {testi.foto ? (
                                                <img 
                                                    src={testi.foto} 
                                                    alt={testi.nama} 
                                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-slate-100 shadow-inner"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-[#0B2B20] text-mentawaiMint flex items-center justify-center font-serif font-bold text-lg shadow-inner flex-shrink-0">
                                                    {getInitials(testi.nama)}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{testi.nama}</h4>
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{testi.asal}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            
           
        </div>
    );
};

export default Reviews;