import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Booking = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // STATE LOGIKA STEP & INVOICE
    const [step, setStep] = useState(1);
    const [invoice, setInvoice] = useState({ id: '', date: '' });
    
    // STATE SUPABASE
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // STATE FORM DATA
    const [formData, setFormData] = useState({
        nama: '',
        kontak: '',
        email: '',
        tanggal: '',
        paket: '', // Menyimpan id_paket
        pax: 2,
        catatan: ''
    });

    // AMBIL DATA DARI DATABASE & TANGKAP PARAMETER URL
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Tarik semua paket wisata dari Supabase untuk Dropdown
                const { data, error } = await supabase.from('paket_wisata').select('*');
                if (error) throw error;
                
                setPackages(data || []);

                // Tangkap data dari halaman Detail via URL Parameter
                const packageParam = searchParams.get('id');
                const dateParam = searchParams.get('date');
                const paxParam = searchParams.get('pax');

                let initialDate = dateParam;
                if (!initialDate) {
                    const hariEsok = new Date();
                    hariEsok.setDate(hariEsok.getDate() + 1);
                    initialDate = hariEsok.toISOString().split('T')[0];
                }

                // Set Default Form
                setFormData(prev => ({
                    ...prev,
                    tanggal: initialDate,
                    pax: paxParam ? parseInt(paxParam) : prev.pax,
                    paket: packageParam ? packageParam : (data && data.length > 0 ? data[0].id_paket : '')
                }));

            } catch (error) {
                console.error("Gagal menarik data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [searchParams]);

    // HANDLE PERUBAHAN INPUT
    const handleChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id.replace('form-', '');
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    // LOGIKA HITUNG HARGA REAL-TIME DARI DATABASE
    const dataPaketTerpilih = packages.find(p => String(p.id_paket) === String(formData.paket));
    const totalBiaya = dataPaketTerpilih ? dataPaketTerpilih.harga * formData.pax : 0;
    const formatRupiah = (angka) => 'Rp ' + (angka || 0).toLocaleString('id-ID');

    // LANJUT KE STEP 2 (KONFIRMASI INVOICE)
    const prosesKeStep2 = (e) => {
        e.preventDefault();
        if (!invoice.id) {
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const opsiTanggal = { year: 'numeric', month: 'long', day: 'numeric' };
            setInvoice({
                id: `INV-MH${randomId}`,
                date: new Date().toLocaleDateString('id-ID', opsiTanggal)
            });
        }
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // KEMBALI KE STEP 1
    const kembaliKeStep1 = () => {
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // LANJUT KE STEP 3 (SIMPAN KE DATABASE & BUKA WA)
    const prosesKeStep3 = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. SIMPAN KE DATABASE SUPABASE (Tabel data_booking)
            const payload = {
                id_paket: formData.paket,
                nama_lengkap: formData.nama,
                email: formData.email,
                nomor_wa: formData.kontak,
                tanggal_trip: formData.tanggal,
                jumlah_pax: formData.pax,
                total_harga: totalBiaya,
                catatan_khusus: formData.catatan || '-',
                status_booking: 'Pending'
            };

            const { error } = await supabase.from('data_booking').insert([payload]);
            if (error) throw error;

            // 2. RAKIT TEKS WHATSAPP
            let teksWA = `*INVOICE REGISTRASI MENTAWAI HANTAGE*\n`;
            teksWA += `===============================\n\n`;
            teksWA += `• *ID Booking:* ${invoice.id}\n`;
            teksWA += `• *Nama Pemesan:* ${formData.nama}\n`;
            teksWA += `• *Kontak/WA:* ${formData.kontak}\n`;
            teksWA += `• *Alamat Email:* ${formData.email}\n\n`;
            teksWA += `---------------------------------\n`;
            teksWA += `*RINCIAN PERJALANAN*\n`;
            teksWA += `---------------------------------\n`;
            teksWA += `• *Paket Tour:* ${dataPaketTerpilih?.nama_paket}\n`;
            teksWA += `• *Tgl Berangkat:* ${formData.tanggal}\n`;
            teksWA += `• *Jumlah Peserta:* ${formData.pax} Orang\n`;
            teksWA += `• *Catatan:* ${formData.catatan || '-'}\n\n`;
            teksWA += `---------------------------------\n`;
            teksWA += `• *TOTAL ESTIMASI:* ${formatRupiah(totalBiaya)}\n`;
            teksWA += `===============================\n\n`;
            teksWA += `Mohon bantuannya memproses booking saya. Terima kasih! 🙏`;

            // 3. BUKA TAB WHATSAPP
            window.open(`https://wa.me/62895395002626?text=${encodeURIComponent(teksWA)}`, '_blank');

            // 4. TRANSISI KE HALAMAN SUKSES
            setTimeout(() => {
                setStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsSubmitting(false);
            }, 800);

        } catch (err) {
            alert("Gagal mengirim data registrasi: " + err.message);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
                <div className="text-center text-mentawaiDark font-bold animate-pulse text-xl font-serif">
                    <i className="fa-solid fa-spinner fa-spin text-4xl mb-4 block text-mentawaiMint"></i>
                    Memuat Modul Booking...
                </div>
            </div>
        );
    }

    return (
        <>
            {/* STEP PROGRESS BAR */}
            <div className="bg-white border-b border-mentawaiDark/5 py-5 shadow-sm">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0 rounded-full"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-mentawaiSage z-0 rounded-full transition-all duration-500" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}></div>

                        <div className="z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all border ${step >= 1 ? 'bg-mentawaiDark text-mentawaiMint border-white/10' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>1</div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-2.5 ${step >= 1 ? 'text-mentawaiDark' : 'text-gray-400'}`}>Isi Data</span>
                        </div>
                        <div className="z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all border ${step >= 2 ? 'bg-mentawaiDark text-mentawaiMint border-white/10' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>2</div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-2.5 ${step >= 2 ? 'text-mentawaiDark' : 'text-gray-400'}`}>Konfirmasi</span>
                        </div>
                        <div className="z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all border ${step >= 3 ? 'bg-mentawaiDark text-mentawaiMint border-white/10' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>3</div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-2.5 ${step >= 3 ? 'text-mentawaiDark' : 'text-gray-400'}`}>Selesai</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-10">
                {/* STEP 1: FORM PENGISIAN DATA */}
                {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in">
                        <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-mentawaiDark/5">
                            <h2 className="text-3xl font-serif font-semibold text-mentawaiDark mb-8 flex items-center gap-3">
                                <i className="fa-solid fa-user-pen text-mentawaiMint text-2xl"></i> Registrasi Ekspedisi
                            </h2>

                            <form onSubmit={prosesKeStep2} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Lengkap (Sesuai ID) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-mentawaiSage"></i>
                                            <input type="text" id="form-nama" value={formData.nama} onChange={handleChange} required className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition font-medium text-sm" placeholder="Contoh: Aman Silaing" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nomor WhatsApp Aktif <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <i className="fa-brands fa-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-mentawaiSage text-base"></i>
                                            <input type="tel" id="form-kontak" value={formData.kontak} onChange={handleChange} required className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition font-medium text-sm" placeholder="Contoh: 08123456789" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Alamat Email <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-mentawaiSage"></i>
                                            <input type="email" id="form-email" value={formData.email} onChange={handleChange} required className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition font-medium text-sm" placeholder="Contoh: explorer@domain.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tanggal Keberangkatan <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <i className="fa-regular fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-mentawaiSage"></i>
                                            <input type="date" id="form-tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition font-medium text-sm [color-scheme:light]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Paket Wisata Terpilih</label>
                                        <div className="relative">
                                            <i className="fa-solid fa-map-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-mentawaiSage"></i>
                                            <select id="form-paket" value={formData.paket} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition font-semibold text-sm appearance-none cursor-pointer">
                                                {packages.map(pkg => (
                                                    <option key={pkg.id_paket} value={pkg.id_paket}>
                                                        {pkg.nama_paket} ({formatRupiah(pkg.harga)})
                                                    </option>
                                                ))}
                                            </select>
                                            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Jumlah Peserta (Pax) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <i className="fa-solid fa-users absolute left-4 top-1/2 -translate-y-1/2 text-mentawaiSage"></i>
                                            <select id="form-pax" value={formData.pax} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition font-semibold text-sm appearance-none cursor-pointer">
                                                {[...Array(10).keys()].map(n => (
                                                    <option key={n+1} value={n+1}>{n+1} Orang</option>
                                                ))}
                                                <option value="11">Rombongan Besar</option>
                                            </select>
                                            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Catatan Khusus (Opsional)</label>
                                    <textarea id="form-catatan" value={formData.catatan} onChange={handleChange} rows="3" className="w-full p-4 bg-[#FAF8F5] border border-mentawaiDark/10 rounded-xl focus:outline-none focus:border-mentawaiMint focus:ring-1 focus:ring-mentawaiMint transition font-medium text-sm" placeholder="Contoh: Memiliki riwayat medis tertentu, alergi makanan, dll..."></textarea>
                                </div>

                                <div className="flex items-start gap-3 bg-[#103D2E]/5 p-5 rounded-2xl border border-mentawaiDark/5">
                                    <input type="checkbox" id="syarat-ketentuan" required className="mt-1 w-4 h-4 text-mentawaiSage focus:ring-mentawaiMint border-slate-300 rounded accent-mentawaiSage" />
                                    <label htmlFor="syarat-ketentuan" className="text-xs text-slate-600 leading-relaxed font-medium">
                                        Saya menyetujui seluruh <span className="text-mentawaiDark font-bold underline cursor-pointer">Syarat & Ketentuan</span> dari Mentawai Hantage.
                                    </label>
                                </div>

                                <button type="submit" className="w-full bg-[#103D2E] hover:bg-mentawaiSage text-white font-extrabold text-sm uppercase tracking-widest py-4 rounded-2xl transition duration-300 shadow-lg shadow-[#103D2E]/10 flex justify-center items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer">
                                    Lanjut ke Konfirmasi <i className="fa-solid fa-arrow-right text-xs"></i>
                                </button>
                            </form>
                        </div>

                        {/* Ringkasan Kanan */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-mentawaiDark/5">
                                <h3 className="text-sm font-bold text-mentawaiDark mb-5 pb-3 border-b border-mentawaiDark/5 uppercase tracking-wider flex items-center gap-2.5">
                                    <i className="fa-solid fa-receipt text-mentawaiMint"></i> Rincian Ekspedisi
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-serif font-bold text-mentawaiDark text-base">{dataPaketTerpilih?.nama_paket}</p>
                                            <p className="text-xs text-slate-500 mt-1">{formatRupiah(dataPaketTerpilih?.harga)} / pax</p>
                                        </div>
                                        <span className="font-bold text-mentawaiDark text-sm bg-mentawaiBone px-3 py-1 rounded-full border border-mentawaiDark/5">{formData.pax} Pax</span>
                                    </div>
                                    <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center text-xs font-medium text-slate-600">
                                        <span>Pajak & Konservasi</span>
                                        <span className="text-mentawaiSage font-bold uppercase tracking-wide">Included / Gratis</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
                                        <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Total Pembayaran</span>
                                        <span className="text-2xl font-black text-mentawaiDark font-serif">{formatRupiah(totalBiaya)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: KONFIRMASI & INVOICE */}
                {step === 2 && (
                    <div className="max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-mentawaiDark/5 animate-fade-in">
                        <div className="bg-[#0B2B20] text-white p-8 text-center relative border-b border-white/5">
                            <p className="text-[10px] text-mentawaiMint uppercase tracking-widest mb-1 font-bold">Nota Ekspedisi Sementara</p>
                            <h2 className="text-3xl font-serif font-semibold">{invoice.id}</h2>
                            <p className="text-xs text-white/50 mt-1">Dibuat pada {invoice.date}</p>
                        </div>

                        <div className="p-8 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 pb-1.5">Detail Pemesan</h3>
                                <div className="grid grid-cols-2 gap-y-2.5 text-sm">
                                    <span className="text-slate-500 font-light">Nama Lengkap</span>
                                    <span className="font-bold text-mentawaiDark text-right">{formData.nama}</span>
                                    <span className="text-slate-500 font-light">WhatsApp / Kontak</span>
                                    <span className="font-bold text-mentawaiDark text-right">{formData.kontak}</span>
                                    <span className="text-slate-500 font-light">Alamat Email</span>
                                    <span className="font-bold text-mentawaiDark text-right">{formData.email}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 pb-1.5">Rincian Perjalanan</h3>
                                <div className="grid grid-cols-2 gap-y-2.5 text-sm">
                                    <span className="text-slate-500 font-light">Paket Wisata</span>
                                    <span className="font-bold text-mentawaiDark text-right text-xs">{dataPaketTerpilih?.nama_paket}</span>
                                    <span className="text-slate-500 font-light">Tanggal Trip</span>
                                    <span className="font-bold text-mentawaiDark text-right">{formData.tanggal}</span>
                                    <span className="text-slate-500 font-light">Jumlah Peserta</span>
                                    <span className="font-bold text-mentawaiDark text-right">{formData.pax} Pax</span>
                                </div>
                            </div>

                            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-mentawaiDark/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Total Pembayaran</span>
                                    <span className="font-black text-2xl text-mentawaiDark font-serif">{formatRupiah(totalBiaya)}</span>
                                </div>
                                <div className="text-xs text-gray-500 leading-relaxed text-center border-t border-slate-200/80 pt-4">
                                    Sistem pembayaran manual. Kirim pesanan untuk mendapatkan instruksi transfer resmi dari Admin.
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={kembaliKeStep1} disabled={isSubmitting} className="sm:w-1/3 border border-mentawaiDark/10 hover:bg-slate-50 text-slate-600 font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50">
                                    <i className="fa-solid fa-arrow-left text-[10px]"></i> Edit Data
                                </button>
                                <button onClick={prosesKeStep3} disabled={isSubmitting} className="flex-grow bg-[#103D2E] hover:bg-mentawaiSage text-white font-extrabold py-3.5 rounded-xl shadow-lg transition duration-300 flex justify-center items-center gap-2 text-center text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-wait">
                                    {isSubmitting ? (
                                        <><i className="fa-solid fa-spinner fa-spin text-lg"></i> Memproses...</>
                                    ) : (
                                        <><i className="fa-brands fa-whatsapp text-lg text-mentawaiMint"></i> Kirim ke Admin</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: SUKSES */}
                {step === 3 && (
                    <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-mentawaiDark/5 space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-mentawaiMint/15 text-mentawaiSage rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner animate-pulse">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-serif font-semibold text-mentawaiDark">Registrasi Terkirim!</h2>
                            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                                Terima kasih! Data booking Anda berhasil terekam ke sistem kami. Silakan cek jendela obrolan WhatsApp Anda.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-6">
                            <button onClick={() => navigate('/admin')} className="bg-mentawaiDark hover:bg-mentawaiSage text-white font-extrabold py-3.5 rounded-xl transition shadow-md text-xs uppercase tracking-wider">
                                Buka Admin Panel (Cek Leads)
                            </button>
                            <button onClick={() => navigate('/')} className="bg-transparent border border-mentawaiDark/20 text-mentawaiDark font-extrabold py-3.5 rounded-xl transition text-xs uppercase tracking-wider">
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default Booking;