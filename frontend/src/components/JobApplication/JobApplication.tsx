import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './JobApplication.scss';

interface StudentInfo {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  cNumber: string;
  phoneNumber: string;
  racialEthnicGroups: string[];
  citizenship: string;
  academicStanding: string;
  graduationDate: string;
  major1College: string;
  major1: string;
  hasAdditionalMajor: boolean;
  major2College: string;
  major2: string;
  isPreHealth: boolean;
  gpa: string;
}

interface Availability {
  mondayAvailability: string;
  tuesdayAvailability: string;
  wednesdayAvailability: string;
  thursdayAvailability: string;
  fridayAvailability: string;
  weeklyHours: string;
  desiredProjectLength: string;
}

interface AdditionalInfo {
  hasPrevResearchExperience: boolean;
  prevResearchExperience: string;
  researchInterestDescription: string;
  hasFederalWorkStudy: boolean;
  speaksOtherLanguages: boolean;
  additionalLanguages: string[];
  comfortableWithAnimals: boolean;
}

interface FormData {
  studentInfo: StudentInfo;
  availability: Availability;
  additionalInfo: AdditionalInfo;
  resumeFile: File | null;
}

interface JobApplicationProps {
  jobData: Record<string, any>; // Replace 'any' with proper job type
}

const JobApplicationPage: React.FC<JobApplicationProps> = ({ jobData }) => {
  const { id } = useParams<{ id: string }>();
  const job = id ? jobData[id] : null;

  const [formData, setFormData] = useState<FormData>({
    studentInfo: {
      name: {
        firstName: "",
        lastName: "",
      },
      email: "",
      cNumber: "",
      phoneNumber: "",
      racialEthnicGroups: [],
      citizenship: "US_CITIZEN",
      academicStanding: "FRESHMAN",
      graduationDate: "",
      major1College: "ARTS_AND_SCIENCES",
      major1: "",
      hasAdditionalMajor: false,
      major2College: "",
      major2: "",
      isPreHealth: false,
      gpa: "",
    },
    availability: {
      mondayAvailability: "",
      tuesdayAvailability: "",
      wednesdayAvailability: "",
      thursdayAvailability: "",
      fridayAvailability: "",
      weeklyHours: "NINE_TO_ELEVEN",
      desiredProjectLength: "ONE_SEMESTER",
    },
    additionalInfo: {
      hasPrevResearchExperience: false,
      prevResearchExperience: "",
      researchInterestDescription: "",
      hasFederalWorkStudy: false,
      speaksOtherLanguages: false,
      additionalLanguages: [],
      comfortableWithAnimals: false,
    },
    resumeFile: null,
  });

  const handleInputChange = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (
    section: keyof FormData,
    parentField: keyof StudentInfo, // restrict parentField to known keys of StudentInfo
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...((prev[section] as StudentInfo)[parentField] as Record<string, string>),
          [field]: value,
        },
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type.includes("word"))
    ) {
      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
      }));
    } else {
      alert("Please upload a PDF or Word document");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append(
      "application",
      JSON.stringify({
        studentInfo: formData.studentInfo,
        availability: formData.availability,
        additionalInfo: formData.additionalInfo,
      })
    );

    if (formData.resumeFile) {
      formDataToSend.append("resume", formData.resumeFile);
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit application: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application");
    }
  };

  if (!job) {
    return <div className="job-application__error">Job not found!</div>;
  }

  return (
    <div className="job-application">
      <h2 className="job-application__title">Apply for {job.title}</h2>

      <form onSubmit={handleSubmit} className="job-application__form">
        {/* Form sections */}
        {/* ... Rest of the JSX remains the same, just update className to use BEM ... */}
      </form>
    </div>
  );
};

export default JobApplicationPage;