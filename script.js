// ========================================
// HEALTH COACHING - INTERACTIVE FEATURES
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // NAVIGATION
    // ========================================

    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // COURSE FILTERING
    // ========================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Filter courses with animation
            courseCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    // Show card with delay for stagger effect
                    setTimeout(() => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100);
                } else {
                    // Hide card
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ========================================
    // BOOKING FORM VALIDATION
    // ========================================

    const bookingForm = document.getElementById('bookingForm');

    // Initialize Flatpickr Calendar for Date
    const dateInput = document.getElementById('date');
    const datePicker = flatpickr(dateInput, {
        minDate: 'today',
        maxDate: new Date().fp_incr(90), // 90 days from today
        dateFormat: 'Y-m-d',
        disableMobile: false,
        theme: 'dark',
        onChange: function (selectedDates, dateStr, instance) {
            validateField(dateInput);
        }
    });

    // Initialize Flatpickr for Time (alternative time picker)
    const timeInput = document.getElementById('time');
    const timePicker = flatpickr(timeInput, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: false,
        minTime: '09:00',
        maxTime: '17:00',
        minuteIncrement: 30,
        theme: 'dark',
        onChange: function (selectedDates, timeStr, instance) {
            validateField(timeInput);
        }
    });


    // Real-time validation
    const formInputs = bookingForm.querySelectorAll('input, select, textarea');

    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Validate individual field
    function validateField(field) {
        const formGroup = field.parentElement;
        formGroup.classList.remove('error');

        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            formGroup.classList.add('error');
            return false;
        }

        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                formGroup.classList.add('error');
                return false;
            }
        }

        // Phone validation (basic)
        if (field.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (field.value && !phoneRegex.test(field.value)) {
                formGroup.classList.add('error');
                return false;
            }
        }

        return true;
    }

    // Form submission
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        // Validate all fields
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Get form data
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData);

            // Show success message
            showSuccessMessage(data);

            // Reset form
            bookingForm.reset();

            // In production, you would send this data to your backend
            console.log('Booking submitted:', data);
        } else {
            // Scroll to first error
            const firstError = bookingForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Show success message
    function showSuccessMessage(data) {
        const formContainer = document.getElementById('bookingFormContainer');

        // Create success message
        const successHTML = `
            <div class="booking-form" style="text-align: center; animation: fadeInUp 0.6s ease-out;">
                <div style="font-size: 4rem; margin-bottom: var(--spacing-lg);">✓</div>
                <h3 style="color: var(--color-success); margin-bottom: var(--spacing-md);">Booking Confirmed!</h3>
                <p style="margin-bottom: var(--spacing-lg);">Thank you, ${data.name}! Your consultation has been scheduled.</p>
                <div style="background: var(--color-bg-tertiary); padding: var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-xl); text-align: left;">
                    <p><strong>Service:</strong> ${getServiceName(data.service)}</p>
                    <p><strong>Date:</strong> ${formatDate(data.date)}</p>
                    <p><strong>Time:</strong> ${data.time}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                </div>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">
                    We've sent a confirmation email to ${data.email}. Our team will contact you within 24 hours to confirm your appointment.
                </p>
                <button class="btn btn-primary" onclick="location.reload()">Book Another Consultation</button>
            </div>
        `;

        formContainer.innerHTML = successHTML;
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Helper function to get service name
    function getServiceName(value) {
        const services = {
            'nutrition': 'Nutrition Consultation',
            'fitness': 'Fitness Consultation',
            'wellness': 'Holistic Wellness',
            'weight': 'Weight Management',
            'general': 'General Health Coaching'
        };
        return services[value] || value;
    }

    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================

    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ========================================
    // COURSE CARD INTERACTIONS
    // ========================================

    courseCards.forEach(card => {
        card.addEventListener('click', function () {
            // Get course details
            const title = this.querySelector('.course-title').textContent;
            const category = this.querySelector('.course-category').textContent;
            const price = this.querySelector('.course-price').textContent;
            const duration = this.querySelector('.course-duration').textContent;
            const description = this.querySelector('.course-description').textContent;

            // Show course details modal (simplified version)
            showCourseModal(title, category, price, duration, description);
        });
    });

    // Show course modal
    function showCourseModal(title, category, price, duration, description) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: var(--spacing-xl);
            animation: fadeIn 0.3s ease-out;
        `;

        modal.innerHTML = `
            <div class="card" style="max-width: 600px; width: 100%; animation: fadeInUp 0.4s ease-out;">
                <span class="course-category" style="display: inline-block; margin-bottom: var(--spacing-md);">${category}</span>
                <h2 style="margin-bottom: var(--spacing-md);">${title}</h2>
                <p style="margin-bottom: var(--spacing-lg);">${description}</p>
                <div style="display: flex; gap: var(--spacing-xl); margin-bottom: var(--spacing-xl); padding: var(--spacing-lg); background: var(--color-bg-tertiary); border-radius: var(--radius-md);">
                    <div>
                        <div style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Price</div>
                        <div class="course-price" style="font-size: var(--font-size-2xl);">${price}</div>
                    </div>
                    <div>
                        <div style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Duration</div>
                        <div style="font-size: var(--font-size-xl); font-weight: 600;">${duration}</div>
                    </div>
                </div>
                <div style="display: flex; gap: var(--spacing-md);">
                    <button class="btn btn-primary" style="flex: 1;" onclick="window.location.href='#booking'">Enroll Now</button>
                    <button class="btn btn-secondary" id="closeModal">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        };

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.getElementById('closeModal').addEventListener('click', closeModal);
    }

    // ========================================
    // PERFORMANCE OPTIMIZATION
    // ========================================

    // Lazy load course images
    const courseImages = document.querySelectorAll('.course-image');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Image is already set in HTML, but you could lazy load here
                imageObserver.unobserve(img);
            }
        });
    });

    courseImages.forEach(img => {
        imageObserver.observe(img);
    });

    // ========================================
    // INITIALIZE
    // ========================================

    console.log('HealthCoach Pro - Website initialized successfully! 🚀');
});

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
