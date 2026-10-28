
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Donationdashboard.css';

function DonationDashboard() {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Get the logged-in donor's email
  function getLoggedInDonor() {
    try {
      return JSON.parse(
        localStorage.getItem('loggedInDonor')
      );
    } catch {
      return null;
    }
  }

  // Load only the logged-in donor's donations
  function loadDonations() {
    const loggedInDonor = getLoggedInDonor();

    if (!loggedInDonor?.email) {
      setDonations([]);
      navigate('/login', { replace: true });
      return;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem('foodDonations') || '[]'
      );

      const allDonations = Array.isArray(saved) ? saved : [];

      const myDonations = allDonations.filter(
        (donation) =>
          typeof donation.donorEmail === 'string' &&
          donation.donorEmail.trim().toLowerCase() ===
            loggedInDonor.email.trim().toLowerCase()
      );

      setDonations(myDonations);
    } catch {
      setDonations([]);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update only the logged-in donor's donation
  function updateDonation(event) {
    event.preventDefault();

    const loggedInDonor = getLoggedInDonor();

    if (!loggedInDonor?.email || !editingDonation) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const allDonations = JSON.parse(
        localStorage.getItem('foodDonations') || '[]'
      );

      if (!Array.isArray(allDonations)) {
        setMessage('Unable to load donations.');
        return;
      }

      const ownsDonation = allDonations.some(
        (donation) =>
          donation.id === editingDonation.id &&
          typeof donation.donorEmail === 'string' &&
          donation.donorEmail.trim().toLowerCase() ===
            loggedInDonor.email.trim().toLowerCase()
      );

      if (!ownsDonation) {
        setMessage('You can update only your own donations.');
        setEditingDonation(null);
        loadDonations();
        return;
      }

      const updated = allDonations.map((donation) =>
        donation.id === editingDonation.id &&
        donation.donorEmail.trim().toLowerCase() ===
          loggedInDonor.email.trim().toLowerCase()
          ? {
              ...donation,
              foodName: editingDonation.foodName,
              foodType: editingDonation.foodType,
              quantity: editingDonation.quantity,
              pickupDate: editingDonation.pickupDate,
              pickupTime: editingDonation.pickupTime,
              pickupAddress: editingDonation.pickupAddress,
              notes: editingDonation.notes,
            }
          : donation
      );

      localStorage.setItem(
        'foodDonations',
        JSON.stringify(updated)
      );

      setEditingDonation(null);
      setSelectedDonation(null);
      setMessage('Donation updated successfully!');
      loadDonations();
    } catch {
      setMessage('Unable to update the donation.');
    }
  }

  // Delete only the logged-in donor's donation
  function deleteDonation(id) {
    const loggedInDonor = getLoggedInDonor();

    if (!loggedInDonor?.email) {
      navigate('/login', { replace: true });
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this donation?'
    );

    if (!confirmed) return;

    try {
      const allDonations = JSON.parse(
        localStorage.getItem('foodDonations') || '[]'
      );

      if (!Array.isArray(allDonations)) {
        setMessage('Unable to load donations.');
        return;
      }

      const ownsDonation = allDonations.some(
        (donation) =>
          donation.id === id &&
          typeof donation.donorEmail === 'string' &&
          donation.donorEmail.trim().toLowerCase() ===
            loggedInDonor.email.trim().toLowerCase()
      );

      if (!ownsDonation) {
        setMessage('You can delete only your own donations.');
        loadDonations();
        return;
      }

      // Keep all other donors' donations unchanged
      const updated = allDonations.filter(
        (donation) =>
          !(
            donation.id === id &&
            typeof donation.donorEmail === 'string' &&
            donation.donorEmail.trim().toLowerCase() ===
              loggedInDonor.email.trim().toLowerCase()
          )
      );

      localStorage.setItem(
        'foodDonations',
        JSON.stringify(updated)
      );

      if (selectedDonation?.id === id) {
        setSelectedDonation(null);
      }

      if (editingDonation?.id === id) {
        setEditingDonation(null);
      }

      setMessage('Donation deleted successfully!');
      loadDonations();
    } catch {
      setMessage('Unable to delete the donation.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('loggedInDonor');
    sessionStorage.removeItem('isFoodBridgeAdmin');
    navigate('/login', { replace: true });
  }

  const pending = donations.filter(
    (item) => item.status === 'Pending'
  ).length;

  const completed = donations.filter(
    (item) =>
      ['Completed', 'Collected'].includes(item.status)
  ).length;

  const today = new Date();

  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const upcoming = donations.filter((item) =>
    item.pickupDate &&
    item.pickupDate >= localToday &&
    !['Completed', 'Collected', 'Cancelled'].includes(
      item.status
    )
  ).length;

  return (
    <main className="donor-dashboard">

      {/* Navigation */}
      <header className="dashboard-header">
        <Link to="/home" className="dashboard-brand">
          🌱 Seva<span>Harvest</span>
        </Link>

        <nav className="dashboard-nav">
          <Link to="/home">Home</Link>
          <Link to="/donate">Donate Food</Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{ background: 'red', color: 'white' }}
          >
            Log Out
          </button>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="dashboard-welcome">
        <p className="dashboard-eyebrow">
          YOUR IMPACT MATTERS
        </p>

        <h1>My Donation Dashboard</h1>

        <p>
          Welcome to SevaHarvest! Track your donations and see
          how you're helping your community.
        </p>

        <Link to="/donate" className="dashboard-primary">
          + Donate Food
        </Link>
      </section>

      {/* Success Messages */}
      {message && (
        <div className="dashboard-message" role="status">
          {message}

          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Donation Statistics */}
      <section className="dashboard-stats">
        <article className="stat-card">
          <span className="stat-icon">📦</span>
          <p>Total Donations</p>
          <h2>{donations.length}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon">🕒</span>
          <p>Pending</p>
          <h2>{pending}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon">✅</span>
          <p>Completed / Collected</p>
          <h2>{completed}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon">📅</span>
          <p>Upcoming Pickups</p>
          <h2>{upcoming}</h2>
        </article>
      </section>

      {/* My Donations */}
      <section className="donation-list-section">
        <div className="donation-list-heading">
          <div>
            <h2>My Donations</h2>
            <p>
              View and manage your submitted food donations.
            </p>
          </div>

          <span className="donation-count">
            {donations.length} donations
          </span>
        </div>

        {donations.length === 0 ? (
          <div className="dashboard-empty">
            <div>🌱</div>

            <h3>No donations yet</h3>

            <p>
              Your food donations will appear here after you
              submit a donation form.
            </p>

            <Link
              to="/donate"
              className="dashboard-primary"
            >
              Make Your First Donation
            </Link>
          </div>
        ) : (
          <div className="donation-table-wrap">
            <table className="donation-table">
              <thead>
                <tr>
                  <th>Food Details</th>
                  <th>Quantity</th>
                  <th>Pickup Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>
                      <strong>{donation.foodName}</strong>

                      <span className="table-subtitle">
                        {donation.foodType}
                      </span>
                    </td>

                    <td>{donation.quantity}</td>

                    <td>
                      {donation.pickupDate || 'Not set'}

                      <span className="table-subtitle">
                        {donation.pickupTime || ''}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${(
                          donation.status || 'Pending'
                        )
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {donation.status || 'Pending'}
                      </span>
                    </td>

                    <td>
                      <div className="donation-actions">
                        <button
                          type="button"
                          className="action-view"
                          onClick={() =>
                            setSelectedDonation(donation)
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="action-edit"
                          disabled={[
                            'Completed',
                            'Collected',
                            'Cancelled',
                          ].includes(donation.status)}
                          onClick={() =>
                            setEditingDonation({ ...donation })
                          }
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          className="action-delete"
                          onClick={() =>
                            deleteDonation(donation.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* View Donation Details */}
      {selectedDonation && (
        <div className="dashboard-modal-backdrop">
          <section
            className="dashboard-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-details-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedDonation(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <h2 id="donation-details-title">
              Donation Details
            </h2>

            <p>
              <strong>Food:</strong>{' '}
              {selectedDonation.foodName}
            </p>

            <p>
              <strong>Type:</strong>{' '}
              {selectedDonation.foodType}
            </p>

            <p>
              <strong>Quantity:</strong>{' '}
              {selectedDonation.quantity}
            </p>

            <p>
              <strong>Donor:</strong>{' '}
              {selectedDonation.name ||
                selectedDonation.donorName ||
                'Not provided'}
            </p>

            <p>
              <strong>Phone:</strong>{' '}
              {selectedDonation.phone || 'Not provided'}
            </p>

            <p>
              <strong>Pickup date:</strong>{' '}
              {selectedDonation.pickupDate || 'Not set'}
            </p>

            <p>
              <strong>Pickup time:</strong>{' '}
              {selectedDonation.pickupTime || 'Not set'}
            </p>

            <p>
              <strong>Address:</strong>{' '}
              {selectedDonation.pickupAddress || 'Not provided'}
            </p>

            <p>
              <strong>Notes:</strong>{' '}
              {selectedDonation.notes || 'None'}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              {selectedDonation.status || 'Pending'}
            </p>
          </section>
        </div>
      )}

      {/* Update Donation */}
      {editingDonation && (
        <div className="dashboard-modal-backdrop">
          <form
            className="dashboard-modal"
            onSubmit={updateDonation}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setEditingDonation(null)}
              aria-label="Close edit form"
            >
              ×
            </button>

            <h2>Update Donation</h2>

            <label>
              Food Name
              <input
                required
                value={editingDonation.foodName || ''}
                onChange={(event) =>
                  setEditingDonation({
                    ...editingDonation,
                    foodName: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Food Type
              <select
                value={editingDonation.foodType || 'Other'}
                onChange={(event) =>
                  setEditingDonation({
                    ...editingDonation,
                    foodType: event.target.value,
                  })
                }
              >
                <option>Cooked Food</option>
                <option>Fresh Vegetables</option>
                <option>Fruits</option>
                <option>Fruits and Vegetables</option>
                <option>Packaged Food</option>
                <option>Bakery Items</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Quantity
              <input
                required
                value={editingDonation.quantity || ''}
                onChange={(event) =>
                  setEditingDonation({
                    ...editingDonation,
                    quantity: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Pickup Date
              <input
                type="date"
                required
                min={localToday}
                value={editingDonation.pickupDate || ''}
                onChange={(event) =>
                  setEditingDonation({
                    ...editingDonation,
                    pickupDate: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Pickup Time
              <input
                type="time"
                required
                value={editingDonation.pickupTime || ''}
                onChange={(event) =>
                  setEditingDonation({
                    ...editingDonation,
                    pickupTime: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Pickup Address
              <textarea
                required
                value={editingDonation.pickupAddress || ''}
                onChange={(event) =>
                  setEditingDonation({
                    ...editingDonation,
                    pickupAddress: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Additional Notes
              <textarea
                value={editingDonation.notes || ''}
                onChange={(event) =>
                  setEditingDonation({
                    ...editingDonation,
                    notes: event.target.value,
                  })
                }
              />
            </label>

            <button
              className="dashboard-primary"
              type="submit"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        🌱 SevaHarvest — Share Food • Spread Hope.
      </footer>
    </main>
  );
}

export default DonationDashboard;
