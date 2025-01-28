export interface Publication {
  title: string;
  link: string;
}

export interface Professor {
  _id: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
    _id?: string;
  };
  department: string;
  title?: string;
  researchAreas?: string[];
  office: string;
  publications?: Publication[];
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessorAccountUpdate {
  name: {
    firstName: string;
    lastName: string;
  };
  department: Department;
  title?: string;
  office: string;
  researchAreas: string[];
  publications?: Publication[];
  bio?: string;
}
