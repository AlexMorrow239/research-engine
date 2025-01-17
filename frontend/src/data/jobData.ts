import { Job } from '../types';

export const jobData: Record<string, Job> = {
  "1": {
    id: 1,
    title: "Research Assistant - Neuroscience Lab",
    faculty: "Dr. Sarah Chen",
    snippet: "Join our neuroscience lab studying brain plasticity and learning mechanisms.",
    imgUrl: "/Users/alex/Desktop/research-engine/frontend/public/images/08aa46_74580d18522d460a87792f7d1002a43cmv2.webp",
    labFocus: "Our lab focuses on understanding neural mechanisms underlying learning and memory formation, with particular emphasis on synaptic plasticity.",
    researchProjects: "Current projects include studying the role of hippocampal neurons in spatial memory formation and investigating synaptic changes during skill acquisition.",
    openPositions: "2",
    researchCategory: ["Neuroscience", "Molecular Biology", "Behavioral Studies"],
    officeLocation: "Life Sciences Building, Room 305",
    hoursPerWeek: "10-15",
    projectLength: "2 semesters",
    requiredCourses: "BIO 101, NEUR 201",
    publications: [
      {
        title: "Neural Mechanisms of Memory Formation",
        link: "https://journal.neuroscience.org/article1"
      },
      {
        title: "Synaptic Plasticity in Learning",
        link: "https://journal.neuroscience.org/article2"
      }
    ],
    applicationDeadline: "2024-05-15"
  },
  "2": {
    id: 2,
    title: "Quantum Computing Research Assistant",
    faculty: "Prof. Michael Zhang",
    snippet: "Work on cutting-edge quantum computing algorithms and implementations.",
    imgUrl: "/images/labs/quantum-lab.jpg",
    labFocus: "Our lab specializes in quantum computing algorithms and quantum error correction.",
    researchProjects: "Current focus includes developing new quantum algorithms for optimization problems and improving quantum error correction codes.",
    openPositions: "3",
    researchCategory: ["Quantum Computing", "Computer Science", "Physics"],
    officeLocation: "Physics Building, Room 420",
    hoursPerWeek: "12-15",
    projectLength: "1 year",
    requiredCourses: "PHYS 301, CS 302",
    publications: [
      {
        title: "Novel Quantum Error Correction Methods",
        link: "https://quantum-journal.org/paper1"
      }
    ],
    applicationDeadline: "2024-06-01"
  },
  "3": {
    id: 3,
    title: "Climate Change Research Assistant",
    faculty: "Dr. Emily Rodriguez",
    snippet: "Analyze climate data and contribute to climate change prediction models.",
    imgUrl: "/images/labs/climate-lab.jpg",
    labFocus: "We study climate change patterns and develop predictive models for future climate scenarios.",
    researchProjects: "Currently working on improving climate prediction models and analyzing historical climate data patterns.",
    openPositions: "1",
    researchCategory: ["Environmental Science", "Data Science", "Climatology"],
    officeLocation: "Earth Sciences Building, Room 205",
    hoursPerWeek: "15-20",
    projectLength: "1 semester",
    requiredCourses: "ENV 201, STAT 301",
    publications: [
      {
        title: "Climate Change Patterns in the 21st Century",
        link: "https://climate-science.org/article1"
      },
      {
        title: "Predictive Modeling for Climate Change",
        link: "https://climate-science.org/article2"
      }
    ],
    applicationDeadline: "2024-05-30"
  }
};

export default jobData;