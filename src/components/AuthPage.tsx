import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  db,
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  updateProfile,
  doc,
  setDoc,
  serverTimestamp,
  User,
  ConfirmationResult
} from '../firebase';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 
  | 'login' 
  | 'register' 
  | 'forgot_password' 
  | 'reset_sent' 
  | 'verify_email' 
  | 'phone_otp';

type AuthTab = 'email' | 'phone';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
];

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  // Mode & Tab State
  const [activeTab, setActiveTab] = useState<AuthTab>('email');
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Phone Auth Fields
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sentToPhone, setSentToPhone] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Last unverified user email for verify_email screen
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  // Clean up reCAPTCHA verifier on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (_) {}
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('farmy_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Cooldown countdown timer for resend buttons
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Clean error on mode or tab switch
  const switchMode = (mode: AuthMode) => {
    setErrorMsg(null);
    setInfoMsg(null);
    setAuthMode(mode);
  };

  const switchTab = (tab: AuthTab) => {
    setErrorMsg(null);
    setInfoMsg(null);
    setActiveTab(tab);
    if (authMode === 'phone_otp' && tab === 'email') {
      setAuthMode('login');
    }
  };

  // Detailed Firebase error mapper displaying actual errors and actionable guidance
  const handleFirebaseError = (err: any) => {
    console.error('Firebase Auth error:', err);
    const code = err?.code || '';
    const rawMsg = err?.message || '';

    switch (code) {
      // Phone Authentication Specific
      case 'auth/operation-not-allowed':
        return `Firebase Phone Authentication is not enabled in this Firebase project (error: ${code}). Please enable the "Phone" sign-in provider in Firebase Console > Authentication > Sign-in method > Phone.`;
      case 'auth/invalid-phone-number':
        return `The phone number entered is invalid (${code}). Please ensure the country code is correct and the number has standard length.`;
      case 'auth/missing-phone-number':
        return `Please enter a valid phone number (${code}).`;
      case 'auth/quota-exceeded':
        return `SMS quota exceeded for this Firebase project (${code}). Please add phone numbers for testing in Firebase Console or try again later.`;
      case 'auth/captcha-check-failed':
        return `reCAPTCHA verification failed (${code}). Please try again or refresh the page.`;
      case 'auth/invalid-app-credential':
        return `Firebase app verification failed (${code}). Please ensure this domain is added to Authorized Domains in Firebase Console > Authentication > Settings.`;
      case 'auth/unauthorized-domain':
        return `Domain not authorized in Firebase (${code}). Add this domain to Authorized Domains in Firebase Console > Authentication > Settings.`;
      case 'auth/invalid-verification-code':
        return `Incorrect 6-digit verification code (${code}). Please check your SMS and try again.`;
      case 'auth/code-expired':
        return `The verification code has expired (${code}). Please click "Resend OTP" to get a fresh code.`;
      case 'auth/session-expired':
        return `The SMS session has expired (${code}). Please request a new verification code.`;
      case 'auth/too-many-requests':
        return `Too many requests sent (${code}). For your security, please wait a few moments and retry.`;
      case 'auth/network-request-failed':
        return `Network request failed (${code}). Please check your internet connection and retry.`;
      case 'auth/internal-error':
        return `Firebase internal error (${code}): ${rawMsg || 'Please try again.'}`;

      // Email / Password / Google Authentication
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No FARMY account found with this email. Please check or create an account.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again or reset your password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in or use password reset.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters with letters and numbers.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In was cancelled before finishing.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';

      default:
        return code ? `[${code}] ${rawMsg || 'Authentication error occurred. Please try again.'}` : (rawMsg || 'An unexpected error occurred. Please try again.');
    }
  };

  // ==========================================
  // 1. EMAIL SIGN-IN
  // ==========================================
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (rememberMe) {
        localStorage.setItem('farmy_remembered_email', email.trim());
      } else {
        localStorage.removeItem('farmy_remembered_email');
      }

      // Check if email is verified
      if (!user.emailVerified) {
        setUnverifiedEmail(user.email || email.trim());
        setAuthMode('verify_email');
        setLoading(false);
        return;
      }

      // Sync user profile to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          authProvider: 'password',
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Could not update Firestore profile:', dbErr);
      }

      onAuthSuccess(user);
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. CREATE ACCOUNT (REGISTRATION)
  // ==========================================
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Update Firebase Profile display name
      await updateProfile(user, {
        displayName: fullName.trim()
      });

      // Send Firebase Email Verification
      await sendEmailVerification(user);

      // Save user profile in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          displayName: fullName.trim(),
          authProvider: 'password',
          createdAt: serverTimestamp(),
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore doc creation error:', dbErr);
      }

      setUnverifiedEmail(user.email || email.trim());
      setInfoMsg('Account created successfully! We have sent a verification link to your email.');
      setAuthMode('verify_email');
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. EMAIL VERIFICATION CHECKS & RESEND
  // ==========================================
  const handleCheckEmailVerified = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          onAuthSuccess(auth.currentUser);
          return;
        }
      }
      setErrorMsg('Your email is not verified yet. Please click the link in your inbox, then click here.');
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailVerification = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setInfoMsg(`A fresh verification email has been sent to ${auth.currentUser.email}.`);
        setResendCooldown(45);
      } else {
        setErrorMsg('Please sign in first so we can re-send your verification link.');
      }
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. FORGOT PASSWORD
  // ==========================================
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please provide your email address to receive the password reset link.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAuthMode('reset_sent');
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 5. GOOGLE SIGN-IN
  // ==========================================
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync Firestore profile
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          authProvider: 'google',
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Could not sync Firestore profile:', dbErr);
      }

      onAuthSuccess(user);
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 6. PHONE AUTHENTICATION & OTP
  // ==========================================
  const formatE164Phone = (code: string, phone: string): string => {
    // Strip everything except digits and leading plus
    let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    // Remove leading zeros commonly entered in local formats (e.g., 09876543210 -> 9876543210)
    cleaned = cleaned.replace(/^0+/, '');
    const cleanCode = code.startsWith('+') ? code : `+${code}`;
    return `${cleanCode}${cleaned}`;
  };

  const isValidE164Phone = (formatted: string): boolean => {
    // E.164: + followed by 1-3 digits country code and 7-12 digits subscriber number (total 8-15 digits)
    return /^\+[1-9]\d{7,14}$/.test(formatted);
  };

  const getCleanRecaptchaVerifier = async (): Promise<RecaptchaVerifier> => {
    // Ensure recaptcha-container element exists in the DOM
    let container = document.getElementById('recaptcha-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'recaptcha-container';
      document.body.appendChild(container);
    }

    // Clean up any stale or previous widget to avoid internal reCAPTCHA collision
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (clearErr) {
        console.warn('reCAPTCHA clear warning:', clearErr);
      }
      recaptchaVerifierRef.current = null;
    }

    container.innerHTML = '';

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        setErrorMsg('reCAPTCHA verification expired. Please click Send OTP again.');
        if (recaptchaVerifierRef.current) {
          try {
            recaptchaVerifierRef.current.clear();
          } catch (_) {}
          recaptchaVerifierRef.current = null;
        }
      }
    });

    await verifier.render();
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleSendPhoneOtp = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const formattedPhone = formatE164Phone(countryCode, phoneNumber);
    if (!isValidE164Phone(formattedPhone)) {
      setErrorMsg('Please enter a valid mobile number with standard digits (e.g. 10 digits for India).');
      return;
    }

    setLoading(true);

    try {
      const appVerifier = await getCleanRecaptchaVerifier();
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

      setConfirmationResult(confirmation);
      setSentToPhone(formattedPhone);
      setAuthMode('phone_otp');
      setResendCooldown(60);
      setOtpValues(['', '', '', '', '', '']);
      setInfoMsg(`Verification code sent to ${formattedPhone}`);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      console.error('Firebase Phone Auth OTP send error:', err);
      // Clean up verifier on error so subsequent clicks start fresh
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (_) {}
        recaptchaVerifierRef.current = null;
      }
      const container = document.getElementById('recaptcha-container');
      if (container) container.innerHTML = '';

      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP inputs
  const handleOtpChange = (index: number, val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    const newOtp = [...otpValues];
    newOtp[index] = digitsOnly.slice(-1);
    setOtpValues(newOtp);

    // Auto-advance to next input if digit entered
    if (digitsOnly && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtpValues(newOtp);
    const nextEmptyIndex = newOtp.findIndex((v) => !v);
    if (nextEmptyIndex !== -1) {
      otpInputRefs.current[nextEmptyIndex]?.focus();
    } else {
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const code = otpValues.join('').trim();
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    if (!confirmationResult) {
      setErrorMsg('Verification session expired. Please request a new OTP code.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      const user = userCredential.user;

      // Sync Firestore profile for phone user
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName || `Farmer ${user.phoneNumber?.slice(-4) || ''}`,
          authProvider: 'phone',
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore phone profile sync error:', dbErr);
      }

      setInfoMsg('Phone verified successfully! Welcome to FARMY.');
      onAuthSuccess(user);
    } catch (err: any) {
      console.error('Firebase Phone Auth OTP verify error:', err);
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 select-none overflow-x-hidden bg-[#041209]">
      {/* Background Farm Landscape Image with Warm Golden Sunset */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[3px] scale-105 transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />

      {/* Dark Forest Green Vignette & Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04130b]/92 via-[#06180e]/90 to-[#020b06]/96 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#031008]/60 to-[#010804] pointer-events-none" />

      {/* Invisible container for Firebase Phone Auth reCAPTCHA */}
      <div id="recaptcha-container" />

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[430px] rounded-[2.25rem] bg-[#0c2217]/92 backdrop-blur-2xl border border-emerald-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-6 sm:p-8 text-white overflow-hidden"
      >
        {/* Subtle Decorative Leaf / Plant Silhouette in Background */}
        <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none opacity-20 -mr-6 -mt-6">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M140 20C100 20 80 60 70 90C60 120 40 140 20 150C60 140 100 110 120 80C140 50 145 30 140 20Z"
              fill="#34d399"
            />
            <path
              d="M125 55C105 70 85 95 75 110"
              stroke="#6ee7b7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M110 80C95 90 85 102 80 115"
              stroke="#6ee7b7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="absolute -bottom-8 -left-8 w-36 h-36 pointer-events-none opacity-15">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M20 140C60 140 80 100 90 70C100 40 120 20 140 10C100 20 60 50 40 80C20 110 15 130 20 140Z"
              fill="#10b981"
            />
          </svg>
        </div>

        {/* TOP BRANDING: Agriculture Emblem + SPARK + FARMY */}
        <div className="text-center relative z-10 mb-6">
          {/* Sprout with Plowed Furrow Lines Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-2">
            <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]">
              {/* Central Sprout Leaf */}
              <path 
                d="M36 12C36 12 45 20 45 32C45 40 39 46 36 48C33 46 27 40 27 32C27 20 36 12 36 12Z" 
                fill="#4ade80" 
              />
              {/* Left Leaf */}
              <path 
                d="M34 32C34 32 23 27 20 37C17 46 25 50 30 48C32 44 33 38 34 32Z" 
                fill="#22c55e" 
              />
              {/* Right Leaf */}
              <path 
                d="M38 30C38 30 49 26 53 35C57 44 50 49 44 48C41 44 39 37 38 30Z" 
                fill="#86efac" 
              />
              {/* Center Stem Glow */}
              <path 
                d="M36 30V50" 
                stroke="#fef08a" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              {/* Furrow Line 1 (Plowed Soil) */}
              <path 
                d="M20 54C25 51 32 50 36 50C40 50 47 51 52 54" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              {/* Furrow Line 2 */}
              <path 
                d="M16 60C23 57 31 56 36 56C41 56 49 57 56 60" 
                stroke="#fbbf24" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              {/* Furrow Line 3 */}
              <path 
                d="M22 66C27 63 32 62 36 62C40 62 45 63 50 66" 
                stroke="#d97706" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          {/* SPARK Brand */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.14em] text-amber-400 font-serif leading-none drop-shadow-sm">
            SPARK
          </h1>

          {/* Welcome back to FARMY */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-3">
            {authMode === 'register' 
              ? 'Join FARMY Today' 
              : authMode === 'forgot_password' || authMode === 'reset_sent'
              ? 'Reset Password'
              : authMode === 'verify_email'
              ? 'Verify Your Email'
              : authMode === 'phone_otp'
              ? 'Verification Code'
              : 'Welcome back to FARMY'}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-emerald-200/70 font-medium tracking-wide mt-1">
            {authMode === 'phone_otp' 
              ? `We have sent a verification code to ${sentToPhone || `${countryCode} ${phoneNumber}`}.`
              : authMode === 'verify_email'
              ? `We have sent you a verification email to ${unverifiedEmail || email}. Verify it and log in.`
              : 'Smarter Farming. Brighter Future.'}
          </p>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 shadow-sm"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </motion.div>
          )}

          {infoMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{infoMsg}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AUTHENTICATION TABS (Shown on Login and Registration) */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="bg-[#07190f]/90 p-1 rounded-2xl border border-emerald-900/60 flex items-center mb-5 relative">
            <button
              type="button"
              onClick={() => switchTab('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'email'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/30'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Sign-In</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'phone'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/30'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Phone Authentication</span>
            </button>
          </div>
        )}

        {/* SCREEN 1: EMAIL SIGN IN (Matches Reference Image Exactly) */}
        {authMode === 'login' && activeTab === 'email' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {/* Email Address Input */}
            <div className="relative rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-emerald-400/80" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3.5 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="relative rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-emerald-400/80" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3.5 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400/70 hover:text-amber-400 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer text-emerald-200/90 hover:text-white">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#07190f] border-emerald-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-0 focus:ring-1"
                />
                <span className="font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => switchMode('forgot_password')}
                className="text-amber-400/95 hover:text-amber-300 font-semibold hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Large Primary "Sign In" Golden Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-950/40 text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-75 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Divider: ──── OR ──── */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-emerald-800/60" />
              <span className="px-3 text-[11px] font-bold text-emerald-400/70 tracking-widest uppercase">
                OR
              </span>
              <div className="flex-1 border-t border-emerald-800/60" />
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-stone-800 bg-white hover:bg-stone-100 active:scale-[0.98] transition-all shadow-md text-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75"
            >
              {/* Official Google G Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Don't have an account? Create Account */}
            <div className="text-center pt-3">
              <span className="text-xs text-emerald-200/70">
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 2: PHONE AUTHENTICATION (INPUT PHONE NUMBER) */}
        {authMode === 'login' && activeTab === 'phone' && (
          <form onSubmit={handleSendPhoneOtp} className="space-y-4">
            {/* Country Selector & Phone Number Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80 block">
                Mobile Number
              </label>

              <div className="flex items-center gap-2">
                {/* Country Code Dropdown */}
                <div className="relative w-32 shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-[#07190f]/95 border border-emerald-800/60 px-3 py-3.5 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-stone-900 text-white">
                        {c.flag} {c.code} ({c.country.slice(0, 7)})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Phone Number Field */}
                <div className="relative flex-1 rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-emerald-400/80" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-9 pr-3 py-3.5 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-300/60 leading-relaxed">
              Standard SMS rates may apply. A 6-digit verification code will be sent to your device.
            </p>

            {/* Send OTP Golden Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-950/40 text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <span>Send OTP</span>
              )}
            </button>

            {/* Divider: ──── OR ──── */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-emerald-800/60" />
              <span className="px-3 text-[11px] font-bold text-emerald-400/70 tracking-widest uppercase">
                OR
              </span>
              <div className="flex-1 border-t border-emerald-800/60" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-stone-800 bg-white hover:bg-stone-100 active:scale-[0.98] transition-all shadow-md text-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* SCREEN 3: PHONE OTP VERIFICATION */}
        {authMode === 'phone_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* 6-Digit OTP Boxes */}
            <div className="flex items-center justify-between gap-2 sm:gap-2.5">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className="w-11 sm:w-12 h-13 sm:h-14 text-center rounded-xl bg-[#07190f]/95 border-2 border-emerald-800/70 focus:border-amber-400 focus:bg-emerald-950/70 text-white font-mono text-xl font-bold outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Verify & Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-950/40 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>

            {/* Secondary Actions: Resend OTP & Change Number */}
            <div className="flex items-center justify-between text-xs pt-1 text-emerald-200/80">
              <button
                type="button"
                onClick={() => handleSendPhoneOtp()}
                disabled={resendCooldown > 0 || loading}
                className="text-amber-400 font-semibold hover:underline disabled:opacity-50 disabled:no-underline transition-colors"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setActiveTab('phone');
                }}
                className="text-emerald-300 hover:text-white underline transition-colors"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 4: CREATE ACCOUNT (REGISTRATION) */}
        {authMode === 'register' && (
          <form onSubmit={handleCreateAccount} className="space-y-3.5">
            {/* Full Name */}
            <div className="relative rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 text-emerald-400/80" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="relative rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-emerald-400/80" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-emerald-400/80" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 6 characters)"
                className="w-full pl-10 pr-11 py-3 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400/70 hover:text-amber-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-950/40 text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Already have an account? Sign In */}
            <div className="text-center pt-2">
              <span className="text-xs text-emerald-200/70">
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 5: EMAIL VERIFICATION REQUIRED */}
        {authMode === 'verify_email' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed px-2">
              Please click the verification link sent to your email to activate your FARMY profile. If you have already verified, click below to proceed.
            </p>

            <button
              type="button"
              onClick={handleCheckEmailVerified}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-950/40 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Checking Status...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>I've Verified My Email</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={handleResendEmailVerification}
                disabled={resendCooldown > 0 || loading}
                className="text-amber-400 font-semibold hover:underline disabled:opacity-50 disabled:no-underline transition-colors"
              >
                {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend Verification Email'}
              </button>
              <span className="text-emerald-700">•</span>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-emerald-300 hover:text-white underline transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: FORGOT PASSWORD */}
        {authMode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Enter your registered email address and we will send you a secure password reset link.
            </p>

            {/* Email Input */}
            <div className="relative rounded-xl bg-[#07190f]/95 border border-emerald-800/60 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-emerald-400/80" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3.5 bg-transparent text-white placeholder:text-emerald-200/35 text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Get Reset Link Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-950/40 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Get Reset Link</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs text-emerald-300 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 7: PASSWORD RESET LINK SENT CONFIRMATION */}
        {authMode === 'reset_sent' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed px-2">
              We sent you a password change link to <strong className="text-amber-400 font-semibold">{email}</strong>. Please check your inbox and spam folder.
            </p>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-950/40 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          </div>
        )}

        {/* FOOTER BRANDING (Matches Reference Image Exactly) */}
        <div className="mt-7 pt-4 border-t border-emerald-800/40 text-center flex flex-col items-center justify-center space-y-2 relative z-10">
          <div className="text-[11px] font-mono tracking-widest text-emerald-400/50 uppercase">
            FARMY v1.0.0
          </div>

          {/* Stylish Outlined Badge: 🌱 SPARK TEAM ── */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-200 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm">
            <span className="text-emerald-400 text-sm">🌱</span>
            <span>SPARK TEAM</span>
            <span className="text-emerald-600 font-bold">—</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
