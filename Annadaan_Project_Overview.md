# Annadaan - Project Overview

## 1. Introduction
**Annadaan** is a community-driven food redistribution platform designed to bridge the gap between food surplus and food scarcity. It allows "Donors" (restaurants, households, event organizers) to post available food, and "Receivers" (NGOs, shelters, volunteers) to find and claim this food efficiently.

The application focuses on speed, trust, and ease of use, leveraging real-time location services, instant notifications, and a seamless user interface to ensure food reaches those in need before it spoils.

---

## 2. Technology Stack

### Core Framework
*   **Next.js 14 (App Router):** The backbone of the application, providing server-side rendering (SSR), API routes, and efficient routing.
*   **React 18:** Library for building dynamic user interfaces.
*   **TypeScript:** Ensures type safety and code reliability throughout the project.

### Database & Authentication
*   **Prisma ORM:** Modern database toolkit for easy and type-safe database queries.
*   **PostgreSQL:** The relational database used to store users, posts, transactions, and messages (hosted via Neon or similar).
*   **Clerk:** A complete authentication solution handling User Management (Sign Up, Sign In, Profile) and security.

### UI & Styling
*   **Tailwind CSS:** Utility-first CSS framework for rapid and responsive styling.
*   **Shadcn/UI:** A collection of re-usable components built on top of Radix UI and Tailwind.
*   **Framer Motion / GSAP:** Libraries for advanced animations, transitions, and "million-dollar" UI effects.
*   **Lucide React:** Icon set.

### Features & Integrations
*   **UploadThing:** For handling image uploads (drug-and-drop food images).
*   **Leaflet / React-Leaflet:** For interactive maps and location selection.
*   **OpenStreetMap API:** For address search and geolocation.
*   **Sonner:** For beautiful toast notifications.

---

## 3. Workflow & Architecture

### User Roles
1.  **Donor:** Creates food posts, manages pickup locations, and approves handovers.
2.  **Receiver:** Browses available food, requests items, and confirms pickup.

### Core Workflows

#### A. Food Donation Flow
1.  **Create Post:** Donor fills a form (Title, Quantity, Food Type, Expiry).
2.  **Add Location:** Donor selects pickup location on a map or searches address.
3.  **Upload Image:** Donor takes a photo of the food.
4.  **Publish:** Post becomes visible on the "Feed".

#### B. Food Request Flow
1.  **Browse Feed:** Receiver sees a list/map of nearby available food.
2.  **Request:** Receiver clicks "Request" on an item.
3.  **Chat:** A private chat room is created between Donor and Receiver to coordinate.
4.  **Accept:** Donor accepts the request. Status changes to `ACCEPTED`.

#### C. Verification & Handoff
1.  **Pickup:** Receiver arrives and marks "Picked Up" (Status: `WAITING_APPROVAL`).
2.  **Confirmation:** Donor confirms the handover.
3.  **Complete:** Transaction is marked `COMPLETED` and added to history.

---

## 4. Key Features
*   **Live Location Search:** Autocomplete address finding.
*   **Real-time Notifications:** Alerts for requests, messages, and status changes.
*   **Glassmorphism UI:** Premium aesthetic with blur effects and 3D animations.
*   **Interactive Maps:** Visualizing food availability geographically.
*   **Secure Chat:** Built-in messaging system for privacy.
