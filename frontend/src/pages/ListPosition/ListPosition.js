import React, { useState } from "react";
import Header from "../../components/layout/Header/Header";
import LoginPage from "../../pages/Login/Login";

export default function ListPosition({ isLoggedIn, onLogin }) {
  const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    imgUrl: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setFormData((prevData) => ({
      ...prevData,
      imgUrl: files,
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      researchCategory: value.split(",").map((cat) => cat.trim()),
    }));
  };

  const handleAddPublication = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    // Add logic to send formData to the backend or API here
  };

  const handleLoginSuccess = () => {
    onLogin();
    setShowLoginModal(false);
  };

  return (
    <div>
      <Header />

      {/* Banner */}
      <div className="banner">
        <img
          src="/images/listbanner.png"
          alt="List Banner"
          style={{
            width: "100%",
            height: "340px",
          }}
        />
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div
            className="modal-content login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            <LoginPage onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showLoginModal && (
        <>
          <div className="listposition-heading">
            <h2>List Research Opportunity</h2>
            <p>
              Please fill in the details of the research opportunity you wish to
              list. All fields marked with * are required.
            </p>
          </div>
          <div className="list-form">
            <form onSubmit={handleSubmit}>
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
              <label>
                Email *
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Organization Logo(s) and Optional Flyers
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
              <label>
                Research Description *
                <textarea
                  name="snippet"
                  placeholder="Provide a brief description of the research opportunity."
                  value={formData.snippet}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Lab Focus *
                <textarea
                  name="labFocus"
                  placeholder="Overview of lab focus"
                  value={formData.labFocus}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Research Projects *
                <textarea
                  name="researchProjects"
                  placeholder="List of active research projects"
                  value={formData.researchProjects}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Open Positions *
                <input
                  type="number"
                  name="openPositions"
                  placeholder="Number of open positions"
                  value={formData.openPositions}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Research Categories (Comma-separated) *
                <input
                  type="text"
                  name="researchCategory"
                  placeholder="e.g., Data Science, AI"
                  value={formData.researchCategory.join(", ")}
                  onChange={handleCategoryChange}
                  required
                />
              </label>
              <label>
                Office Location *
                <input
                  type="text"
                  name="officeLocation"
                  placeholder="Office location"
                  value={formData.officeLocation}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Hours Per Week *
                <input
                  type="number"
                  name="hoursPerWeek"
                  placeholder="Number of hours"
                  value={formData.hoursPerWeek}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Project Length *
                <input
                  type="text"
                  name="projectLength"
                  placeholder="Duration of the project"
                  value={formData.projectLength}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Required Courses
                <input
                  type="text"
                  name="requiredCourses"
                  placeholder="e.g., Statistics, Python"
                  value={formData.requiredCourses}
                  onChange={handleInputChange}
                />
              </label>
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
              <label>
                Application Deadline *
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
