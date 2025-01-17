import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProfessorRegister.scss';

interface Publication {
  title: string;
  link: string;
}

interface ProfessorRegisterData {
  email: string;
  password: string;
  adminPassword: string;
  name: {
    firstName: string;
    lastName: string;
  };
  department: string;
  title?: string;
  researchAreas?: string[];
  office: string;
  publications?: Publication[];
  bio?: string;
}

const ProfessorRegister: React.FC = () => {
  const [formData, setFormData] = useState<ProfessorRegisterData>({
    email: '',
    password: '',
    adminPassword: '',
    name: {
      firstName: '',
      lastName: '',
    },
    department: '',
    office: '',
  });
  const [newResearchArea, setNewResearchArea] = useState('');
  const [newPublication, setNewPublication] = useState<Publication>({ title: '', link: '' });
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof ProfessorRegisterData];
        if (parentObj && typeof parentObj === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddResearchArea = () => {
    if (newResearchArea.trim()) {
      setFormData(prev => ({
        ...prev,
        researchAreas: [...(prev.researchAreas || []), newResearchArea.trim()]
      }));
      setNewResearchArea('');
    }
  };

  const handleAddPublication = () => {
    if (newPublication.title && newPublication.link) {
      setFormData(prev => ({
        ...prev,
        publications: [...(prev.publications || []), { ...newPublication }]
      }));
      setNewPublication({ title: '', link: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/professors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        login(data.token);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="professor-register">
      <h1>Professor Registration</h1>
      <form onSubmit={handleSubmit} className="professor-register__form">
        <div className="professor-register__section">
          <h2>Required Information</h2>
          
          <div className="professor-register__field">
            <label>Email (miami.edu)</label>
            <input
              type="email"
              name="email"
              pattern="^[a-zA-Z0-9._-]+@miami\.edu$"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="professor-register__field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              minLength={8}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <small>Minimum 8 characters, must include uppercase, lowercase, number, and special character</small>
          </div>

          <div className="professor-register__field">
            <label>Admin Password</label>
            <input
              type="password"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="professor-register__field">
            <label>First Name</label>
            <input
              type="text"
              name="name.firstName"
              value={formData.name.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="professor-register__field">
            <label>Last Name</label>
            <input
              type="text"
              name="name.lastName"
              value={formData.name.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="professor-register__field">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="professor-register__field">
            <label>Office Location</label>
            <input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="professor-register__section">
          <h2>Optional Information</h2>
          
          <div className="professor-register__field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              placeholder="e.g., Associate Professor"
            />
          </div>

          <div className="professor-register__field">
            <label>Research Areas</label>
            <div className="professor-register__array-input">
              <input
                type="text"
                value={newResearchArea}
                onChange={(e) => setNewResearchArea(e.target.value)}
                placeholder="Add research area"
              />
              <button type="button" onClick={handleAddResearchArea}>Add</button>
            </div>
            <ul>
              {formData.researchAreas?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="professor-register__field">
            <label>Publications</label>
            <div className="professor-register__publication-input">
              <input
                type="text"
                value={newPublication.title}
                onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Publication title"
              />
              <input
                type="url"
                value={newPublication.link}
                onChange={(e) => setNewPublication(prev => ({ ...prev, link: e.target.value }))}
                placeholder="Publication link"
              />
              <button type="button" onClick={handleAddPublication}>Add</button>
            </div>
            <ul>
              {formData.publications?.map((pub, index) => (
                <li key={index}>
                  <a href={pub.link} target="_blank" rel="noopener noreferrer">{pub.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="professor-register__field">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              maxLength={1000}
              placeholder="Brief professional biography"
            />
          </div>
        </div>

        <button type="submit" className="professor-register__submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default ProfessorRegister;