import React, { useState } from 'react';

// Fungsi helper langsung di dalam file (tidak perlu import dari ../utils/whatsapp)
const openWhatsApp = (phoneNumber, message = '') => {
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
    }
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
};

const FloatingWhatsApp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pesanCustom, setPesanCustom] = useState('');

    const nomorAdmin = '628126774808'; 

    const handleKirim = (e) => {
        e.preventDefault();
        const pesanDefault = pesanCustom.trim() || "Hello Admin, I would like to ask about Mentawai tour packages.";
        openWhatsApp(nomorAdmin, pesanDefault);
        setIsOpen(false);
        setPesanCustom('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="bg-[#0A1610] p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-[#D4F85A] text-[#0A1610] font-bold flex items-center justify-center">
                                    <i className="fa-solid fa-headset"></i>
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A1610] rounded-full"></span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Mentawai Support</h4>
                                <p className="text-xs text-white/70">Usually replies quickly</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50 space-y-3">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-xs text-gray-700 border border-gray-100">
                            Hello! How can we help you with your Mentawai trip? 👋
                        </div>
                        
                        <form onSubmit={handleKirim} className="space-y-2">
                            <textarea
                                rows="2"
                                placeholder="Type your message here..."
                                value={pesanCustom}
                                onChange={(e) => setPesanCustom(e.target.value)}
                                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A1610] resize-none"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <i className="fa-brands fa-whatsapp text-sm"></i> Start WhatsApp Chat
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group bg-[#25D366] hover:bg-[#20ba5a] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none"
                aria-label="Chat WhatsApp"
            >
                <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none"></span>
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-brands fa-whatsapp'} text-2xl relative z-10`}></i>

                {!isOpen && (
                    <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none font-medium">
                        Need Help? Chat With Us
                    </span>
                )}
            </button>
        </div>
    );
};

export default FloatingWhatsApp;