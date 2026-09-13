# UMEED — AI-Assisted Micro-Finance Platform

> **Turning financial opportunity into hope.**

UMEED is an AI-assisted micro-finance platform designed to bridge the gap between **small businesses seeking accessible funding** and **investors looking for transparent and structured investment opportunities**.

---

## 🚀 Problem Statement

Small businesses often struggle to access timely and affordable credit due to slow, complicated, and restrictive traditional lending processes.

At the same time, investors need transparent and structured opportunities to invest in small businesses while managing risk.

UMEED addresses this gap through **AI-assisted trust assessment, transparent funding contracts, automated revenue sharing, and controlled repayment**.

---

## 💡 Our Solution

UMEED provides a complete digital financing workflow:

**Merchant → AI Trust Assessment → Contract → Investor Funding → Payment → Revenue Split → Repayment Tracking**

### 👨‍💼 For Merchants

- Phone-based registration and OTP verification
- Digital business profile
- AI-assisted trust score
- Recommended financing limit
- Custom funding contracts
- Marketplace listing
- Repayment tracking
- Merchant dashboard

### 💰 For Investors

- Secure registration and authentication
- Browse listed funding opportunities
- View contract details
- Commit investment capital
- Track funding progress
- Investor dashboard
- Monitor active investments

---

## 🤖 AI-Assisted Trust Scoring

UMEED uses **Google Gemini** to analyze business information and generate:

- Trust Score
- Recommended Contract Cap
- Risk Rationale

The platform also includes a **safe baseline fallback**, ensuring that the financing workflow can continue even if the AI service is temporarily unavailable.

---

## 💸 Dynamic Revenue Sharing

Once a contract reaches **100% funding**, it becomes active.

When a repayment is received, UMEED automatically distributes the payment according to the agreed contract terms.

### Example

| Recipient | Share |
|-----------|------:|
| Investor | 12% |
| Platform | 1% |
| Merchant | 87% |

For a ₹1,000 repayment:

- **Investor → ₹120**
- **Platform → ₹10**
- **Merchant → ₹870**

The system also enforces the repayment cap to prevent over-repayment.

---

## 🔐 Payment & Security

UMEED integrates a **Razorpay test-mode payment flow**.

The payment system includes:

- Razorpay payment orders
- QR/payment flow
- Webhook signature verification
- Duplicate webhook protection
- Idempotent transaction processing
- Repayment-cap enforcement
- Transaction ledger

This ensures that the same payment cannot be processed twice.

---

## 🔄 Contract Lifecycle

```text
Draft
  ↓
Listed
  ↓
Funded
  ↓
Active
  ↓
Fulfilled
```


---


## 🏗️ Technology Stack
- Frontend
- React
- Vite
- JavaScript
- Axios
- Backend
- Node.js
- Express.js
- JWT Authentication
- REST APIs
- Database
- PostgreSQL
- Prisma ORM
- AI
- Google Gemini
- Payments
- Razorpay Test Mode
- Deployment
- Vercel — Frontend
- Render — Backend
- Neon PostgreSQL — Database

---

## 📁 Project Structure
```UMEED/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── prisma/
│   └── ...
│
└── vercel.json

```
---

## 🌐 Live Demo
- Frontend

https://bitnbuild-goa-2026.vercel.app

- Backend

https://fairfuture-backend.onrender.com

---

## 👥 Team
Team 404 Not Found

We are a team focused on building practical technology solutions to real-world problems using modern software development and AI technologies.

---

## 🏆 Hackathon
Track 3

Project Title:
UMEED — AI-Assisted Transparent Micro-Finance Platform

---

## 🎯 Key Features
- 🔐 Phone OTP Authentication
- 👨‍💼 Merchant Onboarding
- 💰 Investor Onboarding
- 🤖 AI-Assisted Trust Scoring
- 📄 Digital Funding Contracts
- 📋 Contract Marketplace
- 💵 Investor Funding
- 📊 Funding Progress Tracking
- 🔒 100% Funding Gate
- 📱 Razorpay Payment & QR Flow
- ⚡ Automated Revenue Splitting
- 🔁 Webhook Idempotency
- 🧾 Transaction Ledger
- 🛡️ Repayment Cap Enforcement
- 📈 Merchant Dashboard
- 📊 Investor Dashboard
- 🔄 AI Baseline Fallback

---

## 🔮 Future Scope
- Advanced AI-based risk prediction
- Improved business verification
- Real-time notifications
- Advanced investor analytics
- Production payment integration
- More financial institutions and funding partners
- Mobile application
- Enhanced fraud detection

---

## 🌱 Our Vision

UMEED aims to make financing more accessible for small businesses while giving investors a transparent and structured way to participate.

UMEED — Turning financial opportunity into hope.

---

# ❤️ Built With

React • Vite • Node.js • Express.js • PostgreSQL • Prisma • Google Gemini • Razorpay • Vercel • Render • Neon
