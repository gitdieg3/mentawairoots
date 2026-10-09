import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import TestimonialSlider from '../components/TestimonialSlider';
import KatalogSection from '../components/KatalogSection';
import MediaGallery from '../components/MediaGallery'; 
import ContactSection from '../components/ContactSection';

const Home = () => {
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Optimalisasi: Menggunakan .limit() untuk mencegah overfetching data di halaman utama
                const [pkgRes, catRes, testiRes, settingRes, mediaRes] = await Promise.all([
                    supabase.from('paket_wisata').select('*').order('id_paket', { ascending: false }).limit(6),
                    supabase.from('kategori').select('*').order('id', { ascending: true }),
                    supabase.from('testimoni').select('*').order('id', { ascending: false }).limit(8),
                    supabase.from('pengaturan_web').select('*').eq('id', 1).single(),
                    supabase.from('media_kegiatan').select('*').order('id', { ascending: false }).limit(10)
                ]);

                if (pkgRes.error) throw pkgRes.error;
                if (catRes.error) throw catRes.error;

                setPackages(pkgRes.data || []);
                setCategories(catRes.data || []);
                setTestimonials(testiRes.data || []);
                setSettings(settingRes.data || {});
                setMediaList(mediaRes.data || []);
            } catch (error) {
                console.error("Gagal menarik data Home:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const kirimPesanWA = () => {
        let kategori = document.getElementById('wa_kategori')?.value || '';
        let tanggal = document.getElementById('wa_tanggal')?.value || '';
        let peserta = document.getElementById('wa_peserta')?.value || '';

        if (!tanggal) {
            alert('Pemberitahuan: Silakan tentukan tanggal keberangkatan yang Anda inginkan.');
            return;
        }
        let textPesan = `Hello Mentawai Roots!\n\nI would like to consult about a Mentawai expedition adventure with the following details:\n` +
            `- *Adventure Category:* ${kategori}\n` +
            `- *Departure Date:* ${tanggal}\n` +
            `- *Number of Participants:* ${peserta}\n\n` +
            `Is the travel quota for this route still available? Thank you!`;

        let phone = settings.nomor_wa || '628126774808';
        phone = phone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textPesan)}`, '_blank');
    };

    return (
        <>
            <Hero settings={settings} categories={categories} kirimPesanWA={kirimPesanWA} />
            <AboutSection settings={settings} />
            <KatalogSection categories={categories} packages={packages} loading={loading} />
            <MediaGallery mediaData={mediaList} />
            <TestimonialSlider testimonials={testimonials} loading={loading} />
            <ContactSection />
        </>
    );
};

export default Home;