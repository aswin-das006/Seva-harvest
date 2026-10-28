import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('loggedInDonor');
    sessionStorage.removeItem('isFoodBridgeAdmin');
    navigate('/login', { replace: true });
  }

  return (
    <div className="app foodbridge-new">

      {/* Navigation */}
      <nav className="fb-navbar">
        <Link to="/home" className="fb-logo">
          🌱 Seva<span>Harvest</span>
        </Link>

        <div className="fb-nav-links">
          <Link to="/home">Home</Link>
          <a href="#fb-about">Our Mission</a>
          <a href="#fb-how">How It Works</a>

          <Link to="/dashboard" className="fb-dashboard">
            My Donations
          </Link>

          <button onClick={handleLogout} className="fb-logout">
            Log Out
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <section className="fb-hero">
        <div className="fb-hero-content">
          <span className="fb-tag">
            🌱 SHARE FOOD • SPREAD HOPE
          </span>

          <h1>
            Share Your Food.
            <br />
            <span>Share Your Love.</span>
          </h1>

          <p>
            Welcome to SevaHarvest! Every meal matters.
            Donate your extra food and help bring hope to
            families and communities in need. Together, we
            can reduce food waste and make a difference.
          </p>

          <div className="fb-hero-actions">
            <Link to="/donate" className="fb-primary">
              🍱 Donate Food Now <span>→</span>
            </Link>

            <Link to="/dashboard" className="fb-secondary">
              Track My Donations
            </Link>
          </div>

          <div className="fb-trust">
            <span>💚</span>
            <div>
              <strong>Small donation, big impact.</strong>
              <p>Be the reason someone smiles today.</p>
            </div>
          </div>
        </div>

        <div className="fb-hero-photo-wrap">
          <img
            className="fb-hero-photo"
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85"
            alt="Community volunteers working together to help people"
          />

          <div className="fb-photo-label">
            <span className="fb-label-icon">❤️</span>
            <div>
              <strong>Give food. Give hope.</strong>
              <p>Every contribution counts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="fb-highlights">
        <div className="fb-highlight">
          <span>🥗</span>
          <div>
            <h3>Share Extra Food</h3>
            <p>Make surplus food useful.</p>
          </div>
        </div>

        <div className="fb-highlight">
          <span>🤝</span>
          <div>
            <h3>Support Communities</h3>
            <p>Help people who need it.</p>
          </div>
        </div>

        <div className="fb-highlight">
          <span>🌍</span>
          <div>
            <h3>Reduce Food Waste</h3>
            <p>Make a positive impact.</p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="fb-mission" id="fb-about">
        <div className="fb-mission-photo-wrap">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=85"
            alt="Community members receiving support"
            className="fb-mission-photo"
          />

          <div className="fb-photo-caption">
            A little kindness goes a long way 💚
          </div>
        </div>

        <div className="fb-mission-content">
          <span className="fb-tag">OUR MISSION</span>

          <h2>
            Good food deserves
            <span> a good purpose.</span>
          </h2>

          <p>
            SevaHarvest connects food donors with people who
            need support. Instead of wasting extra food, you
            can help turn it into a meaningful meal for someone
            else.
          </p>

          <ul className="fb-benefits">
            <li>✓ Give surplus food a second purpose</li>
            <li>✓ Support local communities</li>
            <li>✓ Encourage kindness and sharing</li>
          </ul>

          <Link to="/donate" className="fb-primary">
            Become a Food Donor <span>→</span>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="fb-how" id="fb-how">
        <div className="fb-section-heading">
          <span className="fb-tag">THREE SIMPLE STEPS</span>
          <h2>How SevaHarvest Works</h2>
          <p>
            Making food donation simple, meaningful, and accessible.
          </p>
        </div>

        <div className="fb-steps">
          <article className="fb-step">
            <div className="fb-step-icon">🍱</div>
            <span>STEP 01</span>
            <h3>Donate Food</h3>
            <p>
              Tell us about your available food, its quantity,
              pickup location, and collection time.
            </p>
          </article>

          <article className="fb-step">
            <div className="fb-step-icon">🚚</div>
            <span>STEP 02</span>
            <h3>Arrange Collection</h3>
            <p>
              Your donation can be reviewed and collected by
              volunteers according to the available arrangements.
            </p>
          </article>

          <article className="fb-step">
            <div className="fb-step-icon">💚</div>
            <span>STEP 03</span>
            <h3>Make an Impact</h3>
            <p>
              Follow your donation status through your dashboard
              and help food reach people who need it.
            </p>
          </article>
        </div>
      </section>

      {/* Donation call to action */}
      <section className="fb-cta">
        <div className="fb-cta-text">
          <span className="fb-tag">YOUR KINDNESS MATTERS</span>
          <h2>Have extra food? Someone may need it.</h2>
          <p>
            Start your SevaHarvest food donation journey today.
            One thoughtful action can inspire many more.
          </p>
        </div>

        <Link to="/donate" className="fb-cta-button">
          Donate Food Today →
        </Link>
      </section>

      {/* Footer */}
      <footer className="fb-footer">
        <Link to="/home" className="fb-logo fb-footer-logo">
          🌱 Seva<span>Harvest</span>
        </Link>

        <p>
          Reducing food waste. Sharing hope. Building community.
        </p>

        <div className="fb-footer-links">
          <Link to="/home">Home</Link>
          <Link to="/donate">Donate Food</Link>
          <Link to="/dashboard">My Donations</Link>
        </div>

        <p className="fb-copyright">
          © 2026 SevaHarvest. Share Food • Spread Hope.
        </p>
      </footer>

    </div>
  );
}

export default Homepage;