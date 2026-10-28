
import React from "react";

function GoogleMap() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Find Food Donation Locations</h2>

      <iframe
        title="Google Map"
        width="100%"
        height="400"
        style={{ border: 0, borderRadius: "12px" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://maps.google.com/maps?q=Chalakudy%2C%20Kerala&t=&z=13&ie=UTF8&iwloc=&output=embed"
      ></iframe>
    </div>
  );
}

export default GoogleMap;
