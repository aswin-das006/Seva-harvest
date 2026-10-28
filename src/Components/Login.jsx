
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    // Admin login
    if (!isRegister && cleanEmail === 'admin1234@gmail.com') {
      if (password === 'admin1234') {
        sessionStorage.setItem('isFoodBridgeAdmin', 'true');
        localStorage.removeItem('loggedInDonor');
        localStorage.removeItem('loggedInVolunteer');

        navigate('/admin', { replace: true });
      } else {
        setError('Incorrect admin email or password.');
      }

      return;
    }

    let users = [];

    try {
      users = JSON.parse(
        localStorage.getItem('donorUsers') || '[]'
      );

      if (!Array.isArray(users)) {
        users = [];
      }
    } catch {
      setError('Unable to read saved accounts. Please try again.');
      return;
    }

    // Donor registration
    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      if (!cleanEmail) {
        setError('Please enter your email address.');
        return;
      }

      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const existingUser = users.find(
        (user) =>
          user.email?.trim().toLowerCase() === cleanEmail
      );

      let volunteers = [];

      try {
        volunteers = JSON.parse(
          localStorage.getItem('volunteerUsers') || '[]'
        );

        if (!Array.isArray(volunteers)) {
          volunteers = [];
        }
      } catch {
        setError('Unable to read saved volunteer accounts.');
        return;
      }

      const existingVolunteer = volunteers.find(
        (user) =>
          user.email?.trim().toLowerCase() === cleanEmail
      );

      if (
        existingUser ||
        existingVolunteer ||
        cleanEmail === 'admin1234@gmail.com'
      ) {
        setError('This email is already registered. Please log in.');
        return;
      }

      users.push({
        name: name.trim(),
        email: cleanEmail,
        password: password,
      });

      try {
        localStorage.setItem(
          'donorUsers',
          JSON.stringify(users)
        );
      } catch {
        setError('Unable to save your account. Please try again.');
        return;
      }

      setIsRegister(false);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setMessage('Registration successful! Please log in.');
      return;
    }

    // Donor login
    const user = users.find(
      (item) =>
        item.email?.trim().toLowerCase() === cleanEmail &&
        item.password === password
    );

    if (!user) {
      setError(
        'Invalid email or password. Please check your details or register first.'
      );
      return;
    }

    sessionStorage.removeItem('isFoodBridgeAdmin');
    localStorage.removeItem('loggedInVolunteer');

    localStorage.setItem(
      'loggedInDonor',
      JSON.stringify({
        name: user.name,
        email: user.email,
      })
    );

    navigate('/home', { replace: true });
  }

  function toggleRegistration() {
    setIsRegister(!isRegister);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
    setShowPassword(false);
  }

  return (
    <div className="login-page">
      <nav className="seva-navbar">
        <Link to="/login" className="seva-brand">
          <span className="seva-logo" aria-hidden="true">
            🌱
          </span>

          <span className="seva-brand-name">
            Seva<span>Harvest</span>
          </span>
        </Link>

        <p className="seva-tagline">
          Share Food <span>•</span> Spread Hope
        </p>
      </nav>

      <main className="login-layout">
        <section className="login-welcome">
          <div className="welcome-content">
            <p className="welcome-eyebrow">
              SHARE MORE. WASTE LESS.
            </p>

            <p>
              Welcome to SevaHarvest, where every meal shared brings
              hope to someone in need. Join us in reducing food waste
              and supporting our community.
            </p>
          </div>

          <div className="welcome-features">
            <div className="welcome-feature">
              <span className="feature-icon" aria-hidden="true">
                ♧
              </span>
              <span>
                Reduce<br />Food Waste
              </span>
            </div>

            <div className="welcome-feature">
              <span className="feature-icon" aria-hidden="true">
                ♧
              </span>
              <span>
                Support<br />Communities
              </span>
            </div>

            <div className="welcome-feature">
              <span
                className="feature-icon heart-icon"
                aria-hidden="true"
              >
                ♡
              </span>
              <span>
                Build a<br />Healthier Future
              </span>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="card-brand-icon" aria-hidden="true">
            🌿
          </div>

          <div className="card-brand-name">
            Seva<span>Harvest</span>
          </div>

          <p className="platform-label">
            Food Donation Platform
          </p>

          <h2>
            {isRegister ? 'Join SevaHarvest!' : 'Welcome Back!'}
          </h2>

          <p className="card-description">
            {isRegister
              ? 'Create your donor account and help make a difference.'
              : 'Enter your email and password to continue.'}
          </p>

          <form onSubmit={handleSubmit} autoComplete="off">
            {isRegister && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="off"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-with-icon">
                <span className="input-icon" aria-hidden="true">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-with-icon">
                <span className="input-icon" aria-hidden="true">
                  ♙
                </span>

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="off"
                  minLength={isRegister ? 6 : undefined}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  autoComplete="off"
                  minLength={6}
                  required
                />
              </div>
            )}

            {!isRegister && (
              <div className="login-options">
                <label className="remember-option">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-link"
                  onClick={() =>
                    setMessage(
                      'Please contact the administrator to reset your password.'
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="login-success" role="status">
                {message}
              </p>
            )}

            <button className="login-submit" type="submit">
              {isRegister ? 'Create Account' : 'Log In'}
              <span className="submit-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          <div className="or-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          <button
            type="button"
            className="register-button"
            onClick={toggleRegistration}
          >
            <span aria-hidden="true">♟+</span>

            {isRegister
              ? 'Already have an account? Log In'
              : 'Create a Donor Account'}
          </button>

          {!isRegister && (
            <button
              type="button"
              className="volunteer-login-btn"
              onClick={() => navigate('/volunteer-login')}
            >
              🤝 Volunteer Login
            </button>
          )}

          <div className="card-footer">
            <p>Good food. Better tomorrow.</p>

            <div className="footer-decoration">
              <span />
              <span className="footer-leaf">🌿</span>
              <span />
            </div>
          </div>

          <Link className="back-home" to="/home">
            ← Back to Homepage
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Login;
