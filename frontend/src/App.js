import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header/Header.js";
import Banner from "./components/layout/Banner/Banner.js";
import FiltersBar from "./components/FiltersBar/FiltersBar.js";
import JobListPane from "./components/JobListPane/JobListPane.js";
import JobDetailPane from "./components/JobDetailPane/JobDetailPane.js";
import JobApplication from "./components/JobApplication/JobApplication.js";
import About from "./pages/About/About.js";
// import LoginModal from "./components/LoginModal";
import ListPosition from "./pages/ListPosition/ListPosition.js";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.js";
import YourListings from "./pages/YourListings/YourListings.js"; // Changed 'Yourlistings.js' to 'YourListings.js'

import "./styles.css";

const jobData = {
  1: {
    id: 1,
    title: "Data Analyst Intern",
    snippet: "Data analysis in medical research.",
    faculty: "Dr. John Doe",
    email: "",
    labFocus: "Data analysis in medical research.",
    researchProjects: "Predictive modeling, large-scale data analytics.",
    openPositions: 3,
    researchCategory: ["Data Science", "Medical Research"],
    officeLocation: "Miami, FL",
    hoursPerWeek: 20,
    projectLength: "6 months",
    requiredCourses: "Statistics, Python Programming",
    publications: [
      {
        title: "Predictive Analytics in Medicine",
        link: "https://example.com",
      },
    ],
    imgUrl: "/images/A7E9DC04-0F12-4C04-BCF5-5EA9A5EA2E80IMG_8403.webp",
    location: "Remote",
    salary: "$50,000/year",
    type: "Fellowship",
  },
  2: {
    id: 2,
    title: "Predictive Modeling Intern",
    snippet: "Data analysis in medical research.",
    labFocus: "Data analysis in medical research.",
    faculty: "Dr. Jane Doe",
    email: "",
    researchProjects: "Predictive modeling, large-scale data analytics.",
    openPositions: 3,
    researchCategory: ["Data Science", "Medical Research"],
    officeLocation: "Miami, FL",
    hoursPerWeek: 20,
    projectLength: "6 months",
    requiredCourses: "Statistics, Python Programming",
    publications: [
      { title: "Community Service Operator", link: "https://example.com" },
    ],
    imgUrl: "/images/08aa46_74580d18522d460a87792f7d1002a43cmv2.webp",
    location: "Remote",
    salary: "$50,000/year",
    type: "Fellowship",
  },
  3: {
    id: 3,
    title: "Cow Farmer Intern",
    snippet: "Cow Farming in farming research.",
    labFocus: "Data analysis in medical research.",
    faculty: "Dr. Wex Doe",
    email: "",
    researchProjects: "Predictive modeling, large-scale data analytics.",
    openPositions: 3,
    researchCategory: ["Data Science", "Medical Research"],
    officeLocation: "Miami, FL",
    hoursPerWeek: 20,
    projectLength: "6 months",
    requiredCourses: "Statistics, Python Programming",
    publications: [
      { title: "Community Service Operator", link: "https://example.com" },
    ],
    imgUrl: "",
    location: "Remote",
    salary: "$50,000/year",
    type: "Fellowship",
  },
};

function App() {
  const [selectedJobId, setSelectedJobId] = useState(null);

  const handleJobClick = (id) => {
    setSelectedJobId(id);
  };

  return (
    <div>
      <Header />
      <ScrollToTop /> {/* Add ScrollToTop here */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <FiltersBar />
              <div className="main-content">
                <JobListPane
                  jobData={jobData}
                  selectedJobId={selectedJobId}
                  onJobClick={handleJobClick}
                />
                <JobDetailPane job={jobData[selectedJobId]} />
              </div>
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/listposition" element={<ListPosition />} />
        <Route path="/your-listings" element={<YourListings />} />
        <Route
          path="/job/:id/apply"
          element={<JobApplication jobData={jobData} />}
        />
      </Routes>
    </div>
  );
}

export default App;
