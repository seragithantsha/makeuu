// Preloader
window.addEventListener("load", () => {
	const preloader = document.querySelector(".preloader");
	gsap.to(preloader, {
		opacity: 0,
		duration: 0.5,
		onComplete: () => (preloader.style.display = "none"),
	});
});

// Custom Cursor
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", (e) => {
	gsap.to(cursor, {
		x: e.clientX,
		y: e.clientY,
		duration: 0.3,
	});
});

document.querySelectorAll("a, button").forEach((el) => {
	el.addEventListener("mouseenter", () => {
		gsap.to(cursor, { scale: 2, duration: 0.3 });
	});
	el.addEventListener("mouseleave", () => {
		gsap.to(cursor, { scale: 1, duration: 0.3 });
	});
});

// Fullscreen Menu
const menuToggle = document.querySelector(".menu-toggle");
const fullscreenMenu = document.querySelector(".fullscreen-menu");
const menuCloseBtn = document.querySelector(".menu-close-btn");

function toggleMenu() {
	menuToggle.classList.toggle("active");
	fullscreenMenu.classList.toggle("active");
	document.body.classList.toggle("no-scroll"); // Add this line
}

menuToggle.addEventListener("click", toggleMenu);
menuCloseBtn.addEventListener("click", toggleMenu);

// Optional: Close when clicking outside menu content
fullscreenMenu.addEventListener("click", function (e) {
	if (e.target === fullscreenMenu) {
		toggleMenu();
	}
});

// Initialize Horizontal Scroll
let horizontalScroll;
function initHorizontalScroll() {
	const galleryTrack = document.querySelector(".gallery-track");
	let galleryWidth = galleryTrack.scrollWidth;

	function updateGalleryWidth() {
		galleryWidth = galleryTrack.scrollWidth;
	}

	window.addEventListener("resize", updateGalleryWidth);

	if (horizontalScroll) horizontalScroll.kill();

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
}

// Work Section Filtering with Grid Layout - FINAL VERSION
const filters = document.querySelectorAll(".filter");
const workGallery = document.querySelector(".work-gallery");
const workGrid = document.querySelector(".work-grid");
const gridCategories = document.querySelectorAll(".grid-category");

filters.forEach((filter) => {
	filter.addEventListener("click", () => {
		// Reset active states
		filters.forEach((f) => f.classList.remove("active"));
		filter.classList.add("active");

		const filterValue = filter.getAttribute("data-filter");

		if (filterValue === "all") {
			// Show horizontal scroll, hide grid
			workGallery.style.display = "block";

			// Hide all grids

			// Reinitialize horizontal scroll
			initHorizontalScroll();
			ScrollTrigger.refresh();

			// Reset section height
			document.querySelector(".work").style.minHeight = "auto";
		} else {
			// Hide all grids first
			gridCategories.forEach((cat) => cat.classList.remove("active"));

			// Show only the selected category grid
			const targetGrid = document.querySelector(`.${filterValue}-grid`);
			if (targetGrid) {
				targetGrid.classList.add("active");
			}

			// Expand section height
			document.querySelector(".work").style.minHeight = "150vh";

			// Kill horizontal scroll to prevent conflicts
			if (horizontalScroll) horizontalScroll.kill();
		}
	});
});

document.addEventListener("DOMContentLoaded", function () {
	const editorialSection = document.querySelector(".editorial-feature");
	let isScrolling = false;
	let scrollTimeout;

	function handleScroll() {
		if (isScrolling) return;

		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			const sectionRect = editorialSection.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const sectionMiddle = sectionRect.top + sectionRect.height / 2;
			const windowMiddle = windowHeight / 2;
			const distanceToMiddle = sectionMiddle - windowMiddle;

			// Only snap if the section is close to middle (within 1/3 of viewport)
			if (Math.abs(distanceToMiddle) < windowHeight / 3) {
				isScrolling = true;

				window.scrollTo({
					top: window.scrollY + distanceToMiddle,
					behavior: "smooth",
				});

				// Reset after scrolling
				setTimeout(() => {
					isScrolling = false;
				}, 1000);
			}
		}, 100); // Debounce delay
	}

	// Use passive scroll for better performance
	window.addEventListener("scroll", handleScroll, { passive: true });
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Title Animation
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

// About Section Animation
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

// Contact Form Animation
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

// Initialize horizontal scroll on load
document.addEventListener("DOMContentLoaded", initHorizontalScroll);

// Initialize ScrollTrigger for snapping
function initScrollSnap() {
	// Horizontal scroll for work gallery
	const galleryTrack = document.querySelector(".gallery-track");
	const galleryWidth = galleryTrack.scrollWidth;

	gsap.to(galleryTrack, {
		x: () => -(galleryWidth - document.documentElement.clientWidth),
		ease: "none",
		scrollTrigger: {
			trigger: ".work-gallery",
			start: "center center",
			end: () => `+=${galleryWidth}`,
			pin: true,
			scrub: 1,
			snap: {
				snapTo: 1 / (document.querySelectorAll(".work-item").length - 1),
				duration: { min: 0.2, max: 0.6 },
				ease: "power1.inOut",
			},
			onLeave: () => {
				// Snap to editorial section after gallery
				gsap.to(window, {
					scrollTo: {
						y: document.querySelector(".editorial-feature").offsetTop,
						autoKill: false,
					},
					duration: 0.8,
				});
			},
		},
	});
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
	initScrollSnap();
});
