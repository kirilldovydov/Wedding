document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Инициализация GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Анимация главного экрана при загрузке (fade-in + slight y-axis move)
    gsap.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2
    });

    // Анимация появления секций при скролле
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

    // 2. Логика формы RSVP

    // Находим радиокнопки "Приду" / "Не приду" и обертку скрытого контента
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const conditionalWrapper = document.getElementById('conditional-fields');
    
    // Все поля внутри скрытого блока, чтобы управлять атрибутом required
    const conditionalInputs = conditionalWrapper.querySelectorAll('input[type="radio"]');

    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                // Если "Приду" -> добавляем класс active. 
                // В CSS свойство grid-template-rows: 0fr плавно перейдет в 1fr
                conditionalWrapper.classList.add('active');
                
                // Делаем хотя бы по одному полю в группах обязательным (по желанию, тут базовая реализация)
                // Для радио-кнопок трансфера и проживания ставим required
                conditionalWrapper.querySelector('input[name="transfer"]').required = true;
                conditionalWrapper.querySelector('input[name="accommodation"]').required = true;
            } else {
                // Если "Не приду" -> скрываем блок
                conditionalWrapper.classList.remove('active');
                
                // Снимаем required, чтобы форма отправилась
                conditionalInputs.forEach(input => input.required = false);
            }
        });
    });

    // 3. Обработка отправки формы (Подготовка для Google Apps Script)
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    // Сюда нужно вставить URL вашего веб-приложения Google Apps Script
    // Инструкция: Создать таблицу -> Расширения -> Apps Script -> написать функцию doPost(e) -> Начать развертывание -> Веб-приложение (доступ: Все)
    const GOOGLE_SCRIPT_URL = 'ВАШ_URL_APPS_SCRIPT_ЗДЕСЬ'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Предотвращаем стандартную перезагрузку страницы

        // Меняем состояние кнопки на лоадер
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Отправка...';
        submitBtn.disabled = true;
        formMessage.innerText = '';

        // Собираем данные из формы
        const formData = new FormData(form);
        
        /* 
         * БЛОК ИНТЕГРАЦИИ С GOOGLE SHEETS
         * Чтобы данные улетали в таблицу, раскомментируйте код ниже, когда у вас будет ссылка на скрипт.
         */
        
        /*
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                formMessage.style.color = "var(--accent-color)";
                formMessage.innerText = 'Спасибо! Ваш ответ успешно отправлен.';
                form.reset();
                conditionalWrapper.classList.remove('active'); // Скрываем поля
            } else {
                throw new Error('Ошибка сети');
            }
        } catch (error) {
            formMessage.style.color = "red";
            formMessage.innerText = 'Произошла ошибка. Пожалуйста, попробуйте позже или напишите нам в мессенджер.';
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
        */

        // СИМУЛЯЦИЯ ОТПРАВКИ ДЛЯ ДЕМОНСТРАЦИИ (Удалить при реальной интеграции)
        setTimeout(() => {
            formMessage.style.color = "var(--text-color)";
            formMessage.innerText = 'Спасибо! Ваш ответ успешно сохранен.';
            form.reset();
            conditionalWrapper.classList.remove('active');
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }, 1500);
    });
});