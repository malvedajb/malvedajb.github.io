document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile navigation toggle ──────────────────────────────
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        let mobileNav = document.querySelector('.mobile-nav');

        if (!mobileNav) {
            mobileNav = document.createElement('div');
            mobileNav.className = 'mobile-nav';

            const links = document.querySelectorAll('.nav-links a');
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.textContent;
                if (link.classList.contains('active')) a.classList.add('active');
                mobileNav.appendChild(a);
            });

            const contactBtn = document.querySelector('header .btn');
            if (contactBtn) {
                const a = document.createElement('a');
                a.href = contactBtn.href;
                a.textContent = contactBtn.textContent;
                mobileNav.appendChild(a);
            }

            document.body.insertBefore(mobileNav, document.body.firstChild.nextSibling);
        }

        navToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('header') && !e.target.closest('.mobile-nav')) {
                mobileNav.classList.remove('open');
            }
        });
    }

    // ── Sticky header shadow ──────────────────────────────────
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 50
                ? '0 2px 15px rgba(0,0,0,0.4)'
                : 'none';
        });
    }

    // ── Contact form submission ───────────────────────────────
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const required = contactForm.querySelectorAll('[required]');
            let valid = true;

            required.forEach(field => {
                field.style.borderColor = '';
                if (field.type === 'radio') return;
                if (!field.value.trim()) {
                    field.style.borderColor = '#e53e3e';
                    valid = false;
                }
            });

            const radioGroups = {};
            contactForm.querySelectorAll('input[type="radio"][required]').forEach(r => {
                radioGroups[r.name] = radioGroups[r.name] || [];
                radioGroups[r.name].push(r);
            });

            Object.values(radioGroups).forEach(group => {
                const checked = group.some(r => r.checked);
                if (!checked) valid = false;
            });

            if (!valid) {
                alert('Please fill in all required fields.');
                return;
            }

            const submitBtn = contactForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'SENDING…';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = '✓ MESSAGE SENT';
                submitBtn.style.background = '#38a169';
                contactForm.reset();
                resetFormStyles();
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 800);
        });

        function resetFormStyles() {
            contactForm.querySelectorAll('input, textarea, select').forEach(el => {
                el.style.borderColor = '';
            });
        }

        // Live radio/checkbox visual feedback
        contactForm.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const group = contactForm.querySelectorAll(`input[name="${radio.name}"]`);
                group.forEach(r => {
                    r.closest('.radio-label').style.borderColor = r.checked ? 'var(--primary)' : '';
                    r.closest('.radio-label').style.background = r.checked ? '#fdf0ec' : '';
                });
            });
        });

        contactForm.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => {
                const label = cb.closest('.checkbox-label');
                if (label) {
                    label.style.borderColor = cb.checked ? 'var(--primary)' : '';
                    label.style.background = cb.checked ? '#fdf0ec' : '';
                }
            });
        });
    }

    // ── Portfolio filter buttons ──────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');

    if (filterBtns.length && portfolioItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                portfolioItems.forEach(item => {
                    const match = filter === 'all' || item.dataset.category === filter;
                    item.style.display = match ? '' : 'none';
                    item.style.opacity = match ? '1' : '0';
                });
            });
        });
    }

    // ── Animate skill bars on scroll ─────────────────────────
    const skillFills = document.querySelectorAll('.skill-fill');
    if (skillFills.length) {
        const savedWidths = Array.from(skillFills).map(el => el.style.width);
        skillFills.forEach(el => { el.style.width = '0'; });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach((el, i) => {
                        setTimeout(() => { el.style.width = savedWidths[i]; }, i * 80);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) observer.observe(skillsSection);
    }

});
