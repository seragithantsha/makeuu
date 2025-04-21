// Wait for DOM and all assets to load
document.addEventListener("DOMContentLoaded", () => {
	// Initialize GSAP plugins
	gsap.registerPlugin(ScrollTrigger);

	// Preloader animation
	const initPreloader = () => {
		const preloader = document.querySelector(".preloader");
		if (preloader) {
			gsap.to(preloader, {
				opacity: 0,
				duration: 0.5,
				onComplete: () => (preloader.style.display = "none"),
			});
		}
	};

	// Custom cursor effects
	const initCustomCursor = () => {
		const cursor = document.querySelector(".cursor");
		if (!cursor) return;

		// Mouse movement tracking
		document.addEventListener("mousemove", (e) => {
			gsap.to(cursor, {
				x: e.clientX,
				y: e.clientY,
				duration: 0.3,
			});
		});

		// Hover effects for interactive elements
		document.querySelectorAll("a, button").forEach((el) => {
			el.addEventListener("mouseenter", () =>
				gsap.to(cursor, { scale: 2, duration: 0.3 })
			);
			el.addEventListener("mouseleave", () =>
				gsap.to(cursor, { scale: 1, duration: 0.3 })
			);
		});
	};

	// Fullscreen menu functionality
	const initFullscreenMenu = () => {
		const menuToggle = document.querySelector(".menu-toggle");
		const fullscreenMenu = document.querySelector(".fullscreen-menu");
		const menuCloseBtn = document.querySelector(".menu-close-btn");

		if (!menuToggle || !fullscreenMenu) return;

		const toggleMenu = () => {
			menuToggle.classList.toggle("active");
			fullscreenMenu.classList.toggle("active");
			document.body.classList.toggle("no-scroll");
		};

		menuToggle.addEventListener("click", toggleMenu);
		if (menuCloseBtn) menuCloseBtn.addEventListener("click", toggleMenu);

		// Close when clicking outside menu content
		fullscreenMenu.addEventListener("click", (e) => {
			if (e.target === fullscreenMenu) toggleMenu();
		});
	};

	// Horizontal scroll gallery
	const initHorizontalScroll = () => {
		const galleryTrack = document.querySelector(".gallery-track");
		if (!galleryTrack) return;

		let galleryWidth = galleryTrack.scrollWidth;
		let horizontalScroll;

		const updateGalleryWidth = () => {
			galleryWidth = galleryTrack.scrollWidth;
			ScrollTrigger.refresh();
		};

		window.addEventListener("resize", updateGalleryWidth);

		horizontalScroll = gsap.to(galleryTrack, {
			x: () => -(galleryWidth - document.documentElement.clientWidth),
			ease: "smooth",
			scrollTrigger: {
				trigger: ".work-gallery",
				start: "70% 70%",
				end: () => `+=${galleryWidth}`,
				pin: true,
				scrub: 1,
				invalidateOnRefresh: true,
			},
		});

		return horizontalScroll;
	};

	// Work section filtering
	const initWorkFiltering = (horizontalScroll) => {
		const filters = document.querySelectorAll(".filter");
		const workGallery = document.querySelector(".work-gallery");
		const gridCategories = document.querySelectorAll(".grid-category");

		if (!filters.length) return;

		filters.forEach((filter) => {
			filter.addEventListener("click", () => {
				filters.forEach((f) => f.classList.remove("active"));
				filter.classList.add("active");

				const filterValue = filter.dataset.filter;
				const workSection = document.querySelector(".work");

				if (filterValue === "all") {
					workGallery.style.display = "block";
					gridCategories.forEach((cat) => cat.classList.remove("active"));
					initHorizontalScroll();
					ScrollTrigger.refresh();
					if (workSection) workSection.style.minHeight = "auto";
				} else {
					gridCategories.forEach((cat) => cat.classList.remove("active"));
					const targetGrid = document.querySelector(`.${filterValue}-grid`);
					if (targetGrid) targetGrid.classList.add("active");
					if (workSection) workSection.style.minHeight = "150vh";
					if (horizontalScroll) horizontalScroll.kill();
				}
			});
		});
	};

	// Section snapping
	const initSectionSnapping = () => {
		const editorialSection = document.querySelector(".editorial-feature");
		if (!editorialSection) return;

		let isScrolling = false;
		let scrollTimeout;

		const handleScroll = () => {
			if (isScrolling) return;

			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				const sectionRect = editorialSection.getBoundingClientRect();
				const windowHeight = window.innerHeight;
				const distanceToMiddle =
					sectionRect.top + sectionRect.height / 2 - windowHeight / 2;

				if (Math.abs(distanceToMiddle) < windowHeight / 3) {
					isScrolling = true;
					window.scrollTo({
						top: window.scrollY + distanceToMiddle,
						behavior: "smooth",
					});
					setTimeout(() => (isScrolling = false), 1000);
				}
			}, 100);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
	};

	// gsap smooth
	gsap.to(".parallax-layer", {
		yPercent: 30,
		ease: "none",
		scrollTrigger: {
			trigger: ".container",
			scrub: true,
		},
	});

	// Page animations
	const initAnimations = () => {
		// Hero section
		gsap.from(".hero-title .line", {
			y: "100%",
			duration: 1,
			stagger: 0.1,
			ease: "power3.out",
		});

		gsap.from(".hero-subtitle", {
			opacity: 0,
			y: 20,
			duration: 1,
			delay: 0.5,
			ease: "power3.out",
		});

		// About section
		gsap.from(".about-image", {
			scrollTrigger: {
				trigger: ".about",
				start: "top 80%",
			},
			x: -100,
			opacity: 0,
			duration: 1,
		});

		gsap.from(".about-content", {
			scrollTrigger: {
				trigger: ".about",
				start: "top 80%",
			},
			x: 100,
			opacity: 0,
			duration: 1,
		});

		// Contact section
		gsap.from(".contact-form", {
			scrollTrigger: {
				trigger: ".contact",
				start: "top 80%",
			},
			y: 50,
			opacity: 0,
			duration: 1,
			stagger: 0.1,
		});
	};

	// Initialize all components
	const init = () => {
		initPreloader();
		initCustomCursor();
		initFullscreenMenu();
		const horizontalScroll = initHorizontalScroll();
		initWorkFiltering(horizontalScroll);
		initSectionSnapping();
		initAnimations();
	};

	// Start the application
	init();
});
