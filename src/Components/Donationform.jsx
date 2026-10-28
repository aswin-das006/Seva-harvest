
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Donationform.css";

// Initial map position: Kerala, India
const defaultPosition = [10.3, 76.3];

// This component detects clicks on the map
function LocationPicker({ location, setLocation }) {
  useMapEvents({
    click(event) {
      setLocation({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return location ? (
    <Marker position={[location.latitude, location.longitude]}>
      <Popup>Selected food pickup location</Popup>
    </Marker>
  ) : null;
}

function DonationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    donorName: "",
    phone: "",
    foodName: "",
    foodType: "Cooked Food",
    quantity: "",
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
  });

  const [location, setLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Use the device's current GPS position if desired
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by this browser. Please click the map."
      );
      return;
    }

    setLocationMessage("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationMessage(
          "Current location selected. You can also click another place on the map."
        );
      },
      () => {
        setLocationMessage(
          "Could not get your location. Please click your pickup point on the map."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // A donor must be logged in
    const loggedInDonor = JSON.parse(
      localStorage.getItem("loggedInDonor") || "null"
    );

    if (!loggedInDonor || !loggedInDonor.email) {
      alert("Please log in as a donor before submitting a donation.");
      navigate("/login");
      return;
    }

    // A map location must be selected
    if (!location) {
      setLocationMessage(
        "Please click your food pickup location on the map before submitting."
      );
      return;
    }

    const newDonation = {
      ...formData,
      id: Date.now(),
      donorEmail: loggedInDonor.email.trim().toLowerCase(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      status: "Pending",
    };

    try {
      const savedDonations = JSON.parse(
        localStorage.getItem("foodDonations") || "[]"
      );

      if (!Array.isArray(savedDonations)) {
        throw new Error("Saved donation data is not a list.");
      }

      savedDonations.push(newDonation);

      localStorage.setItem(
        "foodDonations",
        JSON.stringify(savedDonations)
      );

      setSubmitted(true);
    } catch (error) {
      console.error("Could not save donation:", error);
      alert("Unable to save your donation. Please try again.");
    }
  };

  // Donation success page
  if (submitted) {
    return (
      <div className="donation-page">
        <div className="donation-card donation-success">
          <div className="success-icon">✓</div>

          <h1>Thank You for Donating!</h1>

          <p>
            Your food donation has been saved successfully.
            Your request is now marked as Pending.
          </p>

          <p>
            <strong>Pickup location:</strong>{" "}
            {location.latitude.toFixed(5)},{" "}
            {location.longitude.toFixed(5)}
          </p>

          <div className="donation-actions">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              View My Donations
            </button>

            <Link to="/home" className="back-home-link">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-page">
      <div className="donation-card">
        <div className="donation-header">
          <Link to="/home" className="donation-logo">
            🌿 SevaHarvest
          </Link>

          <h1>Donate Food</h1>

          <p>
            Share surplus food and help make a difference in your community.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="donorName">Donor Name *</label>
            <input
              id="donorName"
              type="text"
              name="donorName"
              value={formData.donorName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="foodName">Food Name *</label>
            <input
              id="foodName"
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="Example: Rice and curry"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="foodType">Food Type *</label>
            <select
              id="foodType"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              required
            >
              <option value="Cooked Food">Cooked Food</option>
              <option value="Packaged Food">Packaged Food</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Bakery Items">Bakery Items</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              id="quantity"
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Example: 10 meals or 5 kg"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pickupAddress">
              Pickup Address / Landmark *
            </label>
            <textarea
              id="pickupAddress"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="Enter house name, street, or nearby landmark"
              rows="3"
              required
            />
          </div>

          {/* Interactive pickup map */}
          <div className="form-group">
            <label>Choose Pickup Location on Map *</label>

            <p className="map-instructions">
              Click the map at the exact place where the volunteer
              should collect the food. Click again to move the marker.
            </p>

            <div className="pickup-map">
              <MapContainer
                center={defaultPosition}
                zoom={9}
                scrollWheelZoom={true}
                style={{ height: "350px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationPicker
                  location={location}
                  setLocation={setLocation}
                />
              </MapContainer>
            </div>

            <button
              type="button"
              className="current-location-button"
              onClick={handleGetCurrentLocation}
            >
              Use My Current GPS Location
            </button>

            {location ? (
              <div className="selected-location">
                <p>✓ Pickup location selected</p>
                <p>
                  Latitude: {location.latitude.toFixed(6)}
                </p>
                <p>
                  Longitude: {location.longitude.toFixed(6)}
                </p>
                <button
                  type="button"
                  className="clear-location-button"
                  onClick={() => {
                    setLocation(null);
                    setLocationMessage("");
                  }}
                >
                  Clear Selected Location
                </button>
              </div>
            ) : (
              <p className="location-warning">
                No location selected yet. Click the map to place a marker.
              </p>
            )}

            {locationMessage && (
              <p className="location-message" role="status">
                {locationMessage}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date *</label>
            <input
              id="pickupDate"
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              min={new Date().toLocaleDateString("en-CA")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pickupTime">Pickup Time *</label>
            <input
              id="pickupTime"
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any extra information about the food"
              rows="3"
            />
          </div>

          <button type="submit" className="submit-donation-button">
            Submit Donation
          </button>

          <Link to="/home" className="cancel-donation-link">
            Cancel and Return Home
          </Link>
        </form>
      </div>
    </div>
  );
}

export default DonationForm;
