import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Enums matching backend
const CITIZENSHIP_OPTIONS = {
  US_CITIZEN: "U.S. Citizen",
  PERMANENT_RESIDENT: "Permanent Resident",
  INTERNATIONAL: "International Student",
};

const ACADEMIC_STANDING_OPTIONS = {
  FRESHMAN: "Freshman",
  SOPHOMORE: "Sophomore",
  JUNIOR: "Junior",
  SENIOR: "Senior",
  GRADUATE: "Graduate",
};

const COLLEGE_OPTIONS = {
  ARTS_AND_SCIENCES: "College of Arts and Sciences",
  ENGINEERING: "College of Engineering",
  BUSINESS: "School of Business",
  MEDICINE: "School of Medicine",
  OTHER: "Other",
};

const WEEKLY_HOURS_OPTIONS = {
  LESS_THAN_NINE: "Less than 9 hours",
  NINE_TO_ELEVEN: "9-11 hours",
  TWELVE_TO_FIFTEEN: "12-15 hours",
  FIFTEEN_PLUS: "15+ hours",
};

const PROJECT_LENGTH_OPTIONS = {
  ONE_SEMESTER: "One Semester",
  TWO_SEMESTERS: "Two Semesters",
  SUMMER: "Summer",
  FOUR_PLUS: "4+ Semesters",
};

const JobApplicationPage = ({ jobData }) => {
  const { id } = useParams();
  const job = jobData[id];

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
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

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (section, parentField, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value,
        },
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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

  if (!job) {
    return <div>Job not found!</div>;
  }

  return (
    <div className="job-application-page">
      <h2>Apply for {job.title}</h2>

      <form onSubmit={handleSubmit} className="application-form">
        {/* Student Information Section */}
        <section className="form-section">
          <h3>Personal Information</h3>

          {/* Name Fields */}
          <div className="form-group">
            <label>
              First Name:
              <input
                type="text"
                value={formData.studentInfo.name.firstName}
                onChange={(e) =>
                  handleNestedInputChange(
                    "studentInfo",
                    "name",
                    "firstName",
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label>
              Last Name:
              <input
                type="text"
                value={formData.studentInfo.name.lastName}
                onChange={(e) =>
                  handleNestedInputChange(
                    "studentInfo",
                    "name",
                    "lastName",
                    e.target.value
                  )
                }
                required
              />
            </label>
          </div>

          {/* Contact Information */}
          <div className="form-group">
            <label>
              Email:
              <input
                type="email"
                value={formData.studentInfo.email}
                onChange={(e) =>
                  handleInputChange("studentInfo", "email", e.target.value)
                }
                required
              />
            </label>

            <label>
              C Number:
              <input
                type="text"
                value={formData.studentInfo.cNumber}
                onChange={(e) =>
                  handleInputChange("studentInfo", "cNumber", e.target.value)
                }
                required
                pattern="C\d{8}"
                title="Please enter a valid C number (e.g., C12345678)"
              />
            </label>

            <label>
              Phone Number:
              <input
                type="tel"
                value={formData.studentInfo.phoneNumber}
                onChange={(e) =>
                  handleInputChange(
                    "studentInfo",
                    "phoneNumber",
                    e.target.value
                  )
                }
                required
              />
            </label>
          </div>

          {/* Academic Information */}
          <div className="form-group">
            <label>
              Citizenship Status:
              <select
                value={formData.studentInfo.citizenship}
                onChange={(e) =>
                  handleInputChange(
                    "studentInfo",
                    "citizenship",
                    e.target.value
                  )
                }
                required
              >
                {Object.entries(CITIZENSHIP_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Academic Standing:
              <select
                value={formData.studentInfo.academicStanding}
                onChange={(e) =>
                  handleInputChange(
                    "studentInfo",
                    "academicStanding",
                    e.target.value
                  )
                }
                required
              >
                {Object.entries(ACADEMIC_STANDING_OPTIONS).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Expected Graduation Date:
              <input
                type="date"
                value={formData.studentInfo.graduationDate}
                onChange={(e) =>
                  handleInputChange(
                    "studentInfo",
                    "graduationDate",
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label>
              GPA:
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={formData.studentInfo.gpa}
                onChange={(e) =>
                  handleInputChange("studentInfo", "gpa", e.target.value)
                }
                required
              />
            </label>
          </div>

          {/* Major Information */}
          <div className="form-group">
            <label>
              Primary College:
              <select
                value={formData.studentInfo.major1College}
                onChange={(e) =>
                  handleInputChange(
                    "studentInfo",
                    "major1College",
                    e.target.value
                  )
                }
                required
              >
                {Object.entries(COLLEGE_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Primary Major:
              <input
                type="text"
                value={formData.studentInfo.major1}
                onChange={(e) =>
                  handleInputChange("studentInfo", "major1", e.target.value)
                }
                required
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={formData.studentInfo.hasAdditionalMajor}
                onChange={(e) =>
                  handleInputChange(
                    "studentInfo",
                    "hasAdditionalMajor",
                    e.target.checked
                  )
                }
              />
              Do you have an additional major?
            </label>

            {formData.studentInfo.hasAdditionalMajor && (
              <>
                <label>
                  Secondary College:
                  <select
                    value={formData.studentInfo.major2College}
                    onChange={(e) =>
                      handleInputChange(
                        "studentInfo",
                        "major2College",
                        e.target.value
                      )
                    }
                    required
                  >
                    {Object.entries(COLLEGE_OPTIONS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Secondary Major:
                  <input
                    type="text"
                    value={formData.studentInfo.major2}
                    onChange={(e) =>
                      handleInputChange("studentInfo", "major2", e.target.value)
                    }
                    required
                  />
                </label>
              </>
            )}
          </div>
        </section>

        {/* Availability Section */}
        <section className="form-section">
          <h3>Availability</h3>

          {/* Weekly Schedule */}
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
            (day) => (
              <label key={day}>
                {day} Availability:
                <input
                  type="text"
                  value={
                    formData.availability[`${day.toLowerCase()}Availability`]
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "availability",
                      `${day.toLowerCase()}Availability`,
                      e.target.value
                    )
                  }
                  placeholder="e.g., 9AM-5PM"
                  required
                />
              </label>
            )
          )}

          <label>
            Weekly Hours:
            <select
              value={formData.availability.weeklyHours}
              onChange={(e) =>
                handleInputChange("availability", "weeklyHours", e.target.value)
              }
              required
            >
              {Object.entries(WEEKLY_HOURS_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Desired Project Length:
            <select
              value={formData.availability.desiredProjectLength}
              onChange={(e) =>
                handleInputChange(
                  "availability",
                  "desiredProjectLength",
                  e.target.value
                )
              }
              required
            >
              {Object.entries(PROJECT_LENGTH_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {/* Additional Information Section */}
        <section className="form-section">
          <h3>Additional Information</h3>

          <label>
            <input
              type="checkbox"
              checked={formData.additionalInfo.hasPrevResearchExperience}
              onChange={(e) =>
                handleInputChange(
                  "additionalInfo",
                  "hasPrevResearchExperience",
                  e.target.checked
                )
              }
            />
            Do you have previous research experience?
          </label>

          {formData.additionalInfo.hasPrevResearchExperience && (
            <label>
              Describe your previous research experience:
              <textarea
                value={formData.additionalInfo.prevResearchExperience}
                onChange={(e) =>
                  handleInputChange(
                    "additionalInfo",
                    "prevResearchExperience",
                    e.target.value
                  )
                }
                required
              />
            </label>
          )}

          <label>
            Research Interest Description:
            <textarea
              value={formData.additionalInfo.researchInterestDescription}
              onChange={(e) =>
                handleInputChange(
                  "additionalInfo",
                  "researchInterestDescription",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.additionalInfo.hasFederalWorkStudy}
              onChange={(e) =>
                handleInputChange(
                  "additionalInfo",
                  "hasFederalWorkStudy",
                  e.target.checked
                )
              }
            />
            Do you have Federal Work Study?
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.additionalInfo.speaksOtherLanguages}
              onChange={(e) =>
                handleInputChange(
                  "additionalInfo",
                  "speaksOtherLanguages",
                  e.target.checked
                )
              }
            />
            Do you speak any languages other than English?
          </label>

          {formData.additionalInfo.speaksOtherLanguages && (
            <label>
              List additional languages:
              <input
                type="text"
                value={formData.additionalInfo.additionalLanguages.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "additionalInfo",
                    "additionalLanguages",
                    e.target.value.split(",").map((lang) => lang.trim())
                  )
                }
                placeholder="e.g., Spanish, French"
                required
              />
            </label>
          )}

          <label>
            <input
              type="checkbox"
              checked={formData.additionalInfo.comfortableWithAnimals}
              onChange={(e) =>
                handleInputChange(
                  "additionalInfo",
                  "comfortableWithAnimals",
                  e.target.checked
                )
              }
            />
            Are you comfortable working with animals?
          </label>
        </section>

        {/* Resume Upload */}
        <section className="form-section">
          <h3>Resume</h3>
          <label>
            Upload Resume (PDF or Word document):
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
          </label>
        </section>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationPage;
