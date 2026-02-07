# Annadaan: The Complete Project Documentation

## 1. What is Annadaan?
**Annadaan** (Sanskrit for "Donating Food") is a technology-driven platform designed to eliminate food waste and hunger. It connects people who have surplus food (restaurants, households, events) directly with people who need it (NGOs, shelters, volunteers).

### The Problem
Millions of tons of food are wasted daily while millions go hungry. The gap isn't a lack of food; it's a lack of **logistics**.

### The Solution
Annadaan provides a real-time bridge:
1.  **Donors** post available food with photos and location.
2.  **Receivers** see nearby food on a map/feed.
3.  They **request** the food.
4.  They **chat** to coordinate pickup.
5.  The transaction is verified and completed.

---

## 2. Technology Stack (The Tools We Used)

### Core Frameworks
*   **Next.js 14 (App Router):** The main framework. It handles the "Frontend" (what you see) and the "Backend" (api routes, server actions) in one place.
*   **React 18:** The library for building the user interface.
*   **TypeScript:** A stricter version of JavaScript that prevents bugs by ensuring data types (like ensuring a "Phone Number" is actually a number).

### Database & Storage
*   **PostgreSQL:** The database where all data (Users, Posts, Messages) is stored.
*   **Prisma ORM:** A tool that lets our code talk to the database using simple commands (`prisma.user.create`) instead of complex SQL.
*   **UploadThing:** A service used to store images (food photos).

### Authentication
*   **Clerk:** Handles all user security. Sign Up, Sign In, Forgot Password, and protecting private pages.

### UI & Styling
*   **Tailwind CSS:** For styling (colors, spacing, layout).
*   **Shadcn/UI:** A library of beautiful, pre-made components (Buttons, Dialogs, Cards).
*   **Framer Motion / GSAP:** Libraries used for the "Million Dollar" animations (smooth scrolling, magnetic buttons).
*   **Lucide React:** The icon pack.

---

## 3. The Complete File System Explained
Here is a breakdown of **EVERY** file and folder in your project and what it does.

### Root Directory (/)
*   **`.env`**: **SECRETS**. Stores your API Keys (Database URL, Clerk Keys). Never share this file.
*   **`.gitignore`**: Tells Git "Ignore these files". (e.g., node_modules, .env).
*   **`.npmrc`**: Configuration for NPM. currently set to `legacy-peer-deps=true` to fix installation issues.
*   **`next.config.mjs`**: Configuration for Next.js. Ours includes strict image security (allowing images from `utfs.io` and `img.clerk.com`).
*   **`package.json`**: The **ID Card** of the project. Lists name, version, scripts (`npm run dev`), and all installed libraries (`dependencies`).
*   **`package-lock.json`**: Use to lock dependencies to a specific version.
*   **`postcss.config.mjs`**: Config for PostCSS (a tool that Tailwind uses).
*   **`readme.md`**: The instruction manual for other developers.
*   **`tailwind.config.ts`**: The Design System. Defines our custom colors, fonts, and animations (like `accordion-down`, `float`).
*   **`tsconfig.json`**: Rules for TypeScript.

### Prisma Folder (`/prisma`)
*   **`schema.prisma`**: **THE DATABASE BLUEPRINT**. This file defines your tables (`User`, `FoodPost`, `Transaction`) and their relationships. It is the Single Source of Truth for data.

### Scripts (`/scripts`)
*   **`cleanup.js`**: A "Hard Reset" tool. Running this deletes ALL users and data from both the Database and Clerk. Dangerous!
*   **`wipe-db.ts`**: A softer reset. deletes only the database records, but keeps the User accounts.

### Source Code (`/src`)

#### `/src/app` ( The Router )
In Next.js, folders here become URLs. `src/app/dashboard` -> `your-site.com/dashboard`.

*   **`layout.tsx`**: The **Parent Frame**. It wraps the entire application. It holds the `<html>` and `<body>` tags and global providers (Clerk, Toaster).
*   **`page.tsx`**: The **Home Page**. This is the Landing Page with the "Hero" section, features, and animations.
*   **`globals.css`**: The Global Stylesheet. Contains Tailwind imports and basic CSS resets.
*   **`loading.tsx`**: The Global Loader. Shows the "Cute Circle Loader" while pages are fetching data.
*   **`api/`**: Backward-compatible API routes.
    *   **`uploadthing/core.ts`**: Defines *who* is allowed to upload images (Authenticated users).
    *   **`uploadthing/route.ts`**: Expects the upload request.

#### `/src/app/dashboard` ( The Main App )
*   **`layout.tsx`**: The Dashboard Frame. Contains the **Sidebar** and **Top Navigation**. Wraps all dashboard pages.
*   **`page.tsx`**: The Redirector. Checks if you are a Donor or Receiver and sends you to the right place.

**Donor Pages:**
*   **`donor/create/page.tsx`**: The "Donate Food" form.
*   **`donor/my-posts/page.tsx`**: Lists food you have donated.
*   **`donor/my-posts/edit/[id]/page.tsx`**: Page to edit an existing post.
*   **`donor/requests/page.tsx`**: Lists incoming requests from people who want your food.

**Receiver Pages:**
*   **`receiver/feed/page.tsx`**: The main feed. Shows a list/map of all available food.
*   **`receiver/my-requests/page.tsx`**: Tracks food you have requested.
*   **`receiver/pickups/page.tsx`**: Shows food approved for pickup.

**Shared Pages:**
*   **`history/page.tsx`**: Shows past completed transactions.
*   **`messages/page.tsx`**: The Chat list.
*   **`messages/[chatRoomId]/page.tsx`**: The actual Chat Room.
*   **`notifications/page.tsx`**: List of alerts (bells).
*   **`profile/page.tsx`**: User Profile settings (powered by Clerk).

#### `/src/app/actions` ( Server Logic )
These are functions that run on the server to handle data.
*   **`post.ts`**: Creating/Editing food posts.
*   **`request.ts`**: Creating a request for food.
*   **`manage-requests.ts`**: Accepting/Rejecting requests.
*   **`manage-posts.ts`**: Deleting posts.
*   **`chat.ts`**: Sending/Receiving messages.
*   **`notifications.ts`**: Fetching/Marking notifications.
*   **`transaction.ts`**: Completing the handover.

#### `/src/components` ( The Building Blocks )
*   **`navbar.tsx`**: The top navigation bar.
*   **`landing/`**: Components for the home page (Hero, Features).
*   **`ui/`**: **Core UI Elements**.
    *   `button.tsx`: A standard button.
    *   `card.tsx`: A box with a shadow.
    *   `input.tsx`: Text box.
    *   `sonner.tsx`: The Toast notification component.
    *   `magnetic-button.tsx`: Button that follows cursor.
    *   `text-reveal.tsx`: Animation for text.
    *   `circle-loader.tsx`: The cute loading animation.
    *   ...and many others (dialog, label, textarea).
*   **`maps/`**:
    *   `location-map.tsx`: The interactive map component (Receiver view).
    *   `location-search.tsx`: The address autocomplete (Donor view).
*   **`chat/`**: Chat window components.

#### `/src/lib` ( Helper Functions )
*   **`prisma.ts`**: Creates a single connection to the database (Singleton pattern).
*   **`utils.ts`**: Helper to merge CSS class names (cn function).
*   **`uploadthing.ts`**: Helpers for the image uploader.

#### `/src/middleware.ts`
**Role:** The Security Guard.
**Function:** It checks every request. If a user tries to access `/dashboard` without logging in, this file stops them and redirects them to `/sign-in`.
