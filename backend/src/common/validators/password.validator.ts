export class PasswordValidator {
  private static readonly requirements = {
    minLength: 8,
    patterns: [
      { regex: /[A-Z]/, description: 'one uppercase letter' },
      { regex: /[a-z]/, description: 'one lowercase letter' },
      { regex: /\d/, description: 'one number' },
    ],
  };

  static validate(password: string): boolean {
    if (password.length < this.requirements.minLength) return false;
    return this.requirements.patterns.every(({ regex }) => regex.test(password));
  }

  static getRequirements(): string[] {
    return [
      `At least ${this.requirements.minLength} characters long`,
      ...this.requirements.patterns.map(({ description }) => `Contains at least ${description}`),
    ];
  }
}
