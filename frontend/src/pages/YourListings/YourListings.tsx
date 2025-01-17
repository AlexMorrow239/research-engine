import React from "react";
import "./YourListings.scss";

interface Listing {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const mockListings: Listing[] = [
  {
    id: 1,
    title: "Marine Affairs Rosenstiel",
    description: "Description Fairchild Tropical Botanic Garden is among the world's best tropical botanic gardens",
    image: "/images/sample-listing.jpg",
    link: "/connect/1",
  },
  {
    id: 2,
    title: "Marine Affairs Rosenstiel",
    description: "Description Fairchild Tropical Botanic Garden is among the world's best tropical botanic gardens",
    image: "/images/sample-listing.jpg",
    link: "/connect/2",
  },
];

const YourListings: React.FC = () => {
  return (
    <div className="listings">
      <div className="listings__header">
        <h1 className="listings__title">Your Account</h1>
        <h2 className="listings__subtitle">Your Listings</h2>
      </div>

      <div className="listings__container">
        {mockListings.map((listing) => (
          <article key={listing.id} className="listings__card">
            {listing.image && (
              <div className="listings__image-wrapper">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="listings__image"
                />
              </div>
            )}
            <div className="listings__details">
              <h3 className="listings__card-title">{listing.title}</h3>
              <p className="listings__description">{listing.description}</p>
              <a href={listing.link} className="listings__link">
                Connect
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default YourListings;