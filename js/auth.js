// ========================================
//  القناص - إدارة المستخدمين والجلسات
// ========================================

let currentUser = null;
let userRole = null;

// حفظ جلسة المستخدم
function saveUserSession(user, role) {
    currentUser = user;
    userRole = role;
    localStorage.setItem('qannas_user', JSON.stringify(user));
    localStorage.setItem('qannas_role', role);
}

// تحميل الجلسة المحفوظة
function loadUserSession() {
    const savedUser = localStorage.getItem('qannas_user');
    const savedRole = localStorage.getItem('qannas_role');
    
    if (savedUser && savedRole) {
        currentUser = JSON.parse(savedUser);
        userRole = savedRole;
        return true;
    }
    return false;
}

// تسجيل الخروج
function logout() {
    currentUser = null;
    userRole = null;
    localStorage.removeItem('qannas_user');
    localStorage.removeItem('qannas_role');
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => location.reload(), 1000);
}

// التحقق من تسجيل الدخول
function isLoggedIn() {
    return currentUser !== null;
}

// تسجيل راكب جديد
async function registerPassenger(name, phone, day, month, year) {
    const age = getAge(day, month, year);
    if (age
