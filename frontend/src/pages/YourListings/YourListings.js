import React from "react";

const mockListings = [
  {
    id: 1,
    title: "Marine Affairs Rosenstiel",
    description: "Description Fairchild Tropical Botanic Garden is among the world’s best tropical botanic gardens",
    image: "/images/sample-listing.jpg", // Replace with the actual image path
    link: "/connect/1", // Example link for connecting
  },
  {
    id: 2,
    title: "Marine Affairs Rosenstiel",
    description: "Description Fairchild Tropical Botanic Garden is among the world’s best tropical botanic gardens",
    image: "/images/sample-listing.jpg", // Replace with the actual image path
    link: "/connect/2", // Example link for connecting
  },
];

const YourListings = () => {
  return (
    <div className="your-listings">
      <h1>Your Account</h1>
      <h2>Your Listings</h2>
      <div className="listings-container">
        {mockListings.map((listing) => (
          <div key={listing.id} className="listing-card">
            {listing.image && (
              <img
                src={listing.image}
                alt={listing.title}
                className="listing-image"
              />
            )}
            <div className="listing-details">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <a href={listing.link} className="connect-link">
                Connect
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourListings;
