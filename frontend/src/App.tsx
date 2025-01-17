import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import FiltersBar from "./components/FiltersBar/FiltersBar";
import JobApplication from "./components/JobApplication/JobApplication";
import JobDetailPane from "./components/JobDetailPane/JobDetailPane";
import JobListPane from "./components/JobListPane/JobListPane";
import Banner from "./components/layout/Banner/Banner";
import About from "./pages/About/About";
import ListPosition from "./pages/ListPosition/ListPosition";
import YourListings from "./pages/YourListings/YourListings";
import { Job } from "./types/index.js";
import './assets/styles/main.scss'
import MainLayout from "./components/layout/MainLayout/MainLayout";
import Home from "./pages/Home/Home";




interface JobData {
  [key: string]: Job;
}

const jobData: JobData = {
  "1": {
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
  "2": {
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
  "3": {
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

function App(): JSX.Element {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isLoggedIn] = useState(false);

  const handleJobClick = (id: number): void => {
    setSelectedJobId(id);
  };

  const handleLoginModal = (): void => {
    // TODO: Implement login modal functionality
    console.log('Login modal clicked');
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <Home 
              jobData={jobData}
              selectedJobId={selectedJobId}
              onJobClick={handleJobClick}
            />
          }
        />
        <Route path="/about" element={<About onNavigate={() => {}} />} />
        <Route 
          path="/listposition" 
          element={
            <ListPosition 
              isLoggedIn={isLoggedIn} 
              onLogin={handleLoginModal} 
            />
          } 
        />
        <Route path="/your-listings" element={<YourListings />} />
        <Route
          path="/job/:id/apply"
          element={<JobApplication jobData={jobData} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
