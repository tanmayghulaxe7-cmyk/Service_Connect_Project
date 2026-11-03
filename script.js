document.addEventListener('DOMContentLoaded', () => {
    if (window.SnakeGame && typeof window.SnakeGame.initSnakeGame === 'function') {
        window.SnakeGame.initSnakeGame();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Toggle burger/close icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Header shadow on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        }
    });

    // Simple Search/Filter Functionality
    const searchInput = document.getElementById('serviceSearch');
    const searchBtn = document.getElementById('searchBtn');
    const servicesCards = document.querySelectorAll('.service-card');

    function filterServices(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        let hasResults = false;

        servicesCards.forEach(card => {
            const keywords = card.getAttribute('data-service');
            const title = card.querySelector('.service-title').textContent.toLowerCase();

            if (keywords.includes(term) || title.includes(term)) {
                card.style.display = 'flex';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Basic user feedback if no results
        const grid = document.getElementById('servicesGrid');
        let noResultsMsg = document.getElementById('noResultsMsg');

        if (!hasResults) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResultsMsg';
                noResultsMsg.style.gridColumn = '1 / -1';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.padding = '2rem';
                noResultsMsg.style.color = 'var(--text-muted)';
                noResultsMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: var(--accent-color);"></i>We couldn\'t find a service matching your search. Please try a different term or contact us.';
                grid.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    if (searchInput) {
        // Search on button click
        searchBtn.addEventListener('click', () => {
            filterServices(searchInput.value);
            // Scroll to services
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        });

        // Search on Enter key
        searchInput.addEventListener('keyup', (e) => {
            // Live filter as you type
            filterServices(e.target.value);

            if (e.key === 'Enter') {
                document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Popular Tags quick search
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const term = tag.textContent;
            if (searchInput) {
                searchInput.value = term;
                filterServices(term);
                document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Smooth reveal animation on scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation initial state to cards
    servicesCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease-out ${index % 4 * 0.1}s`;
        observer.observe(card);
    });

    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
        observer.observe(item);
    });

    // --- Modal & Booking Logic ---
    const modalOverlay = document.getElementById('modalOverlay');
    const loginModal = document.getElementById('loginModal');
    const discountModal = document.getElementById('discountModal');
    const bookingModal = document.getElementById('bookingModal');
    const paymentModal = document.getElementById('paymentModal');
    const successModal = document.getElementById('successModal');

    const loginForm = document.getElementById('loginForm');
    const discountForm = document.getElementById('discountForm');
    const bookingForm = document.getElementById('bookingForm');
    const paymentForm = document.getElementById('paymentForm');
    const paymentModalTotal = document.getElementById('paymentModalTotal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const navBookBtn = document.getElementById('navBookBtn');
    const ordersBtn = document.getElementById('ordersBtn');
    const loginEmailInput = document.getElementById('loginEmail');
    const bookingServiceName = document.getElementById('bookingServiceName');
    const selectedVoucherName = document.getElementById('selectedVoucherName');
    const successServiceName = document.getElementById('successServiceName');
    const successBookingSlot = document.getElementById('successBookingSlot');
    const successPaymentMethod = document.getElementById('successPaymentMethod');
    const successDiscountLabel = document.getElementById('successDiscountLabel');
    const successOrderDate = document.getElementById('successOrderDate');
    const successOrderStatus = document.getElementById('successOrderStatus');
    const prepNoteText = document.getElementById('prepNoteText');
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingTimeInput = document.getElementById('bookingTime');
    const bookingAddressInput = document.getElementById('bookingAddress');
    const emergencyBtn = document.querySelector('.emergency-btn');
    const navEmergencyBtn = document.getElementById('navEmergencyBtn');
    const reviewFilters = document.querySelectorAll('.review-filter');
    const reviewCards = document.querySelectorAll('.review-card');
    const discountOptions = document.querySelectorAll('input[name="discountOption"]');
    const bookingBasePrice = document.getElementById('bookingBasePrice');
    const bookingSavings = document.getElementById('bookingSavings');
    const bookingFinalPrice = document.getElementById('bookingFinalPrice');
    const assignedProAvatar = document.getElementById('assignedProAvatar');
    const assignedProName = document.getElementById('assignedProName');
    const assignedProRole = document.getElementById('assignedProRole');
    const assignedProRating = document.getElementById('assignedProRating');
    const assignedProJobs = document.getElementById('assignedProJobs');
    const assignedProEta = document.getElementById('assignedProEta');
    const assignedProPhone = document.getElementById('assignedProPhone');
    const assignedArrivalWindow = document.getElementById('assignedArrivalWindow');
    const assignedProStatus = document.getElementById('assignedProStatus');
    const assignedProVerification = document.getElementById('assignedProVerification');
    const assignedProOtp = document.getElementById('assignedProOtp');
    const assignedServiceDuration = document.getElementById('assignedServiceDuration');
    const assignedOrderTotal = document.getElementById('assignedOrderTotal');
    const callProBtn = document.getElementById('callProBtn');
    const briefAddress = document.getElementById('briefAddress');
    const briefService = document.getElementById('briefService');
    const briefPhone = document.getElementById('briefPhone');
    const briefPayment = document.getElementById('briefPayment');
    const journeyPlacedText = document.getElementById('journeyPlacedText');
    const journeyAssignedText = document.getElementById('journeyAssignedText');
    const journeyArrivalText = document.getElementById('journeyArrivalText');
    const journeyDurationText = document.getElementById('journeyDurationText');
    const trackingSteps = document.querySelectorAll('.tracking-step');

    let isLoggedIn = false;
    let selectedService = '';
    let activeOrder = null;
    let customerContact = '';
    const ORDER_STORAGE_KEY = 'serviceConnectActiveOrder';

    const proDirectory = {
        painters: { name: 'Ritika Sharma', role: 'Lead Painting Expert', rating: '4.9 rating', jobs: '312 jobs completed', eta: '26 mins', phone: '+91 98765 11420', initials: 'RS', status: 'Heading with color kit' },
        carpenters: { name: 'Aman Verma', role: 'Furniture Carpenter', rating: '4.8 rating', jobs: '221 jobs completed', eta: '22 mins', phone: '+91 98765 11540', initials: 'AV', status: 'Bringing tool set' },
        plumbers: { name: 'Nikhil Das', role: 'Pipe and Leak Specialist', rating: '4.9 rating', jobs: '287 jobs completed', eta: '18 mins', phone: '+91 98765 22310', initials: 'ND', status: 'On the way' },
        electricians: { name: 'Rohit Kumar', role: 'Senior Electrician', rating: '4.9 rating', jobs: '240 jobs completed', eta: '18 mins', phone: '+91 98765 22110', initials: 'RK', status: 'On the way' },
        cleaning: { name: 'Sneha Ali', role: 'Home Cleaning Lead', rating: '4.8 rating', jobs: '198 jobs completed', eta: '30 mins', phone: '+91 98765 19180', initials: 'SA', status: 'Team preparing supplies' },
        ac: { name: 'Farhan Khan', role: 'AC Service Technician', rating: '4.9 rating', jobs: '265 jobs completed', eta: '24 mins', phone: '+91 98765 33770', initials: 'FK', status: 'Carrying testing tools' },
        tv: { name: 'Deepak Rao', role: 'TV Installation Expert', rating: '4.7 rating', jobs: '174 jobs completed', eta: '27 mins', phone: '+91 98765 44720', initials: 'DR', status: 'Reviewing service notes' },
        pest: { name: 'Meera Joshi', role: 'Pest Control Specialist', rating: '4.8 rating', jobs: '206 jobs completed', eta: '29 mins', phone: '+91 98765 55240', initials: 'MJ', status: 'Preparing treatment plan' },
        default: { name: 'Arjun Mehta', role: 'Service Specialist', rating: '4.8 rating', jobs: '150 jobs completed', eta: '25 mins', phone: '+91 98765 66780', initials: 'AM', status: 'Assignment confirmed' }
    };

    const servicePricing = {
        painter: 1999,
        carpenter: 299,
        plumber: 199,
        electrician: 149,
        cleaning: 699,
        ac: 399,
        tv: 349,
        pest: 899,
        emergency: 999,
        default: 499
    };

    const serviceDurations = {
        painter: '4-6 hours',
        carpenter: '60-90 mins',
        plumber: '30-45 mins',
        electrician: '30-60 mins',
        cleaning: '2-3 hours',
        ac: '45-60 mins',
        tv: '45-75 mins',
        pest: '60-90 mins',
        emergency: '30-50 mins',
        default: '45-60 mins'
    };

    function formatBookingSlot(dateValue, timeValue) {
        if (!dateValue || !timeValue) {
            return 'Date and time';
        }

        const date = new Date(`${dateValue}T${timeValue}`);
        if (Number.isNaN(date.getTime())) {
            return `${dateValue} at ${timeValue}`;
        }

        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    function getMinutesFromEta(etaText) {
        const match = (etaText || '').match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 20;
    }

    function getTrackingStatus(baseMinutes, createdAt) {
        const elapsedMinutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));
        const remainingMinutes = Math.max(2, baseMinutes - elapsedMinutes);

        let stage = 'assigned';
        let status = 'Expert assigned';

        if (remainingMinutes <= 3) {
            stage = 'working';
            status = 'At your door';
        } else if (remainingMinutes <= 10) {
            stage = 'arriving';
            status = 'Reaching soon';
        } else {
            stage = 'assigned';
            status = 'On the way';
        }

        return {
            remainingMinutes,
            stage,
            status
        };
    }

    function formatCurrency(amount) {
        return `Rs ${Math.max(0, Math.round(amount))}`;
    }

    function getServiceBasePrice(serviceName) {
        const service = (serviceName || '').toLowerCase();

        if (service.includes('paint')) return servicePricing.painter;
        if (service.includes('carpent')) return servicePricing.carpenter;
        if (service.includes('plumb')) return servicePricing.plumber;
        if (service.includes('electric')) return servicePricing.electrician;
        if (service.includes('clean')) return servicePricing.cleaning;
        if (service.includes('ac')) return servicePricing.ac;
        if (service.includes('tv')) return servicePricing.tv;
        if (service.includes('pest')) return servicePricing.pest;
        if (service.includes('emergency')) return servicePricing.emergency;

        return servicePricing.default;
    }

    function getServiceDuration(serviceName) {
        const service = (serviceName || '').toLowerCase();

        if (service.includes('paint')) return serviceDurations.painter;
        if (service.includes('carpent')) return serviceDurations.carpenter;
        if (service.includes('plumb')) return serviceDurations.plumber;
        if (service.includes('electric')) return serviceDurations.electrician;
        if (service.includes('clean')) return serviceDurations.cleaning;
        if (service.includes('ac')) return serviceDurations.ac;
        if (service.includes('tv')) return serviceDurations.tv;
        if (service.includes('pest')) return serviceDurations.pest;
        if (service.includes('emergency')) return serviceDurations.emergency;

        return serviceDurations.default;
    }

    function getSelectedPaymentMethod() {
        const selected = document.querySelector('input[name="paymentMethod"]:checked');

        if (!selected) return 'Cash';
        return selected.value === 'card' ? 'Card / UPI' : 'Cash';
    }

    function getSelectedDiscount() {
        const selected = document.querySelector('input[name="discountOption"]:checked');
        return selected ? selected.value : 'first';
    }

    function getSelectedDiscountLabel() {
        const selected = document.querySelector('input[name="discountOption"]:checked');
        const cardTitle = selected?.closest('.discount-option')?.querySelector('strong');
        return cardTitle ? cardTitle.textContent.trim() : 'First Order 20% Off';
    }

    function calculateDiscount(basePrice, discountType) {
        if (discountType === 'weekday') return Math.round(basePrice * 0.1);
        if (discountType === 'combo') return Math.min(150, basePrice);
        if (discountType === 'wallet') return Math.round(basePrice * 0.12);
        return Math.min(Math.round(basePrice * 0.2), 400);
    }

    function updateBookingPricing() {
        const basePrice = getServiceBasePrice(selectedService);
        const discountType = getSelectedDiscount();
        const savingsAmount = calculateDiscount(basePrice, discountType);
        const finalPrice = basePrice - savingsAmount;

        if (bookingBasePrice) bookingBasePrice.textContent = formatCurrency(basePrice);
        if (bookingSavings) bookingSavings.textContent = `- ${formatCurrency(savingsAmount)}`;
        if (bookingFinalPrice) bookingFinalPrice.textContent = formatCurrency(finalPrice);
        if (selectedVoucherName) selectedVoucherName.textContent = getSelectedDiscountLabel();

        return {
            basePrice,
            savingsAmount,
            finalPrice,
            discountType
        };
    }

    function saveActiveOrder(order) {
        activeOrder = order;
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    }

    function loadActiveOrder() {
        try {
            const raw = localStorage.getItem(ORDER_STORAGE_KEY);
            activeOrder = raw ? JSON.parse(raw) : null;
        } catch (error) {
            activeOrder = null;
        }
    }

    function updateTrackingUi(stage) {
        const stageOrder = ['booked', 'assigned', 'arriving', 'working'];
        const activeIndex = stageOrder.indexOf(stage);

        trackingSteps.forEach((step, index) => {
            step.classList.remove('is-done', 'is-active');

            if (index < activeIndex) {
                step.classList.add('is-done');
            } else if (index === activeIndex) {
                step.classList.add('is-active');
            }
        });
    }

    function updateOrdersButton() {
        if (!ordersBtn) return;
        ordersBtn.textContent = activeOrder ? 'Orders' : 'Orders';
        ordersBtn.title = activeOrder ? 'Open your latest order' : 'No active order yet';
    }

    function getAssignedPro(serviceName) {
        const service = (serviceName || '').toLowerCase();

        if (service.includes('paint')) return proDirectory.painters;
        if (service.includes('carpent')) return proDirectory.carpenters;
        if (service.includes('plumb')) return proDirectory.plumbers;
        if (service.includes('electric')) return proDirectory.electricians;
        if (service.includes('clean')) return proDirectory.cleaning;
        if (service.includes('ac')) return proDirectory.ac;
        if (service.includes('tv')) return proDirectory.tv;
        if (service.includes('pest')) return proDirectory.pest;

        return proDirectory.default;
    }

    function updateAssignedProUi() {
        const orderSource = activeOrder || {
            service: selectedService,
            address: bookingAddressInput ? bookingAddressInput.value.trim() : '',
            bookingSlot: formatBookingSlot(
                bookingDateInput ? bookingDateInput.value : '',
                bookingTimeInput ? bookingTimeInput.value : ''
            ),
            paymentMethod: getSelectedPaymentMethod(),
            finalPrice: updateBookingPricing().finalPrice,
            customerContact
        };
        const pro = getAssignedPro(orderSource.service);
        const serviceDuration = getServiceDuration(orderSource.service);
        const tracking = getTrackingStatus(
            activeOrder?.etaMinutes || getMinutesFromEta(pro.eta),
            activeOrder?.createdAt || Date.now()
        );

        if (assignedProAvatar) assignedProAvatar.textContent = pro.initials;
        if (assignedProName) assignedProName.textContent = pro.name;
        if (assignedProRole) assignedProRole.textContent = pro.role;
        if (assignedProRating) assignedProRating.textContent = pro.rating;
        if (assignedProJobs) assignedProJobs.textContent = pro.jobs;
        if (assignedProEta) assignedProEta.textContent = `${tracking.remainingMinutes} mins`;
        if (assignedProPhone) assignedProPhone.textContent = pro.phone;
        if (assignedArrivalWindow) assignedArrivalWindow.textContent = orderSource.bookingSlot || 'Date and time';
        if (assignedProStatus) assignedProStatus.textContent = tracking.status;
        if (assignedProVerification) assignedProVerification.textContent = 'Background, ID, and skill verified';
        if (assignedServiceDuration) assignedServiceDuration.textContent = serviceDuration;
        if (assignedOrderTotal) assignedOrderTotal.textContent = formatCurrency(orderSource.finalPrice || 0);
        if (callProBtn) callProBtn.href = `tel:${pro.phone.replace(/\s+/g, '')}`;
        updateTrackingUi(tracking.stage);

        if (briefAddress) {
            briefAddress.textContent = orderSource.address ? `Address confirmed: ${orderSource.address}` : 'Address confirmed for the visit.';
        }

        if (briefService) {
            briefService.textContent = orderSource.service ? `${orderSource.service} expert has been assigned.` : 'Your selected service is ready to begin.';
        }

        if (briefPhone) {
            briefPhone.textContent = `Contact number ready: ${pro.phone}`;
        }

        if (briefPayment) {
            briefPayment.textContent = `Payment method selected: ${orderSource.paymentMethod || 'Cash'}${orderSource.customerContact ? ` · Customer: ${orderSource.customerContact}` : ''}`;
        }

        if (prepNoteText) {
            prepNoteText.textContent = `${pro.name} will call before arrival if they need landmark help or access instructions.`;
        }

        if (successPaymentMethod) {
            successPaymentMethod.textContent = orderSource.paymentMethod || 'Cash';
        }

        if (successDiscountLabel) {
            successDiscountLabel.textContent = orderSource.discountLabel || getSelectedDiscountLabel();
        }

        if (successOrderStatus) {
            successOrderStatus.textContent = `Order placed · ${tracking.status}`;
        }

        if (successOrderDate) {
            const date = new Date(orderSource.createdAt || Date.now());
            successOrderDate.textContent = date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        }

        if (assignedProOtp) {
            assignedProOtp.textContent = orderSource.otp || '1234';
        }

        if (journeyPlacedText) {
            journeyPlacedText.textContent = `Booked for ${orderSource.bookingSlot || 'your selected slot'} with ${orderSource.paymentMethod || 'Cash'}.`;
        }

        if (journeyAssignedText) {
            journeyAssignedText.textContent = `${pro.name} is assigned and fully verified for ${orderSource.service || 'this service'}.`;
        }

        if (journeyArrivalText) {
            journeyArrivalText.textContent = `Current ETA is ${tracking.remainingMinutes} mins and the expert can be reached on ${pro.phone}.`;
        }

        if (journeyDurationText) {
            journeyDurationText.textContent = `Expected home service time: ${serviceDuration}. Total payable: ${formatCurrency(orderSource.finalPrice || 0)}.`;
        }
    }

    function startBookingFlow() {
        updateBookingPricing();

        if (!isLoggedIn) {
            openModal(loginModal);
        } else {
            if (bookingServiceName) {
                bookingServiceName.textContent = selectedService;
            }
            openModal(discountModal);
        }
    }

    // Function to open modal overlay and specific modal
    function openModal(modalEl) {
        modalOverlay.classList.add('active');
        // Hide all modals
        loginModal.style.display = 'none';
        loginModal.classList.remove('active');
        if (discountModal) {
            discountModal.style.display = 'none';
            discountModal.classList.remove('active');
        }
        bookingModal.style.display = 'none';
        bookingModal.classList.remove('active');
        if (paymentModal) {
            paymentModal.style.display = 'none';
            paymentModal.classList.remove('active');
        }
        successModal.style.display = 'none';
        successModal.classList.remove('active');

        // Show specific modal
        modalEl.style.display = 'block';
        // Small delay for CSS transition
        setTimeout(() => {
            modalEl.classList.add('active');
        }, 10);
    }

    // Function to close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        loginModal.classList.remove('active');
        if (discountModal) discountModal.classList.remove('active');
        bookingModal.classList.remove('active');
        if (paymentModal) paymentModal.classList.remove('active');
        successModal.classList.remove('active');

        setTimeout(() => {
            loginModal.style.display = 'none';
            if (discountModal) discountModal.style.display = 'none';
            bookingModal.style.display = 'none';
            if (paymentModal) paymentModal.style.display = 'none';
            successModal.style.display = 'none';
        }, 300); // match CSS transition duration
    }

    // Attach click events to all service card book buttons
    const bookButtons = document.querySelectorAll('.service-card .btn-primary');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent default hash navigation
            if (btn.getAttribute('href') === '#') {
                e.preventDefault();
            }

            // Try to extract service name from parent card
            const card = e.target.closest('.service-card');
            if (card) {
                const titleEl = card.querySelector('.service-title');
                if (titleEl) {
                    selectedService = titleEl.textContent;
                }
            } else {
                selectedService = 'General Consultation';
            }
            startBookingFlow();
        });
    });

    if (ordersBtn) {
        ordersBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (!activeOrder) {
                alert('No active order yet. Please book a service first.');
                return;
            }

            if (successServiceName) {
                successServiceName.textContent = activeOrder.service;
            }

            if (successBookingSlot) {
                successBookingSlot.textContent = activeOrder.bookingSlot;
            }

            updateAssignedProUi();
            openModal(successModal);
        });
    }

    if (navBookBtn) {
        navBookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedService = 'General Consultation';
            startBookingFlow();
        });
    }

    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedService = 'Emergency Home Support';
            startBookingFlow();
        });
    }

    if (navEmergencyBtn) {
        navEmergencyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedService = 'Emergency Home Support';
            startBookingFlow();
        });
    }

    // Handle Login Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            isLoggedIn = true;
            customerContact = loginEmailInput ? loginEmailInput.value.trim() : '';

            // Switch to discount modal
            loginModal.classList.remove('active');
            setTimeout(() => {
                loginModal.style.display = 'none';
                updateBookingPricing();
                openModal(discountModal);
            }, 300);
        });
    }

    if (discountForm) {
        discountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateBookingPricing();
            if (bookingServiceName) {
                bookingServiceName.textContent = selectedService;
            }
            discountModal.classList.remove('active');
            setTimeout(() => {
                discountModal.style.display = 'none';
                openModal(bookingModal);
            }, 300);
        });
    }

    // Function to handle booking completion logic
    function completeBooking(pricing, paymentMethod) {
        const bookingSlot = formatBookingSlot(
            bookingDateInput ? bookingDateInput.value : '',
            bookingTimeInput ? bookingTimeInput.value : ''
        );
        const bookingAddress = bookingAddressInput ? bookingAddressInput.value.trim() : '';
        const assignedPro = getAssignedPro(selectedService);

        saveActiveOrder({
            service: selectedService || 'General Consultation',
            bookingSlot,
            address: bookingAddress,
            createdAt: Date.now(),
            otp: Math.floor(1000 + Math.random() * 9000).toString(),
            etaMinutes: getMinutesFromEta(assignedPro.eta),
            basePrice: pricing.basePrice,
            savingsAmount: pricing.savingsAmount,
            finalPrice: pricing.finalPrice,
            discountType: pricing.discountType,
            discountLabel: getSelectedDiscountLabel(),
            paymentMethod,
            customerContact
        });

        if (successServiceName) {
            successServiceName.textContent = activeOrder.service;
        }

        if (successBookingSlot) {
            successBookingSlot.textContent = activeOrder.bookingSlot;
        }

        if (successPaymentMethod) {
            successPaymentMethod.textContent = activeOrder.paymentMethod;
        }

        updateAssignedProUi();
        updateOrdersButton();

        openModal(successModal);
    }

    // Handle Booking Submit
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload

            const pricing = updateBookingPricing();
            const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');

            if (paymentMethodInput && paymentMethodInput.value === 'card') {
                if (paymentModalTotal) {
                    paymentModalTotal.textContent = formatCurrency(pricing.finalPrice);
                }
                bookingModal.classList.remove('active');
                setTimeout(() => {
                    bookingModal.style.display = 'none';
                    openModal(paymentModal);
                }, 300);
                return;
            }

            const paymentMethod = getSelectedPaymentMethod();
            bookingModal.classList.remove('active');
            setTimeout(() => {
                bookingModal.style.display = 'none';
                completeBooking(pricing, paymentMethod);
            }, 300);
        });
    }

    // Handle Payment Submit
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            const pricing = updateBookingPricing();
            const paymentMethod = 'Card / UPI (Paid)';

            if (paymentModal) paymentModal.classList.remove('active');
            setTimeout(() => {
                if (paymentModal) paymentModal.style.display = 'none';
                completeBooking(pricing, paymentMethod);
            }, 300);
        });
    }

    // Close logic
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Escape key handling
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    if (bookingAddressInput) {
        bookingAddressInput.addEventListener('input', updateAssignedProUi);
    }

    discountOptions.forEach(option => {
        option.addEventListener('change', updateBookingPricing);
    });

    reviewFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedFilter = filter.dataset.reviewFilter || 'all';

            reviewFilters.forEach(item => item.classList.remove('is-active'));
            filter.classList.add('is-active');

            reviewCards.forEach(card => {
                const categories = (card.dataset.reviewCategory || '').split(' ');
                const shouldShow = selectedFilter === 'all' || categories.includes(selectedFilter);
                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });

    loadActiveOrder();
    updateOrdersButton();
    updateBookingPricing();
    updateAssignedProUi();
    setInterval(updateAssignedProUi, 60000);

});
