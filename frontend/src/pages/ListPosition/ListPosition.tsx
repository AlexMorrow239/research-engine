import React, { useState } from "react";
import Header from "../../components/layout/Header/Header";
import LoginPage from "../Login/Login";
import "./ListPosition.scss";

interface Publication {
  title: string;
  link: string;
}

interface FormData {
  title: string;
  email: string;
  imgUrl: string[];
  snippet: string;
  labFocus: string;
  researchProjects: string;
  openPositions: string;
  researchCategory: string[];
  officeLocation: string;
  hoursPerWeek: string;
  projectLength: string;
  requiredCourses: string;
  publications: Publication[];
  applicationDeadline: string;
}

interface ListPositionProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

const ListPosition: React.FC<ListPositionProps> = ({ isLoggedIn, onLogin }) => {
  const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    email: "",
    imgUrl: [],
    snippet: "",
    labFocus: "",
    researchProjects: "",
    openPositions: "",
    researchCategory: [],
    officeLocation: "",
    hoursPerWeek: "",
    projectLength: "",
    requiredCourses: "",
    publications: [],
    applicationDeadline: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddPublication = (e: React.MouseEvent) => {
    e.preventDefault();
    const title = prompt("Enter the publication title:");
    const link = prompt("Enter the publication link:");
    if (title && link) {
      setFormData((prevData) => ({
        ...prevData,
        publications: [...prevData.publications, { title, link }],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add logic to send formData to the backend or API here
  };

  const handleLoginSuccess = () => {
    onLogin();
    setShowLoginModal(false);
  };

  return (
    <div className="list-position">
      <Header />

      <div className="list-position__banner">
        <img src="/images/listbanner.png" alt="List Banner" />
      </div>

      {showLoginModal && (
        <div className="list-position__modal-overlay">
          <div className="list-position__modal-content">
            <button
              className="list-position__close-button"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            <LoginPage onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      {!showLoginModal && (
        <>
          <div className="list-position__heading">
            <h2>List Research Opportunity</h2>
            <p>
              Please fill in the details of the research opportunity you wish to
              list. All fields marked with * are required.
            </p>
          </div>
          <div className="list-position__form-container">
            <form className="list-position__form" onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="list-position__form-group">
                <label>
                  Organization Name *
                  <input
                    type="text"
                    name="title"
                    placeholder="Organization Name"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              {/* Continue with other form groups... */}
              
              <div className="list-position__publications">
                <label>
                  Publications
                  <button onClick={handleAddPublication}>Add Publication</button>
                </label>
                <ul>
                  {formData.publications.map((pub, index) => (
                    <li key={index}>
                      {pub.title} - <a href={pub.link}>{pub.link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <button type="submit" className="list-position__submit">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ListPosition;