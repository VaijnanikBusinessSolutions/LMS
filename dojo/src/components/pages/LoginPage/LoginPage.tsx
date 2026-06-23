



import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles, Zap, Target, Rocket } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { login } from '../../hooks/useAuth';
import NLlogo from '../../../assets/Images/nl_technologies_logo.png';

interface LoginFormState {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email: boolean;
  password: boolean;
}

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({
    email: false,
    password: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/home');
      } else if (user.role === 'team-leader') {
        navigate('/home');
      } else if (user.role === 'employee') {
        navigate('/home');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    const newErrors: LoginFormErrors = {
      email: !email.trim(),
      password: !password.trim(),
    };

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      const resultAction = await dispatch(login(formData) as any);

      if (login.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;

        // === CRITICAL FIX: Save tokens to localStorage ===
        if (payload) {
          if (payload.user) {
            localStorage.setItem('user', JSON.stringify(payload.user));
          }
          if (payload.access_token) {
            localStorage.setItem('access_token', payload.access_token);
            console.log("Access token saved.");
          }
          if (payload.refresh_token) {
            localStorage.setItem('refresh_token', payload.refresh_token);
            console.log("Refresh token saved.");
          }
        }
        // ===============================================

        setFormData({ email: '', password: '' });
        
        // Use a full refresh or navigate to ensure the app picks up the new tokens
        navigate('/home');
      } else if (login.rejected.match(resultAction)) {
        setError((resultAction.payload as string) || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Learning',
      description: 'AI-powered personalized learning paths',
      // Using generic opacity classes that will tint with the current theme text color or brand color
      gradient: 'from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))]', 
    },
    {
      icon: Zap,
      title: 'Quick Progress',
      description: 'Track your growth in real-time',
      gradient: 'from-[rgb(var(--brand-accent))] to-[rgb(var(--brand-primary))]',
    },
    {
      icon: Target,
      title: 'Goal Oriented',
      description: 'Set and achieve learning milestones',
      gradient: 'from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))]',
    },
    {
      icon: Rocket,
      title: 'Career Growth',
      description: 'Accelerate your professional journey',
      gradient: 'from-[rgb(var(--brand-accent))] to-[rgb(var(--brand-primary))]',
    },
  ];

  return (
    // Changed main bg to bg-background (Theme aware)
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-300">
      
      {/* Animated Grid Background - Updated colors to use theme variables */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(var(--brand-primary), 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--brand-primary), 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Floating Orbs - Updated to use brand colors */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[rgb(var(--brand-primary))/0.2] rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[rgb(var(--brand-accent))/0.15] rounded-full blur-[150px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgb(var(--brand-primary))/0.05] rounded-full blur-[200px]"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Section - Branding */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Logo */}
            <div className="mb-8">
              <img
                src={NLlogo}
                alt="NL Technologies"
                // Added dark:invert logic so logo looks good in both modes if it's black by default
                className="h-12 w-auto mx-auto lg:mx-0 dark:brightness-0 dark:invert transition-all"
              />
            </div>

            {/* Main Heading */}
            <div className="space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgb(var(--brand-primary))/0.1] rounded-full border border-[rgb(var(--brand-primary))/0.2]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--brand-primary))] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[rgb(var(--brand-primary))]"></span>
                </span>
                <span className="text-[rgb(var(--brand-primary))] text-sm font-medium">
              
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-text">Welcome to</span>
                <br />
                {/* Gradient text using brand variables */}
                <span className="bg-gradient-to-r from-[rgb(var(--brand-primary))] via-[rgb(var(--brand-accent))] to-[rgb(var(--brand-primary))] bg-clip-text text-transparent">
                  Digital Learning
                </span>
                <br />
                <span className="text-text">Platform</span>
              </h1>

              <p className="text-muted text-lg max-w-md mx-auto lg:mx-0">
                Transform your skills with our next-generation learning
                experience. Start your journey today.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-500 border backdrop-blur-sm ${
                    activeFeature === index
                      ? 'bg-surface border-[rgb(var(--brand-primary))/0.3] shadow-lg scale-105'
                      : 'bg-surface/50 border-border hover:bg-surface'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-text font-semibold text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted text-xs">{feature.description}</p>

                  {activeFeature === index && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))] rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Stats - Text colors updated */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-text">500+</div>
                <div className="text-muted text-xs uppercase tracking-wider">
                  Courses
                </div>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text">10K+</div>
                <div className="text-muted text-xs uppercase tracking-wider">
                  Learners
                </div>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text">98%</div>
                <div className="text-muted text-xs uppercase tracking-wider">
                  Success
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          {/* Right Section - Login Form */}
          <div className="order-1 lg:order-2">
            
            {/* Added max-w-md and mx-auto to ensure it stays compact like your image */}
            <div className="relative w-full max-w-md mx-auto">
              
              {/* --- I REMOVED THE GLOWING BLUR DIV HERE --- */}

              {/* Form Card */}
              {/* Changed shadow-soft to shadow-2xl for a solid pop */}
              {/* Added bg-card and border-border to ensure it looks solid */}
              <div className="relative bg-card rounded-3xl p-8 sm:p-10 border border-border shadow-2xl">
                
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))] rounded-2xl mb-6 shadow-lg">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-text mb-2">
                    Sign In
                  </h2>
                  <p className="text-muted">
                    Enter your credentials to continue
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 bg-background/50 border rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand-primary))/0.5] focus:border-[rgb(var(--brand-primary))/0.5] transition-all ${
                          errors.email
                            ? 'border-red-500/50'
                            : 'border-border hover:border-[rgb(var(--brand-primary))/0.5]'
                        }`}
                        placeholder="name@company.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-2">
                        Please enter your email
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-4 bg-background/50 border rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand-primary))/0.5] focus:border-[rgb(var(--brand-primary))/0.5] transition-all ${
                          errors.password
                            ? 'border-red-500/50'
                            : 'border-border hover:border-[rgb(var(--brand-primary))/0.5]'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-2">
                        Please enter your password
                      </p>
                    )}
                  </div>

                  {/* Options Row */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-5 h-5 border-2 border-border rounded-md peer-checked:bg-gradient-to-br peer-checked:from-[rgb(var(--brand-primary))] peer-checked:to-[rgb(var(--brand-accent))] peer-checked:border-transparent transition-all"></div>
                        <svg
                          className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-muted group-hover:text-text">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-[rgb(var(--brand-primary))] hover:opacity-80 transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full group mt-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))] rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-muted bg-card">
                      Need help?
                    </span>
                  </div>
                </div>

                {/* Support Link */}
                <div className="text-center">
                  <p className="text-muted text-sm mb-3">
                    Contact your administrator for account access
                  </p>
                  <a
                    href="mailto:support@nltechnologies.com"
                    className="inline-flex items-center gap-2 text-[rgb(var(--brand-primary))] hover:opacity-80 transition-colors text-sm font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    support@nltechnologies.com
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-muted text-sm mt-8">
              © 2024 NL Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

