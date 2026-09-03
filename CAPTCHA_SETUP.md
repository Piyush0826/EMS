# Google reCAPTCHA Setup Guide

## Steps to Enable CAPTCHA in Your Application

### 1. Get Your CAPTCHA Keys from Google

1. **Visit Google reCAPTCHA Console:**
   - Go to: https://www.google.com/recaptcha/admin

2. **Sign In:**
   - Use your Google account (create one if needed)

3. **Create a New Site:**
   - Click the "+" button to create a new site
   - **Label:** Employee Management System
   - **reCAPTCHA Type:** Select "reCAPTCHA v3"
   - **Domains:** Add your domain (e.g., `localhost`, `yourdomain.com`)
   - Accept the reCAPTCHA terms
   - Click **SUBMIT**

4. **Copy Your Keys:**
   - You'll see:
     - **Site Key** (Public Key)
     - **Secret Key** (Private Key)

### 2. Frontend Configuration

#### In `frontend/src/pages/Login.jsx` (ALREADY DONE)

The site key is already set in the ReCAPTCHA component:
```jsx
<ReCAPTCHA
  ref={recaptchaRef}
  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"  // Replace with your Site Key
  onChange={handleCaptchaChange}
  theme="light"
  size="normal"
/>
```

**Update the `sitekey` with your actual Site Key from Google**

### 3. Backend Configuration

#### Add to `server/.env` file:

```env
# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Example:**
```env
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

### 4. Steps Summary

| Component | Step | Value |
|-----------|------|-------|
| Frontend | Update Site Key | Go to `frontend/src/pages/Login.jsx` line ~125 |
| Backend | Update Secret Key | Go to `server/.env` file |
| Both | Test | Run the application and test login with CAPTCHA |

---

## How It Works

### Frontend Flow:
1. User fills in email, password, and verification code
2. User attempts to verify with "I'm not a robot" CAPTCHA
3. Google reCAPTCHA v3 gives a token (invisible verification)
4. Form submission is disabled until CAPTCHA is verified
5. Token is sent to backend with login credentials

### Backend Flow:
1. Backend receives the CAPTCHA token
2. Verifies token with Google servers using Secret Key
3. If valid (score > 0.5), proceeds with login
4. If invalid, returns error message
5. User must retry CAPTCHA

---

## File References

- **Frontend:** [Frontend Login Component](frontend/src/pages/Login.jsx)
- **Backend:** [Auth Controller with CAPTCHA](server/controller/authController.js)

---

## Testing

### Local Testing:
```
sitekey: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
secretKey: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

These are test keys provided by Google. They always pass. Use them for development.

### Production Testing:
Once you have your actual keys from Google reCAPTCHA console:
1. Replace test keys with your production keys
2. Test the login flow
3. Monitor reCAPTCHA analytics in the Google Console

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CAPTCHA not showing | Check if Site Key is correct in Login.jsx |
| "CAPTCHA verification failed" | Update Secret Key in .env file |
| CAPTCHA verification always passes in dev | You're using test keys (this is normal) |
| Error: Cannot read property 'getValue' | Make sure ref={recaptchaRef} is properly set |

---

## reCAPTCHA v3 Benefits

- ✅ **No user interaction** - invisible CAPTCHA
- ✅ **Better UX** - users don't see "I'm not a robot"
- ✅ **Score-based** - suspicious activity gets lower scores
- ✅ **Mobile friendly** - works seamlessly on all devices

---

## Security Notes

- 🔒 **Never** expose your Secret Key in frontend code
- 🔒 Always validate CAPTCHA server-side
- 🔒 Keep `.env` file in `.gitignore`
- 🔒 Rotate keys periodically for production apps

---

## Additional Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Implementation Best Practices](https://developers.google.com/recaptcha/docs/v3)
