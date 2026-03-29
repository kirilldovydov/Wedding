document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ИНИЦИАЛИЗАЦИЯ GSAP И АНИМАЦИЙ
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);

    // Анимация главного экрана при загрузке (появление и легкое движение вверх)
    gsap.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2
    });

    // Анимация появления остальных секций при скролле
    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Анимация стартует, когда верх блока достигает 85% высоты экрана
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: "power2.out"
        });
    });

    // ==========================================
    // 2. ЛОГИКА РАСКРЫТИЯ RSVP-ФОРМЫ
    // ==========================================
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const conditionalWrapper = document.getElementById('conditional-fields');
    const conditionalInputs = conditionalWrapper.querySelectorAll('input[type="radio"]');

    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                // Если "Приду" -> плавно раскрываем блок через CSS Grid
                conditionalWrapper.classList.add('active');
                
                // Делаем обязательным выбор трансфера и проживания
                conditionalWrapper.querySelector('input[name="transfer"]').required = true;
                conditionalWrapper.querySelector('input[name="accommodation"]').required = true;
            } else {
                // Если "Не приду" -> скрываем блок
                conditionalWrapper.classList.remove('active');
                
                // Снимаем обязательность полей, чтобы форма отправилась
                conditionalInputs.forEach(input => input.required = false);
            }
        });
    });

    // ==========================================
    // 3. ОТПРАВКА ДАННЫХ В GOOGLE ТАБЛИЦУ
    // ==========================================
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    // Твой персональный URL веб-приложения Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2c32O7Xd5HVsYd2dec5MYhErz39lH_4oqqN7wWq8K9evPCWHpmtsUoE1p07fFvr0Dvw/exec'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Останавливаем стандартную перезагрузку страницы

        // Сохраняем исходный текст кнопки и меняем его на индикатор загрузки
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Отправка...';
        submitBtn.disabled = true; // Блокируем кнопку от двойного клика
        formMessage.innerText = ''; // Очищаем старые сообщения

        // Собираем все введенные пользователем данные
        const formData = new FormData(form);

        try {
            // Отправляем POST-запрос на сервер Google
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            // Если сервер Google ответил успешно
            if (response.ok) {
                formMessage.style.color = "var(--accent-color)"; // Зеленоватый цвет успеха
                formMessage.innerText = 'Спасибо! Ваш ответ успешно отправлен.';
                form.reset(); // Очищаем поля формы
                conditionalWrapper.classList.remove('active'); // Скрываем дополнительные поля, если они были открыты
            } else {
                // Если сервер вернул ошибку
                throw new Error('Ошибка сети при отправке данных');
            }
        } catch (error) {
            // Если пропал интернет или скрипт Google недоступен
            console.error('Ошибка отправки:', error);
            formMessage.style.color = "red";
            formMessage.innerText = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
        } finally {
            // В любом случае (успех или ошибка) возвращаем кнопку в исходное состояние
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});