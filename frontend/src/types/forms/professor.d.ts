import type { Professor } from "../domain/professor";

export interface ProfessorProfileForm
  extends Omit<Professor, "_id" | "createdAt" | "updatedAt"> {
  publications: {
    title: string;
    link: string;
  }[];
}
