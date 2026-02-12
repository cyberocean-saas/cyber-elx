# CyberOcean Custom Pages CLI Tool

This directory contains documentation for customizing the CyberOcean ELX platform.

## Documentation Index

### [LoginRegisterPagesDev.md](LoginRegisterPagesDev.md)
Custom Login & Register pages using Vue.js components. Covers the multi-step login flow (email → password → login) and password recovery flow (send code → verify → new password). Also documents the registration form with optional email verification. Includes available props, events to emit, and complete working examples.

### [PaymentPageDev.md](PaymentPageDev.md)
Custom Payment page for course enrollment. Handles guest vs logged-in user states, displays course information with price breakdown, and provides payment method selection (online payment or course request). Documents the course object structure, user object, and all dialog interactions.

### [StudentCourseDetailPageDev.md](StudentCourseDetailPageDev.md)
Custom Student Course Detail page for viewing individual courses. Displays course cover, header with logo/name, description, and accordion-style curriculum with chapters and lessons. Features a sticky price card sidebar with promo pricing, course info, buy/request button, and expiration text. Includes video modal for free preview playback and responsive 2-column to 1-column layout.

### [StudentCoursePlayerDev.md](StudentCoursePlayerDev.md)
Custom Student Course Player for enrolled students. Two-panel layout with sidebar (course card, description/files tabs, accordion chapters with progress tracking) and viewer area (video player with custom controls). Non-video elements (quiz, pdf, iframe, youtube) are rendered via a named slot by the parent component. Supports mobile responsive view switching and RTL for Arabic locales.

### [StudentCssDev.md](StudentCssDev.md)
CSS customization guide for the Student Dashboard. Covers navbar styling (background color, profile button, dropdown menu) and sidebar styling (background, active items, hover effects, submenu items). Includes important notes about using `::before` for backgrounds and required `!important` overrides.

### [StudentListCoursesPageDev.md](StudentListCoursesPageDev.md)
Custom Student List Courses page (course catalog). Displays categories grid, featured courses with flip-card hover effect, and promoted courses horizontal slider with navigation. Includes responsive design (1-4 columns), primary color theming via Vuex store, and slider state management with resize handling.

### [StudentMyCoursesPageDev.md](StudentMyCoursesPageDev.md)
Custom Student My Courses page (student dashboard home). Shows statistics cards (total courses, completed, certificates), course list with progress bars, and certificate generation for completed courses. Documents the cardsInfos structure, courses array with progress tracking, and available translation keys.

### [StudentStartupDev.md](StudentStartupDev.md)
Available JavaScript variables for student-related customizations. Documents the student user object accessible via `$nuxt.$store.state.auth.user` including fields like id, name, email, phone, grade, and profile image.

### [TeacherCssDev.md](TeacherCssDev.md)
CSS customization guide for the Teacher Dashboard. Same structure as StudentCssDev.md - covers navbar styling and sidebar styling with examples for background colors, active states, hover effects, and responsive behavior.

### [ThemeDev.md](ThemeDev.md)
Comprehensive theme development guide using Liquid templating. Covers layout structure, sections, templates, and all available Liquid variables for each page type (home, course, courses, category, blog, blogs, contact, about). Includes object structures for courses, categories, articles, and website URLs.
