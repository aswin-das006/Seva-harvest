
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Adminpanel.css';

function AdminPanel() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('foodDonations') || '[]'
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  function saveDonations(updated) {
    setDonations(updated);

    localStorage.setItem(
      'foodDonations',
      JSON.stringify(updated)
    );
  }

  function updateStatus(id, status) {
    const updated = donations.map((donation) =>
      donation.id === id
        ? { ...donation, status }
        : donation
    );

    saveDonations(updated);
  }

  function deleteDonation(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this donation?'
    );

    if (!confirmed) return;

    const updated = donations.filter(
      (donation) => donation.id !== id
    );

    saveDonations(updated);
  }

  function handleLogout() {
    sessionStorage.removeItem('isFoodBridgeAdmin');
    navigate('/login', { replace: true });
  }

  const filteredDonations = donations.filter((donation) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch = [
      donation.foodName,
      donation.name,
      donation.donorName,
      donation.foodType,
      donation.phone,
    ].some((value) =>
      String(value || '')
        .toLowerCase()
        .includes(searchText)
    );

    const matchesStatus =
      filter === 'All' ||
      (donation.status || 'Pending') === filter;

    return matchesSearch && matchesStatus;
  });

  const pending = donations.filter(
    (donation) =>
      (donation.status || 'Pending') === 'Pending'
  ).length;

  const accepted = donations.filter(
    (donation) => donation.status === 'Accepted'
  ).length;

  const collected = donations.filter(
    (donation) =>
      donation.status === 'Collected' ||
      donation.status === 'Completed'
  ).length;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          🌱 Seva<span>Harvest</span>
        </Link>

        <p className="admin-label">ADMIN PANEL</p>

        <Link to="/admin">Manage Donations</Link>
        <Link to="/dashboard">Donation Dashboard</Link>
        <Link to="/donate">Add Donation</Link>
        <Link to="/home">View Homepage</Link>

        {/* Modern Logout Button */}
        <button
          type="button"
          className="admin-logout-modern"
          onClick={handleLogout}
        >
          <span className="logout-icon" aria-hidden="true">
            ⇥
          </span>
          <span>Log Out</span>
          <span className="logout-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-label">
              SEVAHARVEST MANAGEMENT
            </p>

            <h1>Admin Panel</h1>

            <p>Manage all food donation requests.</p>
          </div>

          <span className="admin-badge">
            Administrator
          </span>
        </header>

        {/* Statistics */}
        <section className="admin-stats">
          <article className="admin-stat">
            <span>Total Donations</span>
            <strong>{donations.length}</strong>
          </article>

          <article className="admin-stat">
            <span>Pending</span>
            <strong>{pending}</strong>
          </article>

          <article className="admin-stat">
            <span>Accepted</span>
            <strong>{accepted}</strong>
          </article>

          <article className="admin-stat">
            <span>Collected</span>
            <strong>{collected}</strong>
          </article>
        </section>

        {/* Donation Management */}
        <section className="admin-table-section">
          <h2>Manage Donations</h2>

          <p>
            Review food donations and update their collection status.
          </p>

          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search food or donor..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search donations"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              aria-label="Filter by donation status"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Collected">Collected</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {filteredDonations.length === 0 ? (
            <div className="admin-empty">
              <h3>No donations found</h3>

              <p>
                Try another search or add a donation.
              </p>

              <Link to="/donate">
                + Add Donation
              </Link>
            </div>
          ) : (
            <div className="admin-donation-list">
              {filteredDonations.map((donation) => (
                <article
                  className="admin-donation"
                  key={donation.id}
                >
                  <div className="admin-donation-heading">
                    <div>
                      <h3>
                        {donation.foodName || 'Food donation'}
                      </h3>

                      <p>
                        Donor:{' '}
                        {donation.name ||
                          donation.donorName ||
                          'Not provided'}
                      </p>
                    </div>

                    <span className="admin-badge">
                      {donation.status || 'Pending'}
                    </span>
                  </div>

                  <div className="admin-details">
                    <p>
                      <strong>Type:</strong>{' '}
                      {donation.foodType || '-'}
                    </p>

                    <p>
                      <strong>Quantity:</strong>{' '}
                      {donation.quantity || '-'}
                    </p>

                    <p>
                      <strong>Phone:</strong>{' '}
                      {donation.phone || '-'}
                    </p>

                    <p>
                      <strong>Pickup Address:</strong>{' '}
                      {donation.pickupAddress || '-'}
                    </p>

                    <p>
                      <strong>Pickup Date:</strong>{' '}
                      {donation.pickupDate || '-'}
                    </p>

                    <p>
                      <strong>Pickup Time:</strong>{' '}
                      {donation.pickupTime || '-'}
                    </p>

                    <p>
                      <strong>Notes:</strong>{' '}
                      {donation.notes || 'None'}
                    </p>
                  </div>

                  <div className="admin-actions">
                    <label>
                      Update Status

                      <select
                        value={donation.status || 'Pending'}
                        onChange={(event) =>
                          updateStatus(
                            donation.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Collected">Collected</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </label>

                    <button
                      type="button"
                      className="admin-delete"
                      onClick={() =>
                        deleteDonation(donation.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="admin-footer">
          🌱 SevaHarvest — Share Food • Spread Hope.
        </footer>
      </main>
    </div>
  );
}

export default AdminPanel;

