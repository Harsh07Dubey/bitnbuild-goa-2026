# CreditFlow / FairFuture — Razorpay Isolated Sandbox Server

This is an isolated, lightweight backend helper for generating server-side Razorpay Orders (`order_id`) and validating HMAC SHA256 payment signatures during hackathon presentations.

It is completely decoupled from the main backend, databases, and Prisma, running strictly on port **5001**.

---

## Quick Start (Optional Helper)

To run the sandbox server:

```bash
cd razorpay-sandbox
npm install
npm start
```

Or from the root directory:
```bash
npm --prefix razorpay-sandbox install && node razorpay-sandbox/server.js
```

The server will listen on `http://localhost:5001`.

---

## Offline Resilience Mode (Zero-Backend)

If this server is NOT running, the CreditFlow frontend automatically activates **Mode A (Direct Standard Test Mode)**, directly opening the Razorpay modal using the client test key `rzp_test_TapGP2kHFhqm7a`. No presentation will ever stall!

---

## Endpoints

- `GET /health`: Health status and key confirmation.
- `POST /api/razorpay/create-order`:
  ```json
  {
    "amount": 50000,
    "currency": "INR",
    "contractId": "CON-001"
  }
  ```
- `POST /api/razorpay/verify`:
  ```json
  {
    "razorpay_order_id": "order_xxxx",
    "razorpay_payment_id": "pay_xxxx",
    "razorpay_signature": "xxxx"
  }
  ```
