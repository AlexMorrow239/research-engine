import type { Department } from "@/common/enums";

export interface Professor {
  _id: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
    _id?: string;
  };
  department: Department;
  title?: string;
  researchAreas?: string[];
  office: string;
  publications?: Publication[];
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Publication {
  title: string;
  link: string;
}
