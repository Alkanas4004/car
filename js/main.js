/* ================================================================ */
/*                    Esy Way - دوال جافاسكريبت الرئيسية             */
/* ================================================================ */

// ---------- الإعدادات العامة ----------
const API_URL = 'https://script.google.com/macros/s/AKfycbwmJgr8R-Ds7GyGdHWIqkXfLU0YJA-hSQweDhdJueYBdz71W8Spghb9_67SyHXyEcOT/exec';

// ---------- دوال مساعدة ----------
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    // تخصيص لون الخلفية حسب النوع
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#1a1a1a'
    };
    toast.style.backgroundColor = colors[type] || colors.info;
    toast.style.color = '#fff';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function goBack() {
    window.history.back();
}

function goToPage(url) {
    window.location.href = url;
}

function logout() {
    localStorage.removeItem('loggedInPassenger');
    localStorage.removeItem('loggedInDriver');
    window.location.href = 'index.html';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, m => {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function cleanPhone(phone) {
    return String(phone).replace(/\D/g, '');
}

function getAge(day, month, year) {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
}

// ---------- جلسات المستخدم ----------
function saveUserSession(type, userData) {
    const key = type === 'passenger' ? 'loggedInPassenger' : 'loggedInDriver';
    localStorage.setItem(key, JSON.stringify(userData));
    window.currentUser = userData;
}

// ---------- دوال التخزين المحلي (للاستخدام في الصفحات القديمة) ----------
let DriversSheet = JSON.parse(localStorage.getItem('DriversSheet')) || [];
let PassengersSheet = JSON.parse(localStorage.getItem('PassengersSheet')) || [];

function saveToLocal() {
    localStorage.setItem('DriversSheet', JSON.stringify(DriversSheet));
    localStorage.setItem('PassengersSheet', JSON.stringify(PassengersSheet));
}

function updateSavedLists() {
    // كانت تستخدم لتحديث datalist، لم نعد نحتاجها لكن نتركها للتوافق
}

// ---------- دوال API (التواصل مع Google Sheets) ----------
async function sendToSheet(sheetName, data) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                sheetName: sheetName,
                ...data
            })
        });
        return true;
    } catch(e) {
        console.error('فشل الإرسال للشيت', e);
        return false;
    }
}

async function fetchAllDrivers() {
    try {
        const res = await fetch(`${API_URL}?action=getAllDrivers`);
        const data = await res.json();
        return data.drivers || [];
    } catch(e) {
        console.error('fetchAllDrivers:', e);
        return [];
    }
}

async function fetchAllPassengers() {
    try {
        const res = await fetch(`${API_URL}?action=getAllPassengers`);
        const data = await res.json();
        return data.passengers || [];
    } catch(e) {
        console.error('fetchAllPassengers:', e);
        return [];
    }
}

async function fetchAllRequests() {
    try {
        const res = await fetch(`${API_URL}?action=getAllRequests`);
        const data = await res.json();
        return data.requests || [];
    } catch(e) {
        console.error('fetchAllRequests:', e);
        return [];
    }
}

async function checkDriverStatus(phone) {
    try {
        const res = await fetch(`${API_URL}?action=checkDriver&phone=${phone}`);
        const data = await res.json();
        return data.status || 'unknown';
    } catch(e) {
        console.error('checkDriverStatus:', e);
        return 'unknown';
    }
}

async function fetchPassengerActiveOrder(phone) {
    try {
        const res = await fetch(`${API_URL}?action=getPassengerActiveOrder&passengerPhone=${phone}`);
        const data = await res.json();
        return data.activeOrder || null;
    } catch(e) {
        console.error('fetchPassengerActiveOrder:', e);
        return null;
    }
}

async function getMessages(chatId) {
    try {
        const res = await fetch(`${API_URL}?action=getMessages&chatId=${chatId}`);
        const data = await res.json();
        return data.messages || [];
    } catch(e) {
        console.error('getMessages:', e);
        return [];
    }
}

async function sendMessage(chatId, sender, text, type = 'text') {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'sendMessage',
                chatId: chatId,
                sender: sender,
                text: text,
                type: type,
                timestamp: new Date().toISOString()
            })
        });
        return true;
    } catch(e) {
        console.error('sendMessage:', e);
        return false;
    }
}

// ---------- دوال خاصة بالراكب ----------
async function fetchActiveDrivers() {
    const drivers = await fetchAllDrivers();
    return drivers.filter(d => d.status === 'accepted' && d.activationTime && d.currentState !== 'توكلت')
                 .sort((a,b) => (a.activationTime||'').localeCompare(b.activationTime||''));
}

// ---------- دوال خاصة بالسائق ----------
async function updateDriverState(phone, state, line) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'updateState',
                phone: phone,
                state: state,
                line: line
            })
        });
        return true;
    } catch(e) {
        console.error('updateDriverState:', e);
        return false;
    }
}

async function acceptRequest(orderId, driverName, driverPhone, driverCar) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'acceptRequest',
                orderId: orderId,
                driverName: driverName,
                driverPhone: driverPhone,
                driverCar: driverCar
            })
        });
        return true;
    } catch(e) {
        console.error('acceptRequest:', e);
        return false;
    }
}

async function rejectRequest(orderId, driverName) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'rejectRequest',
                orderId: orderId,
                driverName: driverName
            })
        });
        return true;
    } catch(e) {
        console.error('rejectRequest:', e);
        return false;
    }
}

async function completeOrder(orderId) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'completeOrder',
                orderId: orderId
            })
        });
        return true;
    } catch(e) {
        console.error('completeOrder:', e);
        return false;
    }
}

// ---------- دوال التقييم ----------
async function submitRating(data) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'submitRating',
                ...data
            })
        });
        return true;
    } catch(e) {
        console.error('submitRating:', e);
        return false;
    }
}

// ---------- دوال الأدمن ----------
async function updateDriverStatusAdmin(phone, newStatus) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'admin_action',
                targetSheet: 'Drivers',
                phone: phone,
                type: newStatus === 'accepted' ? 'accept' : 'reject'
            })
        });
        return true;
    } catch(e) {
        console.error('updateDriverStatusAdmin:', e);
        return false;
    }
}

// ---------- دوال إضافية للتوافق مع الصفحات القديمة ----------
function generateChatId(u1, u2) {
    const a = cleanPhone(u1);
    const b = cleanPhone(u2);
    if (!a || !b) return null;
    return a > b ? b + '_' + a : a + '_' + b;
}

// ---------- تعريض الدوال للنطاق العام ----------
window.API_URL = API_URL;
window.showToast = showToast;
window.goBack = goBack;
window.goToPage = goToPage;
window.logout = logout;
window.escapeHtml = escapeHtml;
window.cleanPhone = cleanPhone;
window.getAge = getAge;
window.saveUserSession = saveUserSession;
window.DriversSheet = DriversSheet;
window.PassengersSheet = PassengersSheet;
window.saveToLocal = saveToLocal;
window.updateSavedLists = updateSavedLists;
window.sendToSheet = sendToSheet;
window.fetchAllDrivers = fetchAllDrivers;
window.fetchAllPassengers = fetchAllPassengers;
window.fetchAllRequests = fetchAllRequests;
window.checkDriverStatus = checkDriverStatus;
window.fetchPassengerActiveOrder = fetchPassengerActiveOrder;
window.getMessages = getMessages;
window.sendMessage = sendMessage;
window.fetchActiveDrivers = fetchActiveDrivers;
window.updateDriverState = updateDriverState;
window.acceptRequest = acceptRequest;
window.rejectRequest = rejectRequest;
window.completeOrder = completeOrder;
window.submitRating = submitRating;
window.updateDriverStatusAdmin = updateDriverStatusAdmin;
window.generateChatId = generateChatId;

console.log('✅ main.js جاهز للعمل مع Esy Way');
