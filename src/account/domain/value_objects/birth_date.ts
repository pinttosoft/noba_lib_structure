import { GenericException } from "../../../shared";

export class BirthDate {
  private readonly value: Date;

  static minimumAge: number = 18;

  constructor(value: Date) {
    if (!this.isValidBirthDate(value)) {
      throw new GenericException("Invalid birth date.");
    }

    this.value = value;
  }

  private isValidBirthDate(date: Date): boolean {
    const currentDate = new Date();

    const minimumDate = new Date(
      currentDate.getFullYear() - BirthDate.minimumAge,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    return date <= currentDate && date <= minimumDate;
  }

  toDate(): Date {
    return this.value;
  }
}
