import React from 'react';

const AboutSection = ({ settings }) => {
    return (
        <section id="about-us" className="py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* BAGIAN GAMBAR */}
                    <div className="lg:col-span-5 relative mb-12 lg:mb-0">
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl z-10 border-4 border-white">
                            <img 
                                src="https://sltvfrfepmuvcmduhcgd.supabase.co/storage/v1/object/public/web_assets/Ucok.jpeg" 
                                alt="Ucok Sinaga - Mentawai Guide" 
                                className="w-full h-full object-cover" 
                            />
                            {/* PERBAIKAN: Tambahkan `pb-28` di mobile agar teks nama naik dan tidak tertutup badge */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 pb-28 md:p-8 md:pb-8">
                                <div>
                                    <p className="text-mentawaiMint text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">
                                        Indigenous Guide & Cultural Advisor
                                    </p>
                                    <h4 className="text-white text-2xl md:text-3xl font-serif font-bold">Ucok Sinaga</h4>
                                </div>
                            </div>
                        </div>
                        
                        {/* PERBAIKAN BADGE: Lebar disesuaikan dan digeser sedikit agar proporsional di HP */}
                        <div className="absolute -bottom-8 right-2 sm:right-6 md:-right-6 bg-mentawaiDark text-white p-5 md:p-6 rounded-2xl shadow-xl z-20 w-[80%] sm:max-w-[260px] border border-white/10">
                            <div className="flex items-center gap-2 md:gap-3 mb-2">
                                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-mentawaiMint animate-pulse"></span>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-mentawaiMint">100% Native</span>
                            </div>
                            <p className="text-[11px] md:text-xs text-white/80 leading-relaxed font-light">
                                Guided personally by a native of Mentawai who upholds the ancient traditions of the Siberut forest.
                            </p>
                        </div>
                        
                        <div className="absolute -top-10 -left-10 w-32 h-32 md:w-40 md:h-40 bg-mentawaiMint/20 rounded-full blur-3xl z-0"></div>
                    </div>

                    {/* BAGIAN TEKS CERITA */}
                    <div className="lg:col-span-7 flex flex-col justify-center mt-6 md:mt-0">
                        <p className="text-mentawaiMint font-bold text-[10px] md:text-xs uppercase tracking-widest mb-2 md:mb-3">
                            Meet the Protector of the Forest
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-mentawaiDark leading-tight mb-6">
                            About Us & Your Local Guide
                        </h2>
                        
                        <div className="space-y-5 text-gray-600 font-light leading-relaxed text-[13px] md:text-sm text-justify">
                            <p>
                                Welcome to <strong className="text-mentawaiDark font-semibold">{settings.brand_name || 'Mentawai Roots'}</strong>. 
                                When I was a young boy living in North Sumatra, I came across a newspaper clipping of two men in the jungle carrying a deer. Above it read: <em>"Ancient Island Tribe."</em> I had no idea where it was, but it fascinated me. I would daydream about going on an adventure to find this tribe and explore the jungle.
                            </p>
                            <p>
                                After finishing school, I moved to Padang, West Sumatra. There, I finally learned of an island 100 kilometers west of Padang where an ancient tribe lived. I was able to follow my dream and visit Mentawai—I was overjoyed.
                            </p>
                            <p>
                                Before becoming a tour guide, I worked at the Mentawai Foundation (YCM) for two years. I learned deeply about the customs of the Mentawai tribe and studied their language, which is vastly different from Indonesian. By 1997, my name was published in <em>Stefan Loose Travel</em> as a recommended guide in Mentawai. I have spent many years in the jungle, building a strong bond with these beautiful, calm, and friendly people.
                            </p>
                            
                            <p className="border-l-4 border-mentawaiMint pl-4 italic text-slate-700 bg-slate-50 py-3 rounded-r-xl mt-6 text-sm font-medium">
                               "Every rupiah you spend on this expedition goes directly to support the economy of indigenous tribal families, the education of tribal children, and the conservation of Siberut's natural environment."
                            </p>
                        </div>

                        {/* FITUR / VALUE PROPOSITION */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-mentawaiDark/5">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-mentawaiMint/15 text-emerald-700 flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-heart text-sm"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-mentawaiDark text-sm mb-1">Ethical Travel</h4>
                                    <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed">A visit that respects customs and privacy, ensuring we do not alter the indigenous tribe's authentic way of life.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-mentawaiMint/15 text-emerald-700 flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-shield-halved text-sm"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-mentawaiDark text-sm mb-1">Expedition Safety</h4>
                                    <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed">We prioritize strict safety procedures and will guide you in preparing your gear to ensure a secure and comfortable journey.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;