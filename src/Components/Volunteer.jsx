
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Volunteer.css';

function Volunteers() {
  const navigate = useNavigate();

  const [volunteer, setVolunteer] = useState(null);
  const [donations, setDonations] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const savedVolunteer = JSON.parse(
        localStorage.getItem('loggedInVolunteer') || 'null'
      );

      setVolunteer(savedVolunteer);
    } catch {
      setVolunteer(null);
    }

    loadDonations();

    // Refresh if donations change in another browser tab
    const handleStorage = () => loadDonations();

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  function loadDonations() {
    try {
      const saved = JSON.parse(
        localStorage.getItem('foodDonations') || '[]'
      );

      setDonations(Array.isArray(saved) ? saved : []);
    } catch {
      setDonations([]);
    }
  }

  function saveDonations(updatedDonations) {
    localStorage.setItem(
      'foodDonations',
      JSON.stringify(updatedDonations)
    );

    setDonations(updatedDonations);
  }

  // Check whether a donation has valid saved coordinates
  function hasLocation(donation) {
    return (
      Number.isFinite(donation.location?.latitude) &&
      Number.isFinite(donation.location?.longitude) &&
      donation.location.latitude >= -90 &&
      donation.location.latitude <= 90 &&
      donation.location.longitude >= -180 &&
      donation.location.longitude <= 180
    );
  }

  // Google Maps directions link
  function getDirectionsUrl(donation) {
    if (!hasLocation(donation)) {
      return '';
    }

    const { latitude, longitude } = donation.location;

    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }

  // Accept a donation request
  function acceptRequest(id) {
    if (!volunteer) {
      navigate('/volunteer-login');
      return;
    }

    const updated = donations.map((donation) => {
      if (donation.id === id && donation.status === 'Pending') {
        return {
          ...donation,
          status: 'Accepted',
          assignedVolunteer: volunteer.name,
          assignedVolunteerEmail: volunteer.email,
        };
      }

      return donation;
    });

    saveDonations(updated);
    setNotice('Donation request accepted successfully!');
  }

  // Update collection task status
  function updateTask(id, newStatus) {
    if (!volunteer) {
      navigate('/volunteer-login');
      return;
    }

    const updated = donations.map((donation) => {
      if (
        donation.id === id &&
        donation.assignedVolunteerEmail === volunteer.email
      ) {
        return {
          ...donation,
          status: newStatus,
        };
      }

      return donation;
    });

    saveDonations(updated);
    setNotice(`Task status updated to ${newStatus}.`);
  }

  // Logout
  function logout() {
    localStorage.removeItem('loggedInVolunteer');
    navigate('/volunteer-login', { replace: true });
  }

  if (!volunteer) {
    return (
      <div className="vol-page">
        <div className="vol-message-card">
          <h2>Volunteer Login Required</h2>
          <p>Please log in to access your volunteer dashboard.</p>

          <button
            className="vol-primary-btn"
            onClick={() => navigate('/volunteer-login')}
          >
            Go to Volunteer Login
          </button>
        </div>
      </div>
    );
  }

  // Available donations that no volunteer has accepted
  const available = donations.filter(
    (donation) =>
      donation.status === 'Pending' &&
      !donation.assignedVolunteer
  );

  // Donations assigned to this volunteer
  const myTasks = donations.filter(
    (donation) =>
      donation.assignedVolunteerEmail === volunteer.email
  );

  const completed = myTasks.filter(
    (donation) => donation.status === 'Delivered'
  ).length;

  const activeTasks = myTasks.filter(
    (donation) =>
      donation.status === 'Accepted' ||
      donation.status === 'Picked Up'
  ).length;

  function formatDate(date) {
    if (!date) return 'Not specified';

    const parsed = new Date(`${date}T00:00:00`);

    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString();
  }

  // Reusable pickup location section
  function renderPickupLocation(donation) {
    if (!hasLocation(donation)) {
      return (
        <div className="vol-location-missing">
          <p>
            <strong>📍 Pickup location:</strong> No map location
            was saved for this donation.
          </p>
          <p>
            Use the pickup address above, or ask the donor to
            update their location.
          </p>
        </div>
      );
    }

    const { latitude, longitude } = donation.location;

    return (
      <div className="vol-location">
        <h4>📍 Donor Pickup Location</h4>

        <p>
          <strong>Latitude:</strong> {latitude.toFixed(6)}
        </p>

        <p>
          <strong>Longitude:</strong> {longitude.toFixed(6)}
        </p>

        <iframe
          title={`Pickup map for ${donation.foodName || 'food donation'}`}
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
          width="100%"
          height="220"
          style={{
            border: 0,
            borderRadius: '12px',
            marginTop: '10px',
          }}
          loading="lazy"
          allowFullScreen
        />

        <a
          className="vol-map-link"
          href={getDirectionsUrl(donation)}
          target="_blank"
          rel="noopener noreferrer"
        >
          🧭 Get Directions in Google Maps
        </a>
      </div>
    );
  }

  return (
    <div className="vol-page">
      {/* Navigation */}
      <header className="vol-navbar">
        <Link to="/volunteers" className="vol-brand">
          🌱 Seva<span>Harvest</span>
        </Link>

        <div className="vol-nav-right">
          <span className="vol-welcome">
            Hello, {volunteer.name}
          </span>

          <button
            type="button"
            className="vol-logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="vol-container">
        {/* Hero */}
        <section className="vol-hero">
          <div>
            <p className="vol-eyebrow">VOLUNTEER DASHBOARD</p>

            <h1>Make Every Meal Matter</h1>

            <p>
              Collect donated food and help deliver hope to people
              in your community.
            </p>

            <a
              href="#available-requests"
              className="vol-hero-btn"
            >
              View Available Requests ↓
            </a>
          </div>

          <div className="vol-hero-icon" aria-hidden="true">
            🤝
          </div>
        </section>

        {/* Notification */}
        {notice && (
          <div className="vol-notice" role="status">
            {notice}

            <button
              type="button"
              onClick={() => setNotice('')}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="vol-stats">
          <div className="vol-stat-card">
            <div className="vol-stat-icon">🍱</div>
            <div>
              <p>Available Requests</p>
              <h2>{available.length}</h2>
            </div>
          </div>

          <div className="vol-stat-card">
            <div className="vol-stat-icon">🚚</div>
            <div>
              <p>My Active Tasks</p>
              <h2>{activeTasks}</h2>
            </div>
          </div>

          <div className="vol-stat-card">
            <div className="vol-stat-icon">✅</div>
            <div>
              <p>Delivered</p>
              <h2>{completed}</h2>
            </div>
          </div>
        </section>

        {/* Available Donation Requests */}
        <section
          className="vol-section"
          id="available-requests"
        >
          <div className="vol-section-heading">
            <div>
              <h2>Available Donation Requests</h2>
              <p>Choose a donation you can collect.</p>
            </div>

            <span className="vol-count">
              {available.length} available
            </span>
          </div>

          {available.length === 0 ? (
            <div className="vol-empty">
              <span>🍃</span>
              <h3>No requests available right now</h3>
              <p>
                New food donations will appear here when submitted.
              </p>
            </div>
          ) : (
            <div className="vol-grid">
              {available.map((donation) => (
                <article
                  className="vol-task-card"
                  key={donation.id}
                >
                  <div className="vol-card-top">
                    <span className="vol-food-icon">🍲</span>
                    <span className="vol-status pending">
                      Pending
                    </span>
                  </div>

                  <h3>{donation.foodName || 'Food Donation'}</h3>

                  <p className="vol-food-type">
                    {donation.foodType || 'Food type not specified'}
                  </p>

                  <div className="vol-details">
                    <p>
                      <strong>Quantity:</strong>{' '}
                      {donation.quantity || 'Not specified'}
                    </p>

                    <p>
                      <strong>Donor:</strong>{' '}
                      {donation.name || 'Donor'}
                    </p>

                    <p>
                      <strong>Pickup date:</strong>{' '}
                      {formatDate(donation.pickupDate)}
                    </p>

                    <p>
                      <strong>Pickup time:</strong>{' '}
                      {donation.pickupTime || 'Not specified'}
                    </p>

                    <p>
                      <strong>Address:</strong>{' '}
                      {donation.pickupAddress || 'Not specified'}
                    </p>

                    {donation.notes && (
                      <p>
                        <strong>Notes:</strong> {donation.notes}
                      </p>
                    )}
                  </div>

                  {/* Show donor map */}
                  {renderPickupLocation(donation)}

                  <button
                    type="button"
                    className="vol-primary-btn"
                    onClick={() => acceptRequest(donation.id)}
                  >
                    Accept Collection Request
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* My Collection Tasks */}
        <section className="vol-section" id="my-tasks">
          <div className="vol-section-heading">
            <div>
              <h2>My Collection Tasks</h2>
              <p>Track the donations assigned to you.</p>
            </div>

            <span className="vol-count">
              {myTasks.length} tasks
            </span>
          </div>

          {myTasks.length === 0 ? (
            <div className="vol-empty">
              <span>📦</span>
              <h3>You haven't accepted any requests yet</h3>
              <p>
                Accept an available request to see it here.
              </p>
            </div>
          ) : (
            <div className="vol-grid">
              {myTasks.map((donation) => (
                <article
                  className="vol-task-card"
                  key={donation.id}
                >
                  <div className="vol-card-top">
                    <span className="vol-food-icon">🚚</span>

                    <span
                      className={`vol-status ${
                        donation.status === 'Delivered'
                          ? 'delivered'
                          : donation.status === 'Picked Up'
                          ? 'picked-up'
                          : 'accepted'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>

                  <h3>{donation.foodName || 'Food Donation'}</h3>

                  <div className="vol-details">
                    <p>
                      <strong>Quantity:</strong>{' '}
                      {donation.quantity || 'Not specified'}
                    </p>

                    <p>
                      <strong>Pickup date:</strong>{' '}
                      {formatDate(donation.pickupDate)}
                    </p>

                    <p>
                      <strong>Pickup time:</strong>{' '}
                      {donation.pickupTime || 'Not specified'}
                    </p>

                    <p>
                      <strong>Address:</strong>{' '}
                      {donation.pickupAddress || 'Not specified'}
                    </p>
                  </div>

                  {/* Show location for assigned tasks too */}
                  {renderPickupLocation(donation)}

                  {donation.status === 'Accepted' && (
                    <button
                      type="button"
                      className="vol-primary-btn"
                      onClick={() =>
                        updateTask(donation.id, 'Picked Up')
                      }
                    >
                      Mark as Picked Up
                    </button>
                  )}

                  {donation.status === 'Picked Up' && (
                    <button
                      type="button"
                      className="vol-primary-btn"
                      onClick={() =>
                        updateTask(donation.id, 'Delivered')
                      }
                    >
                      Mark as Delivered
                    </button>
                  )}

                  {donation.status === 'Delivered' && (
                    <div className="vol-completed-message">
                      ✓ Delivery completed
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="vol-footer">
        <p>SevaHarvest • Share Food • Spread Hope 🌱</p>
      </footer>
    </div>
  );
}

export default Volunteers;
