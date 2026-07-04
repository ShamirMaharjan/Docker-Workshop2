# Your Workspace

A high-fidelity, emotion-aware task management pipeline built on the MERN stack. Engineered to mitigate cognitive overload through a ruthless "Later, Today, Done" architecture and real-time behavioral feedback.

Developed by **Thaveesha Vithana**.

![Commander Workspace Preview](client/public/img_1.png)

## Base
Traditional to-do applications function as infinite, anxiety-inducing backlogs. This workspace is designed like a flight deck. It physically limits active cognitive load, forces prioritization, and utilizes an animated companion node to provide real-time telemetry on user stress levels based on active task volume.

## Tech Stack
* **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide Icons.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ORM).
* **Authentication:** JSON Web Tokens (JWT) in HTTP-only cookies, Google OAuth 2.0, Cloudflare Turnstile.
* **Infrastructure:** Nginx Reverse Proxy, PM2 Process Management.

## Security Architecture

This workspace employs a multi-layered, enterprise-grade security protocol:

1. **Bot Mitigation:** All unauthenticated entry points (Login, Register, Password Reset) are gated by **Cloudflare Turnstile**, preventing brute-force and credential-stuffing attacks.
2. **Stateless Authentication:** Successful logins generate a securely signed JWT. This token is **never** exposed to local storage; it is transmitted via strict HTTP-only, secure, SameSite cookies to mitigate XSS (Cross-Site Scripting) attacks.
3. **Cryptographic Storage:** Passwords are never stored in plaintext. They are salted and hashed utilizing `bcrypt` (Cost Factor 10) before database insertion.
4. **Time-Based Verification:** Password resets and sensitive profile mutations (email/password changes) require a 6-digit One-Time Password (OTP) dispatched via Nodemailer. The OTP is cryptographically hashed in the database and automatically self-destructs after 5 minutes utilizing MongoDB TTL (Time-To-Live) indexes.
5. **Self-Destruct Protocol:** Users maintain absolute data sovereignty. The profile settings feature a localized self-destruct mechanism that comprehensively wipes the user document, all associated tasks, and hanging OTPs from the database cluster instantly.

## Local Development Setup

### 1. Environment Variables
You can find a `.env.example` file in both `/client` and `/server` directory

*/Client*
- Create a `.env` file in the `/client` directory, **copy & paste** the details from `/client/.env.example`.

*/Server*
- Create a `.env` file in the `/server` directory, **copy & paste** the details from`/server/.env.example`.
- Manually enter the values for `EMAIL_USER` and `USER_PASS`. Values for them can't be provided even for development due to security reasons.

**(ALL PROVIDED VALUES ARE FOR DEVELOPEMNT AND TESTING PURPOSES ONLY. THEY WILL EXPIRE ON 08/07/2026 FOR SECURITY REASONS, REPLACE THEM ON OR BEFORE)**


### 2. Installation and Execution
Open two terminal instances.

**Terminal 1 (Server)**
```
cd server
npm install
npm run dev
```

**Terminal 2 (Client)**
```
cd client
npm install
npm run dev
```

