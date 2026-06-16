import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';

const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Fungsi notifikasi elegan buat ngegantiin alert()
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Tarik pengaturan web SATU KALI SAJA saat web pertama dibuka
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await supabase.from('pengaturan_web').select('*').limit(1).single();
                if (data) setSettings(data);
            } catch (error) {
                console.error("Gagal memuat pengaturan:", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <GlobalContext.Provider value={{ settings, showToast, toast }}>
            {children}
        </GlobalContext.Provider>
    );
};