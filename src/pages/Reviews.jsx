import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';


const Reviews = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="bg-[#FAF8F5] min-h-screen flex flex-col">

            <main className="flex-grow pt-32 pb-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <p className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-3">Unfiltered Experiences</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6">
                            Traveler Stories
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-light">
                            Read authentic experiences from those who have penetrated the interior of Siberut and conquered the Mentawai waves with us.
                        </p>
                    </div>

                    {/* Daftar Kartu Testimoni (Tanpa tombol filter & tanpa badge kategori di card) */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-emerald-700 font-medium animate-pulse">
                            <i className="fa-solid fa-compass fa-spin mr-3 text-xl"></i> Loading traveler stories...
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center text-slate-400 py-20 bg-white rounded-2xl border border-slate-100">
                            No reviews available to display.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((testi) => {
                                const ratingCount = parseInt(testi.rating) || 5;

                                return (
                                    <div 
                                        key={testi.id} 
                                        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full group"
                                    >
                                        {/* Bintang Rating (Kategori sudah dihapus bersih) */}
                                        <div className="flex items-center mb-6">
                                            <div className="flex text-yellow-500 text-xs gap-1">
                                                {[...Array(ratingCount)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                                                {[...Array(5 - ratingCount)].map((_, i) => <i key={i + ratingCount} className="fa-regular fa-star"></i>)}
                                            </div>
                                        </div>
                                        
                                        {/* Isi Ulasan */}
                                        <div className="flex-grow mb-8">
                                            <p className="text-slate-600 font-light leading-relaxed text-sm text-justify">
                                                "{testi.ulasan}"
                                            </p>
                                        </div>

                                        {/* Bagian Profil User */}
                                        <div className="flex items-center gap-4 border-t border-slate-50 pt-6 mt-auto">
                                            {testi.foto ? (
                                                <img 
                                                    src={testi.foto} 
                                                    alt={testi.nama} 
                                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-slate-100"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-sm flex-shrink-0">
                                                    {getInitials(testi.nama)}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{testi.nama}</h4>
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{testi.asal || 'Traveler'}</span>
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