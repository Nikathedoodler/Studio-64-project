# Studio 64 Website – Detailed Project Scope

## 1. Project Foundation

-   [x] Next.js project with Supabase Auth template (already set up)
-   [ ] Tailwind CSS and component libraries for rapid prototyping
-   [ ] Prepare for Windows XP-inspired design (to be implemented after backbone is ready)
-   [ ] Set up i18n for English and Georgian

---

## 2. Desktop Interface & Window System

### 2.1 Desktop UI

-   [ ] Desktop background (admin-changeable)
-   [ ] Desktop icons for main features (folders, apps, etc.)
-   [ ] Top toolbar: logo, menu, language switch
-   [ ] Right-click context menu (same as logo dropdown)
-   [ ] Responsive: On mobile, background shrinks, icons stack, windows stretch to width

### 2.2 Window System

-   [ ] Draggable, closable windows
-   [ ] Multiple windows of the same type can be open simultaneously
-   [ ] Each window has a unique, readable, shareable URL (e.g., `/window/photos/123`)
-   [ ] Windows can be opened from desktop icons, menus, or links

---

## 3. Core Features (MVP)

### 3.1 Portfolio Folder

-   [ ] Subfolders: Videos, Photos, Logos, Fonts, Brandbooks, Our Clients
-   [ ] Media viewers:
    -   [ ] Video player (with playlist, file name display)
    -   [ ] Image viewer (with navigation, file name display)
    -   [ ] Font previewer (type and preview)

### 3.2 My Files Folder

-   [ ] Subfolders: Team, Work Process, My Videos, Equipment
-   [ ] Media viewers as above

### 3.3 Merch Folder

-   [ ] Merchandise photos
-   [ ] Player with "Buy" button (links to shop, to be implemented later)

### 3.4 Recycle Bin

-   [ ] Window with fun, non-clickable icons

---

## 4. File Format Support

-   [ ] Support for images, videos, PDFs, and fonts
-   [ ] Font previewer: user can type text and preview in different fonts

---

## 5. User Authentication & Roles

-   [ ] Use Supabase Auth (already set up)
-   [ ] Roles:
    -   [ ] Admin: Can add/remove desktop icons, change background, colors, and other site features
    -   [ ] Newsletter Subscriber: Can access paid newsletter
    -   [ ] Regular User/Guest: Can browse public features
-   [ ] Only newsletter and admin features require login
-   [ ] Registration: email+password (option to subscribe to newsletter)

---

## 6. Admin Features

-   [ ] Admin can:
    -   [ ] Add/remove desktop icons and folders
    -   [ ] Change desktop background and color
    -   [ ] Upload, modify, delete media
-   [ ] Admin interface location: To be decided (main site or separate app)

---

## 7. Payment & Subscription

-   [ ] Integrate local payment provider (to be done after MVP)
-   [ ] Support for:
    -   [ ] Donations (e.g., office mortgage)
    -   [ ] Newsletter subscription (paid)
    -   [ ] Shop purchases (one-time and recurring)
-   [ ] "Buy" button in merch player links to shop (to be implemented later)

---

## 8. Newsletter

-   [ ] Paid newsletter, accessible only to registered, subscribed users
-   [ ] Registration is free; subscription is paid
-   [ ] Newsletter can be accessed on site (Word file style window)
-   [ ] Integrate with Mailchimp or alternative for email delivery

---

## 9. Services & Analytics

-   [ ] Services Window (Word Doc Style):
    -   [ ] Text info about services (production, design, marketing, rental)
    -   [ ] Highlight/select text, change font size, background color
    -   [ ] Clickable links to service folders
    -   [ ] Mini menu for headings/sections
-   [ ] Audience Window (Excel Style):
    -   [ ] Analytics: followers, views, engagement, demographics
    -   [ ] Clickable platforms open detailed windows
-   [ ] My Sites (Web Browser Style):
    -   [ ] Window styled as browser, showing Studio 64’s digital platforms

---

## 10. Shop

-   [ ] Online shop for merch, photos, fonts, etc.
-   [ ] Supports one-time and recurring payments (after MVP)

---

## 11. About & Perks

-   [ ] About 64 (Word File Style): History, mission, goals, vision
-   [ ] Office Mortgage (Perk): Donation window with progress display

---

## 12. Media Storage

-   [ ] Use Supabase Storage for all website media (default)
-   [ ] Consider Google Drive integration if client requests (future enhancement)
-   [ ] Note: Google Drive is better for document collaboration, Supabase is better for integrated, secure media serving

---

## 13. Mobile & SEO

-   [ ] Mobile-first responsive design for all features
-   [ ] Ensure platform is SEO-friendly (meta tags, sitemap, etc.)
-   [ ] Optimize site load times and assets

---

## 14. Email Server

-   [ ] Set up email server for registration, notifications, and newsletter (using Google client if possible)

---

## 15. Admin/Content Management

-   [ ] Admin can modify content, add/remove icons, upload/change/delete media from backend
-   [ ] Admin interface location: To be decided

---

## 16. Internationalization

-   [ ] Implement i18n for English and Georgian
-   [ ] All UI, menus, and content should support both languages

---

## 17. Future Enhancements

-   [ ] Integrate Google Drive for document-style windows if needed
-   [ ] Expand analytics and admin features
-   [ ] Add more advanced integrations as requested

---

## Open Questions / To Be Decided

-   Final design and UI details (after design assets are ready)
-   Payment provider selection (local solution, after MVP)
-   Admin interface location (main site or separate app)
-   Newsletter delivery method (on-site, email, or both)
-   Google Drive integration for media/documents (pending client preference)
-   SEO strategy (open to suggestions)

---

## Timeline

-   **MVP Demo:** As soon as core features are ready (showcase progress incrementally)
-   **Final Launch:** End of October

---

# Technical Architecture

## 1. Tech Stack Overview

-   **Frontend:** Next.js (React), Tailwind CSS, Shadcn/UI or similar component libraries
-   **Backend:** Supabase (Auth, Database, Storage)
-   **Other Services:** Mailchimp (newsletter), Local payment provider (future), Google client for email (future)

## 2. Directory Structure

-   `app/` – Next.js app directory (routes, pages, layouts)
-   `components/` – Reusable UI components (buttons, forms, windows, etc.)
-   `lib/` – Utility functions, Supabase client setup, middleware
-   `public/` – Static assets (if needed)
-   `scope.md` – Project scope and documentation

## 3. Authentication & Authorization

-   **Supabase Auth** handles user registration, login, and roles
-   **Roles:**
    -   Admin: Can manage site content and settings
    -   Newsletter Subscriber: Access to paid newsletter
    -   Regular User/Guest: Public features only
-   **Protected Routes:**
    -   Admin and newsletter features require authentication

## 4. Data Storage

-   **Supabase Database:** Stores structured data (users, roles, content metadata, etc.)
-   **Supabase Storage:** Stores media files (images, videos, fonts, PDFs)
-   **Google Drive:** (Future) For document collaboration or client preference

## 5. API & Data Flow

-   **Frontend** communicates with Supabase via client and server components
-   **Server Components** (Next.js) handle secure data fetching and business logic
-   **Supabase Client** is used for real-time updates and direct queries
-   **API Routes** (if needed) for custom logic or integrations

## 6. Internationalization (i18n)

-   **i18n** setup for English and Georgian
-   Language switcher in the UI
-   All content and UI elements support both languages

## 7. Responsive Design

-   **Mobile-first** approach
-   Desktop: Windows XP-style desktop, draggable windows, icons
-   Mobile: Icons stack, background shrinks, windows stretch to width

## 8. Third-Party Integrations

-   **Mailchimp** for newsletter email delivery
-   **Local Payment Provider** (to be integrated after MVP)
-   **Google client** for email server (future)

## 9. Deployment & Hosting

-   **Deployment Platform:** (To be decided, e.g., Vercel, Netlify)
-   **Environment Variables:** Managed securely for Supabase keys, Mailchimp, etc.
-   **CI/CD:** (Optional, can be added for automated deployments)

## 10. Extensibility

-   Modular component and folder structure for easy feature addition
-   Admin interface for content and settings management
-   Future integrations (Google Drive, advanced analytics, etc.) can be added with minimal refactoring

---
