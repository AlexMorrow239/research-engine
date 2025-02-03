export enum ProjectStatus {
  /** Initial state when project is being created */
  DRAFT = 'DRAFT',
  /** Project is visible and accepting applications */
  PUBLISHED = 'PUBLISHED',
  /** Project is no longer accepting applications */
  CLOSED = 'CLOSED',
}

/**
 * Weekly time commitment ranges in hours
 */
export enum WeeklyAvailability {
  ZERO_TO_FIVE = '0-5',
  SIX_TO_EIGHT = '6-8',
  NINE_TO_ELEVEN = '9-11',
  TWELVE_PLUS = '12+',
}

/**
 * Project duration in semesters
 */
export enum ProjectLength {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR_PLUS = '4+',
}

export enum Campus {
  CORAL_GABLES = 'Coral Gables Campus',
  MEDICAL = 'Miller Med Campus',
  MARINE = 'Rosenstiel Marine Campus',
}
