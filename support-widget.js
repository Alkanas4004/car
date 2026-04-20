// support-widget.js - زر الدعم العائم لجميع الصفحات

(function() {
    // إنشاء العناصر
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'support-widget';
    
    // هيكل الويدجت
    widgetContainer.innerHTML = `
        <!-- زر الدعم العائم -->
        <div class="support-button" id="supportButton">
            <div class="support-icon">💬</div>
            <div class="support-text">الدعم</div>
        </div>
        
        <!-- النافذة المنبثقة -->
        <div class="support-popup" id="supportPopup">
            <div class="popup-header">
                <h3>📞 الدعم الفني</h3>
                <button class="close-popup" id="closePopup">✕</button>
            </div>
            <div class="popup-body">
                <p>كيف يمكننا مساعدتك؟</p>
                <div class="contact-options">
                    <a href="tel:+201234567890" class="contact-item">
                        <span class="contact-icon">📱</span>
                        <span>اتصل بنا</span>
                    </a>
                    <a href="https://wa.me/201234567890" target="_blank" class="contact-item">
                        <span class="contact-icon">💬</span>
                        <span>واتساب</span>
                    </a>
                    <a href="mailto:support@example.com" class="contact-item">
                        <span class="contact-icon">📧</span>
                        <span>البريد الإلكتروني</span>
                    </a>
                </div>
                <div class="quick-message">
                    <textarea id="quickMessage" placeholder="اكتب رسالتك السريعة..."></textarea>
                    <button id="sendMessageBtn">إرسال</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(widgetContainer);
    
    // إضافة الأنماط
    const styles = document.createElement('style');
    styles.textContent = `
        /* الحاوية الرئيسية */
        #support-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: 'Tahoma', 'Segoe UI', Arial, sans-serif;
        }
        
        /* الزر العائم */
        .support-button {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
            position: relative;
            z-index: 10000;
        }
        
        .support-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            }
        }
        
        .support-icon {
            font-size: 28px;
            color: white;
        }
        
        .support-text {
            font-size: 10px;
            color: white;
            margin-top: 2px;
            font-weight: bold;
        }
        
        /* النافذة المنبثقة */
        .support-popup {
            position: absolute;
            bottom: 85px;
            right: 0;
            width: 300px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            overflow: hidden;
            direction: rtl;
        }
        
        .support-popup.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        
        /* رأس النافذة */
        .popup-header {
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .popup-header h3 {
            margin: 0;
            font-size: 16px;
        }
        
        .close-popup {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            transition: background 0.3s;
        }
        
        .close-popup:hover {
            background: rgba(255,255,255,0.2);
        }
        
        /* محتوى النافذة */
        .popup-body {
            padding: 15px;
        }
        
        .popup-body p {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 14px;
        }
        
        .contact-options {
            margin-bottom: 15px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            padding: 10px;
            margin: 5px 0;
            background: #f5f5f5;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            transition: background 0.3s;
            gap: 10px;
        }
        
        .contact-item:hover {
            background: #e0e0e0;
        }
        
        .contact-icon {
            font-size: 20px;
        }
        
        .quick-message {
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        
        .quick-message textarea {
            width: 100%;
            height: 80px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 8px;
            resize: none;
            font-family: inherit;
            font-size: 12px;
            box-sizing: border-box;
            margin-bottom: 10px;
        }
        
        .quick-message textarea:focus {
            outline: none;
            border-color: #25D366;
        }
        
        #sendMessageBtn {
            width: 100%;
            padding: 8px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.3s;
        }
        
        #sendMessageBtn:hover {
            opacity: 0.9;
        }
        
        /* للشاشات الصغيرة */
        @media (max-width: 480px) {
            .support-popup {
                width: 280px;
                bottom: 75px;
            }
            
            .support-button {
                width: 60px;
                height: 60px;
            }
            
            .support-icon {
                font-size: 24px;
            }
        }
    `;
    
    document.head.appendChild(styles);
    
    // إضافة وظائف التفاعل
    setTimeout(() => {
        const supportButton = document.getElementById('supportButton');
        const supportPopup = document.getElementById('supportPopup');
        const closePopup = document.getElementById('closePopup');
        const sendBtn = document.getElementById('sendMessageBtn');
        const messageInput = document.getElementById('quickMessage');
        
        // فتح وإغلاق النافذة
        supportButton.addEventListener('click', (e) => {
            e.stopPropagation();
            supportPopup.classList.toggle('active');
        });
        
        closePopup.addEventListener('click', () => {
            supportPopup.classList.remove('active');
        });
        
        // إغلاق النافذة عند الضغط خارجها
        document.addEventListener('click', (e) => {
            if (!widgetContainer.contains(e.target)) {
                supportPopup.classList.remove('active');
            }
        });
        
        // إرسال الرسالة السريعة
        sendBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                alert(`تم استلام رسالتك:\n"${message}"\n\nسيتم الرد عليك قريباً`);
                messageInput.value = '';
                supportPopup.classList.remove('active');
            } else {
                alert('الرجاء كتابة رسالتك أولاً');
            }
        });
        
        // إرسال بالضغط على Enter (Ctrl+Enter)
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                sendBtn.click();
            }
        });
        
    }, 100);
})();