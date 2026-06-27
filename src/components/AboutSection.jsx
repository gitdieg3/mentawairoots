import React from 'react';

const AboutSection = ({ settings }) => {
    return (
        <section id="about-us" className="py-24 px-6 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl z-10 border-4 border-white">
                            <img src="https://sltvfrfepmuvcmduhcgd.supabase.co/storage/v1/object/public/web_assets/Ucok.jpeg" alt="Sikerei Mentawai Pemandu" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                                <div>
                                    <p className="text-mentawaiMint text-xs font-bold uppercase tracking-widest mb-1">Indigenous Guide & Cultural Advisor</p>
                                    <h4 className="text-white text-2xl font-serif font-bold">Ucok Sinaga</h4>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-mentawaiDark text-white p-6 rounded-2xl shadow-xl z-20 max-w-[240px] border border-white/10 hidden md:block">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-mentawaiMint"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-mentawaiMint">100% Native</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-light">Guided personally by a native of Mentawai who upholds the age-old traditions of the Siberut forest.</p>
                        </div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-mentawaiMint/10 rounded-full blur-3xl z-0"></div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <p className="text-mentawaiMint font-bold text-xs uppercase tracking-widest mb-3">Meet the Protectors of the Forest</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-mentawaiDark leading-tight mb-6">About Us & Your Local Guide</h2>
                        <div className="space-y-6 text-gray-600 font-light leading-relaxed text-sm md:text-base">
                            <p>
                                Welcome to <strong className="text-mentawaiDark font-semibold">{settings.brand_name || 'Mentawai Roots'}</strong>. When i was a young boy living in north sumatra i once came across a newspaper cutting of two men in the jungle carrying a deer. Writen above was the words ANCIENT ISLAND TRIBE. I had no idea where it was but it fascinated me. At that time i was still in school and as young boys do i would day dream about going on an adventure to find the island tribe and go hunting in the jungle. one day after I finished school I left north sumatra and went to work in padang, west sumatra. .  finally i learned of an island 100 km west of padang where an ancient tribe lived and then i saw able to follow me dream and visit the mentawaiI ,i was so happy. </p>
                            <p>
                                Before I was a tour guide to the mentawai i worked at the mentawai foundation (ycm) for 2 years . I learned a lot about the customs of the mentawai tribe and studied there language. the mentawai language is very different from Indonesian.
                                By 1997 my name was published in Stefan loose travel as a guide in the mentawai.
                                I have now had many years of experience in the jungle with these beautiful calm and friendly people.
                            </p>
                            <p className="border-l-4 border-mentawaiMint pl-4 italic text-mentawaiSage bg-mentawaiSage/5 py-3 rounded-r-xl">
                               "Every rupiah you spend on this expedition goes directly to support the economy of indigenous tribal families, the education of tribal children, and the conservation of Siberut's natural environment."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-mentawaiDark/5">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-mentawaiMint/15 text-mentawaiSage flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-heart text-sm"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-mentawaiDark text-sm mb-1">Ethical Travel</h4>
                                    <p className="text-xs text-gray-500">A visit that respects customs and privacy, and does not alter the indigenous tribe's way of life.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-mentawaiMint/15 text-mentawaiSage flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-shield-halved text-sm"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-mentawaiDark text-sm mb-1">Shipment Security</h4>
                                    <p className="text-xs text-gray-500">We prioritize standard safety procedures and will guide you in preparing your gear and personal essentials to ensure the expedition remains safe and comfortable.</p>
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