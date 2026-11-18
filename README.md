# Kaveri Coffee Roasters: Advanced Responsive Landing Page

A one-page, fully responsive website for a fictional coffee roaster in Thanjavur.
Built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step.

## How to run
1. Download or clone this repository.
2. Open `index.html` in any browser. No server or install needed.

## How to test responsiveness
1. Open in Chrome/Edge, press `F12`, then `Ctrl+Shift+M` for the device toolbar.
2. Set width to **375px**: no horizontal scrollbar, hamburger menu, one-column cards.
3. **768px**: inline navigation, three-column cards. **1024px+**: two-column hero.

## Features
- Mobile-first layout with breakpoints at 768px and 1024px
- Hamburger menu on mobile, inline navigation on larger screens
- Dark/light theme (remembers choice, respects system preference)
- Scroll-reveal animations, floating hero image, animated counters, scroll progress bar
- Product filter, add-to-bag counter and toast notification
- Newsletter form with validation and error animation
- Back-to-top button and active-section highlighting in the nav
- Accessible: semantic HTML, ARIA labels, focus styles, `prefers-reduced-motion` support

## Decisions
- **Mobile-first CSS** keeps the code short and the 375px layout correct by default.
- **Vanilla JS** with `IntersectionObserver` instead of scroll listeners for animations (better performance).
- **SVG images** keep the repo self-contained; all images use `max-width: 100%` so they never overflow.
- **Animations only run when JS is on** (`.js` class), so the page stays readable without JavaScript.

## Structure
responsive-landing-page/
├── index.html
├── README.md
├── css/style.css
├── js/main.js
└── images/ (hero, filter-coffee, espresso, cold-brew SVGs)