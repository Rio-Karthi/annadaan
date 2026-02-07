# Annadaan - Complete Codebase Deep Dive (Beginner's Guide)

## 0. Preface: Application Concepts
Before diving into code, let's understand the "building blocks" utilized in this project.

### What is a Web App?
A web application is software that runs in a web browser. Unlike a simple static website (which just shows text/images), a web app is interactive—it stores data, logs users in, and changes based on user input.

### The "Stack" Explained
*   **Frontend (What you see):** We use **React** and **Next.js**. Imagine React as a box of Lego bricks (components like Buttons, Inputs) that we assemble to build pages.
*   **Backend (The Brain):** Next.js also handles the "brain" work—talking to the database and processing logic.
*   **Database (The Memory):** We use **PostgreSQL** via **Prisma**. Think of the database as a giant Excel sheet where we keep lists of Users, Food Posts, and Messages. Prisma is a translator that lets us write JavaScript code to talk to that database instead of complex SQL queries.
*   **Styling (The Look):** **Tailwind CSS**. Instead of writing separate CSS files, we add "classes" directly to elements (e.g., `text-red-500` makes text red).

---

## 1. Project Structure Explained
Here is why every folder in your project exists:

```
/ (Root Directory)
├── src/                <- SOURCE CODE. 99% of your work is here.
│   ├── app/            <- THE ROUTER. Every folder here is a URL page.
│   │   ├── dashboard/  <- Functionality (Feed, Create Post, History)
│   │   ├── api/        <- Backend routes (e.g., Image Uploads)
│   │   ├── page.tsx    <- The Home Page (Landing Page)
│   │   └── layout.tsx  <- The Frame (Navbar, Footer) wrapped around pages.
│   ├── components/     <- LEGO BRICKS. Reusable UI parts.
│   │   ├── ui/         <- Basic parts (Buttons, Inputs, Cards).
│   │   ├── donor/      <- Components specific to Donors.
│   │   └── receiver/   <- Components specific to Receivers.
│   ├── lib/            <- HELPERS. Configuration codes (Database connection).
│   └── actions/        <- SERVER ACTIONS. Functions that run on the server.
├── prisma/             <- DATABASE.
│   └── schema.prisma   <- The Map. Defines what a "User" or "Post" looks like.
├── public/             <- ASSETS. Static images, fonts, icons.
├── scripts/            <- AUTOMATION. Programs to run maintenance (like cleanup).
├── .env                <- SECRETS. API Keys, Passwords (NEVER SHARE THIS).
└── package.json        <- THE ID CARD. Lists all installed tools (dependencies).
```

---

## 2. Configuration Files (The Setup)

### `package.json`
**What is it?** It's the manifest file for any Node.js project.
**Key Parts:**
*   `"scripts"`: Commands you can run. `npm run dev` starts the app.
*   `"dependencies"`: Libraries we installed (like `framer-motion` for animations).
*   `"devDependencies"`: Tools only needed while coding (like `typescript`).

### `prisma/schema.prisma`
**What is it?** The blueprint for your database.
**Code Breakdown:**
*   `model User`: Defines a table for Users. It has fields like `id`, `email`, `role`.
*   `model FoodPost`: Defines a table for Food. It links back to a `User` (the Donor).
*   `model Transaction`: Records who gave what to whom.

### `middleware.ts`
**What is it?** The Gatekeeper.
**What it does:** Every time someone opens a page, this file runs *first*. It checks "Is this user logged in via Clerk?". If not, it kicks them to the Sign-In page.

---

(Continued in Part 2: Detailed File Walkthrough...)
