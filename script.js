document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. КИНЕМАТИЧЕСКИЙ ПРЕЛОАДЕР
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);

    const preloaderTimeline = gsap.timeline();
    preloaderTimeline
        .to(".preloader-initials", {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.3
        })
        .to("#preloader", {
            yPercent: -100,
            duration: 1.5,
            ease: "power3.inOut",
            delay: 0.5
        }, 'preloader-exit')
        .to(".hero-content", {
            opacity: 1,
            y: 0,
            duration: 1.8,
            ease: "power3.out"
        }, 'preloader-exit+=0.2');

    // ==========================================
    // 2. АНИМАЦИИ ПОЯВЛЕНИЯ СЕКЦИЙ
    // ==========================================
    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 40,
            duration: 1.4,
            ease: "power2.out"
        });
    });

    // ==========================================
    // 3. ЛОГИКА РАСКРЫТИЯ RSVP-ФОРМЫ
    // ==========================================
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const conditionalWrapper = document.getElementById('conditional-fields');
    const transferRadios = document.querySelectorAll('input[name="transfer"]');
    const accommodationRadios = document.querySelectorAll('input[name="accommodation"]');

    const toggleRequired = (isRequired) => {
        transferRadios.forEach(radio => radio.required = isRequired);
        accommodationRadios.forEach(radio => radio.required = isRequired);
    };

    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                conditionalWrapper.classList.add('active');
                conditionalWrapper.setAttribute('aria-hidden', 'false');
                toggleRequired(true);
            } else {
                conditionalWrapper.classList.remove('active');
                conditionalWrapper.setAttribute('aria-hidden', 'true');
                toggleRequired(false);
            }
        });
    });

    // ==========================================
    // 4. ОТПРАВКА ДАННЫХ В GOOGLE ТАБЛИЦУ
    // ==========================================
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2c32O7Xd5HVsYd2dec5MYhErz39lH_4oqqN7wWq8K9evPCWHpmtsUoE1p07fFvr0Dvw/exec'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Отправка...';
        submitBtn.disabled = true;
        formMessage.innerText = '';

        const formData = new FormData(form);

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                formMessage.style.color = "var(--accent-color)";
                formMessage.innerText = 'Спасибо! Ваш ответ успешно отправлен.';
                form.reset();
                
                // Сброс состояния после отправки
                conditionalWrapper.classList.remove('active');
                conditionalWrapper.setAttribute('aria-hidden', 'true');
                toggleRequired(false);
            } else {
                throw new Error('Ошибка сети');
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            formMessage.style.color = "#d9534f";
            formMessage.innerText = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});