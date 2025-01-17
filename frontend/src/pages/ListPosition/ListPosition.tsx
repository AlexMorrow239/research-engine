import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/layout/Header/Header";
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

const ListPosition: React.FC = () => {
  const { isAuthenticated } = useAuth();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Handle successful submission
        alert('Position listed successfully!');
        // Reset form or redirect
      } else {
        // Handle error
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting position:', error);
      alert('Failed to submit position. Please try again.');
    }
  };

  return (
    <div className="list-position">
      <div className="list-position__banner">
        <img src="/images/listbanner.png" alt="List Banner" />
      </div>

      <div className="list-position__heading">
        <h2>List Research Opportunity</h2>
        <p>
          Please fill in the details of the research opportunity you wish to
          list. All fields marked with * are required.
        </p>
      </div>

      <div className="list-position__form-container">
        <form className="list-position__form" onSubmit={handleSubmit}>
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

          <div className="list-position__form-group">
            <label>
              Contact Email *
              <input
                type="email"
                name="email"
                placeholder="Contact Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Position Snippet *
              <textarea
                name="snippet"
                placeholder="Brief description of the position"
                value={formData.snippet}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Lab Focus *
              <textarea
                name="labFocus"
                placeholder="Main focus of your lab"
                value={formData.labFocus}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Research Projects *
              <textarea
                name="researchProjects"
                placeholder="Current research projects"
                value={formData.researchProjects}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Open Positions *
              <input
                type="text"
                name="openPositions"
                placeholder="Number of open positions"
                value={formData.openPositions}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Office Location *
              <input
                type="text"
                name="officeLocation"
                placeholder="Office Location"
                value={formData.officeLocation}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Hours Per Week *
              <input
                type="text"
                name="hoursPerWeek"
                placeholder="Expected hours per week"
                value={formData.hoursPerWeek}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Project Length *
              <input
                type="text"
                name="projectLength"
                placeholder="Expected project duration"
                value={formData.projectLength}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="list-position__form-group">
            <label>
              Required Courses
              <input
                type="text"
                name="requiredCourses"
                placeholder="Required courses (if any)"
                value={formData.requiredCourses}
                onChange={handleInputChange}
              />
            </label>
          </div>

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

          <div className="list-position__form-group">
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
          </div>

          <button type="submit" className="list-position__submit">
            Submit Position
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListPosition;