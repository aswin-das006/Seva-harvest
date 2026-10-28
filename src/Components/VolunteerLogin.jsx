
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from './food-donation.png';

function VolunteerLogin() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    let volunteers = [];

    try {
      volunteers = JSON.parse(
        localStorage.getItem('volunteerUsers') || '[]'
      );

      if (!Array.isArray(volunteers)) {
        volunteers = [];
      }
    } catch {
      volunteers = [];
    }

    // VOLUNTEER REGISTRATION
    if (isRegister) {
      if (!name.trim() || !normalizedEmail || !password) {
        setError('Please fill in all required fields.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const existingVolunteer = volunteers.find(
        (v) =>
          typeof v.email === 'string' &&
          v.email.toLowerCase() === normalizedEmail
      );

      if (existingVolunteer) {
        setError('This email is already registered. Please log in.');
        return;
      }

      const newVolunteer = {
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      volunteers.push(newVolunteer);

      localStorage.setItem(
        'volunteerUsers',
        JSON.stringify(volunteers)
      );

      localStorage.setItem(
        'loggedInVolunteer',
        JSON.stringify({
          name: newVolunteer.name,
          email: newVolunteer.email,
        })
      );
    } else {
      // VOLUNTEER LOGIN
      const volunteer = volunteers.find(
        (v) =>
          typeof v.email === 'string' &&
          v.email.toLowerCase() === normalizedEmail &&
          v.password === password
      );

      if (!volunteer) {
        setError('Invalid email or password.');
        return;
      }

      localStorage.setItem(
        'loggedInVolunteer',
        JSON.stringify({
          name: volunteer.name,
          email: volunteer.email,
        })
      );
    }

    // Clear other login sessions
    localStorage.removeItem('loggedInDonor');
    sessionStorage.removeItem('isFoodBridgeAdmin');

    // Open the volunteer dashboard
    navigate('/volunteers', { replace: true });
  }

  return (
    <div style={styles.page}>
      {/* LOGO AND APP NAME ONLY */}
      <header style={styles.header}>
        <Link to="/login" style={styles.logo}>
          <span style={styles.logoIcon}>🌿</span>
          <span>SevaHarvest</span>
        </Link>
      </header>

      {/* LOGIN SECTION */}
      <main style={styles.loginContainer}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>🍲</div>

          <h1 style={styles.heading}>SevaHarvest</h1>

          <p style={styles.subtitle}>
            Serving Meals, Spreading Kindness
          </p>

          <h2 style={styles.formHeading}>
            {isRegister
              ? 'Volunteer Registration'
              : 'Volunteer Login'}
          </h2>

          <p style={styles.description}>
            {isRegister
              ? 'Create your volunteer account and help your community.'
              : 'Welcome back! Continue your food donation journey.'}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <input
                style={styles.input}
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            )}

            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                isRegister ? 'new-password' : 'current-password'
              }
              required
            />

            {isRegister && (
              <input
                style={styles.input}
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
            )}

            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}

            <button style={styles.button} type="submit">
              {isRegister
                ? 'Register and Continue'
                : 'Login to Dashboard'}
            </button>
          </form>

          <p style={styles.switchText}>
            {isRegister
              ? 'Already registered? '
              : 'New volunteer? '}

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Login here' : 'Register here'}
            </button>
          </p>

          <div style={styles.footer}>
            <Link to="/login" style={styles.backLink}>
              ← Back to Main Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    position: 'relative',
    backgroundImage: `linear-gradient(
      rgba(12, 42, 25, 0.50),
      rgba(12, 42, 25, 0.50)
    ), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },

  // Logo positioned at the top-left
  header: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    padding: '25px 35px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    zIndex: 2,
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
    textShadow: '1px 2px 5px rgba(0, 0, 0, 0.5)',
  },

  logoIcon: {
    fontSize: '35px',
  },

  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '110px 20px 35px',
    boxSizing: 'border-box',
  },

  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '32px',
    background: 'rgba(255, 255, 255, 0.97)',
    borderRadius: '20px',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.22)',
    textAlign: 'center',
    boxSizing: 'border-box',
  },

  iconCircle: {
    width: '65px',
    height: '65px',
    margin: '0 auto 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e8f5ec',
    borderRadius: '50%',
    fontSize: '32px',
  },

  heading: {
    color: '#176b42',
    margin: '5px 0',
    fontSize: '29px',
  },

  subtitle: {
    color: '#666666',
    marginTop: '0',
    marginBottom: '25px',
    fontSize: '13px',
  },

  formHeading: {
    color: '#24352a',
    fontSize: '22px',
    marginBottom: '8px',
  },

  description: {
    color: '#666666',
    fontSize: '13px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },

  input: {
    width: '100%',
    padding: '13px',
    margin: '8px 0',
    border: '1px solid #d5ded7',
    borderRadius: '9px',
    fontSize: '14px',
    outlineColor: '#176b42',
    boxSizing: 'border-box',
    background: '#ffffff',
  },

  button: {
    width: '100%',
    padding: '14px',
    marginTop: '12px',
    border: 'none',
    borderRadius: '9px',
    background: '#176b42',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  linkButton: {
    border: 'none',
    background: 'none',
    color: '#176b42',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },

  switchText: {
    color: '#555555',
    fontSize: '14px',
    marginTop: '22px',
  },

  error: {
    color: '#c62828',
    background: '#fff0f0',
    padding: '10px',
    borderRadius: '7px',
    fontSize: '13px',
  },

  footer: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #eeeeee',
  },

  backLink: {
    color: '#176b42',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
  },
};

export default VolunteerLogin;
