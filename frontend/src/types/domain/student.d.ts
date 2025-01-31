import type { BaseState } from "../state/common";
import type { Application } from "./application";

export interface ApplicationsState extends BaseState {
  items: Application[];
  currentApplication: Application | null;
  filters: {
    status?: ApplicationStatus;
  };
}
