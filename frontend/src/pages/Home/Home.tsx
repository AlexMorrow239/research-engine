import React from "react";
import Banner from "../../components/layout/Banner/Banner";
import FiltersBar from "../../components/FiltersBar/FiltersBar";
import JobListPane from "../../components/JobListPane/JobListPane";
import JobDetailPane from "../../components/JobDetailPane/JobDetailPane";
import { Job } from "../../types";
import "./Home.scss";

interface HomeProps {
  jobData: Record<string, Job>;
  selectedJobId: number | null;
  onJobClick: (id: number) => void;
}

const Home: React.FC<HomeProps> = ({ jobData, selectedJobId, onJobClick }) => {
  return (
    <>
      <Banner />
      <FiltersBar />
      <div className="main-content">
        <JobListPane
          jobData={jobData}
          selectedJobId={selectedJobId}
          onJobClick={onJobClick}
        />
        <JobDetailPane job={selectedJobId ? jobData[selectedJobId] : null} />
      </div>
    </>
  );
};

export default Home;