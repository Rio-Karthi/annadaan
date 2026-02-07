# Annadaan Deep Dive - Part 2: Core Logic

## 3. Server Actions (`src/app/actions/`)
In Next.js, "Server Actions" are functions that run securely on the server but can be called from the frontend like normal functions. This is where the magic happens.

### `post.ts` (Creating Donations)
**Purpose:** Handles the "Create Post" form submission.
**Key Lines Explained:**
*   `'use server'`: Tells Next.js "This code MUST run on the server, never send it to the browser."
*   `auth()`: Checks who is currently logged in.
*   `prisma.foodPost.create({...})`: The command that actually saves the data into the database.
*   `revalidatePath(...)`: Tells the website "Hey, new data exists! Refresh the Dashboard so users see it immediately."

### `request.ts` (Claiming Food)
**Purpose:** Handles when a Receiver clicks "Request".
**Key Logic:**
*   It checks if the post is still `ACTIVE`.
*   It checks if the user is not requesting their *own* post.
*   `prisma.request.create`: Creates a "Request" record linking the Post, the Donor, and the Receiver.
*   `createNotification`: We manually trigger a notification to the Donor saying "Someone wants your food!".

### `notifications.ts` (System Alerts)
**Purpose:** Manages the bell icon alerts.
**Key Functions:**
*   `getNotifications`: Fetches the list for the current user.
*   `markAsRead`: specific update command `prisma.notification.update({ data: { read: true } })`.
*   `createNotification`: A helper function we use everywhere else to generate alerts.

---

## 4. Key Components (`src/components/`)

### `landing/hero.tsx` ( The First Impression)
This file controls the big flashy section on the home page.
*   **GlassCard:** A custom component (`src/components/ui/glass-card.tsx`) that uses `backdrop-filter: blur()` to create that frosted glass effect.
*   **Framer Motion (`<motion.div>`):** You'll see tags like `<motion.div animate={{ y: -10 }}>`. This isn't HTML; it's a special component that handles animation. It roughly translates to "Move this element up 10 pixels smoothly".

### `navbar.tsx` (Navigation)
**Purpose:** The top bar.
**Logic:**
*   It uses `usePathname()` to know which page you are on (to highlight the active tab).
*   It conditionally renders:
    *   If `userId` exists? Show "Dashboard".
    *   If not? Show "Sign In".

---

## 5. The Dashboard (`src/app/dashboard/`)

### `layout.tsx` (The Wrapper)
**Concept:** This file wraps *every* page inside the dashboard.
**Why:**
*   It holds the **Sidebar** and **Top Navbar**.
*   Because it's in a `layout`, the sidebar doesn't reload when you click links; only the center content changes.
*   **PageTransition:** We wrapped `{children}` (the page content) in a `PageTransition` component to make pages fade-in smoothly.

### `page.tsx` (Conditionals)
**Logic:**
*   The dashboard homepage determines your **Role** (Donor vs Receiver).
*   If you are a Donor -> redirects to `/dashboard/donor/my-posts`.
*   If you are a Receiver -> redirects to `/dashboard/receiver/feed`.
*   This ensures users only see what is relevant to them.

---

## 6. Scripts (`scripts/`)
These are manual tools for the developer (you).

### `cleanup.js` / `wipe-db.ts`
**Purpose:** Emergency Reset.
**Danger:** It uses `deleteMany({})` on every table. In SQL terms, this is `DELETE FROM table;`. It wipes everything clean for testing.

---
**Summary for the Beginner:**
1.  **Database** holds the truth.
2.  **Prisma** talks to the Database.
3.  **Components** show the data to the user.
4.  **Actions** take user input and update the Database.
5.  **Tailwind** makes it look good.
