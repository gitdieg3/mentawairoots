import React, { useState } from 'react';
import { useGlobal } from '../GlobalContext';

const ContactSection = () => {
    const { settings } = useGlobal();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Data Integrasi dari Admin Settings
    const contactEmail = settings?.email || 'mentawaitribebooking@gmail.com';
    const contactPhone = settings?.nomor_wa || '+62 812-3456-7890';
    const contactAddress = settings?.alamat || 'Mentawai Islands, West Sumatra, Indonesia';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWAOrder = (e) => {
        e.preventDefault();

        let phone = settings?.nomor_wa || '628126774808';
        phone = phone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);

        const message = `Hello Mentawai Roots!\n\nI have an inquiry from the website:\n\n` +
            `*Name:* ${formData.name}\n` +
            `*Email:* ${formData.email}\n` +
            `*WhatsApp:* ${formData.phone}\n\n` +
            `*Message:*\n${formData.message}\n\n` +
            `Looking forward to hearing from you. Thank you!`;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');

        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 4000);
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <section id="contact-section" className="w-full bg-[#FAF8F5] font-sans text-slate-800 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Judul */}
                <header className="text-center mb-12">
                    <p className="text-[10px] font-bold text-mentawaiSage uppercase tracking-widest mb-2">
                        Need Assistance?
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-mentawaiDark mb-3 tracking-tight">
                        Get In Touch
                    </h2>
                    <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                        Ready to plan your Mentawai expedition? Submit your queries here and our local team will assist you directly via WhatsApp.
                    </p>
                </header>

                {/* Grid Layout: Kiri (Info & Map) - Kanan (Form) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* BAGIAN KIRI: Kontak & Peta */}
                    <div className="flex flex-col gap-8">

                        {/* Box Info Kontak */}
                        <div className="bg-mentawaiDark text-white p-8 rounded-xl shadow-lg border border-mentawaiDark/20 flex flex-col justify-between">
                            <h3 className="text-xl font-serif font-bold mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-mentawaiMint/20 text-mentawaiMint flex items-center justify-center flex-shrink-0">
                                        <i className="fa-brands fa-whatsapp text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-mentawaiMint font-bold mb-1">WhatsApp / Call</p>
                                        <p className="text-sm font-medium">{contactPhone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-mentawaiMint/20 text-mentawaiMint flex items-center justify-center flex-shrink-0">
                                        <i className="fa-regular fa-envelope text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-mentawaiMint font-bold mb-1">Email Address</p>
                                        <p className="text-sm font-medium break-all">{contactEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-mentawaiMint/20 text-mentawaiMint flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-location-dot text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-mentawaiMint font-bold mb-1">Basecamp</p>
                                        <p className="text-sm font-medium leading-relaxed pr-4">{contactAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media di dalam Box Kontak */}
                            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
                                <a href={settings?.facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-mentawaiMint hover:text-mentawaiDark transition">
                                    <i className="fa-brands fa-facebook-f text-sm"></i>
                                </a>
                                <a href={settings?.instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-mentawaiMint hover:text-mentawaiDark transition">
                                    <i className="fa-brands fa-instagram text-sm"></i>
                                </a>
                                <a
                                    href="https://www.tripadvisor.co.id/Attraction_Review-g297726-d26613911-Reviews-Mentawai_Tribe-Padang_West_Sumatra_Sumatra.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TripAdvisor"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-mentawaiMint hover:text-mentawaiDark transition text-xs font-bold"
                                >
                                    <i className="fa-solid fa-star text-mentawaiGold"></i>
                                    <span>TripAdvisor</span>
                                </a>
                            </div>
                        </div>

                        {/* Google Maps (Kompak di bawah Info) */}
                        <div className="w-full h-[260px] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative group">
                            <iframe
                                title="Mentawai Roots Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.268298716335!2d100.3846!3d-0.9572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b928f6d72dfb%3A0x8677c7ecbf42dd9a!2sPadang%2C%20Padang%20City%2C%20West%20Sumatra!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                                className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition duration-700"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>

                    {/* BAGIAN KANAN: Formulir */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                        <h3 className="text-2xl font-serif font-bold text-mentawaiDark mb-6">Send a Message</h3>

                        {isSubmitted && (
                            <div className="mb-6 p-4 rounded-lg bg-mentawaiMint/20 border border-mentawaiMint text-mentawaiDark text-xs font-bold flex items-center gap-3 animate-fade-in">
                                <i className="fa-solid fa-circle-check text-mentawaiSage text-lg"></i>
                                Redirecting to WhatsApp...
                            </div>
                        )}

                        <form onSubmit={handleWAOrder} className="space-y-5 flex-grow flex flex-col">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className="w-full bg-[#FAF8F5] border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-mentawaiMint transition rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                        className="w-full bg-[#FAF8F5] border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-mentawaiMint transition rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                    WhatsApp Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <i className="fa-brands fa-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-mentawaiSage"></i>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+62 812 3456 7890"
                                        className="w-full bg-[#FAF8F5] border border-slate-200 pl-11 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-mentawaiMint transition rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex-grow">
                                <label htmlFor="message" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                    Message / Inquiry <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tell us about your expedition plans..."
                                    className="w-full h-[150px] bg-[#FAF8F5] border border-slate-200 p-4 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-mentawaiMint transition rounded-lg resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-mentawaiDark hover:bg-mentawaiSage text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-lg transition duration-300 shadow-md shadow-mentawaiDark/10 active:scale-95 flex items-center justify-center gap-2 mt-auto"
                            >
                                <i className="fa-brands fa-whatsapp text-mentawaiMint text-lg"></i>
                                Send via WhatsApp
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;