# TRUE CARE: World-Class Caregiver Management System

![TRUE CARE Dashboard](https://raw.githubusercontent.com/gideongeny/TRUE-CARE/main/web/public/dashboard-preview.png)

TRUE CARE is a premium, secure, and highly scalable platform designed to connect patients with professional caregivers. It features a world-class administrative dashboard, a native Android application for caregivers and patients, and a robust, secure API.

## 🌟 Key Features

### 🏛️ Administrative Portal (Web)
*   **Ultra-Premium UI**: Glassmorphism-inspired design that surpasses industry standards (aaniie.com).
*   **Complete Oversight**: Manage caregivers, patients, shifts, and service requests from a single source of truth.
*   **Real-time Analytics**: Monitor platform performance and activity with interactive data visualizations.
*   **Hardened Security**: Military-grade encryption (AES-256), rate limiting, and secure admin-only authentication.

### 📱 TRUE CARE Mobile (Android)
*   **Dual-Role Support**: Tailored experiences for both Caregivers (shifts, clock-ins) and Patients (service requests, schedules).
*   **Real-time Sync**: Instant updates between the mobile app and the administrative dashboard.
*   **Premium Branding**: A world-class interface that ensures compassionate care starts with a great user experience.

### 🛡️ Secure Core (API)
*   **Scalable Architecture**: Designed to handle thousands of records and high-concurrency requests.
*   **Security First**: Protected by Helmet, CORS, Rate-Limiting, and JWT-based role authorization.
*   **Prisma ORM**: Type-safe database interactions for maximum reliability.

## 🚀 Tech Stack

*   **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide Icons.
*   **Mobile**: Native Android (Kotlin), Coroutines, Retrofit.
*   **Backend**: Node.js, Express, Prisma ORM, SQLite/PostgreSQL.
*   **Security**: express-rate-limit, jsonwebtoken, bcryptjs, helmet.

## 🛠️ Setup Instructions

### Administrative Website
```bash
cd web
npm install
npm run dev
```

### Backend API
```bash
cd api
npm install
npx prisma generate
npm run dev
```

### Android Application
1. Open the `android` folder in Android Studio.
2. Sync Project with Gradle Files.
3. Build -> Build APK(s) or Generate Signed Bundle/APK.

## 🔒 Security Best Practices
TRUE CARE is designed to be "hard to hack":
*   **JWT Revocation Layers**: Secure token-based access.
*   **Brute-Force Protection**: IP-based rate limiting on all sensitive endpoints.
*   **Data Sanitization**: Robust validation on all incoming data.
*   **Security Headers**: Helmet integration for XSS and Clickjacking protection.

---
Created with ❤️ by TRUE CARE Team.
