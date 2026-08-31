export const openWhatsApp = (phoneNumber, message = '') => {
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
    }
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
};