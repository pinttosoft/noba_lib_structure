import { FlagType } from "./enums/flag_type.enum";
import { CardType } from "./enums/card_type.enum";

export class Card {
  private clientId: string;
  private cardId: string;
  private cardNumber: string;
  private cardType: CardType;
  private flagType: FlagType;

  static createNewCard(
    clientId: string,
    cardId: string,
    cardNumber: string,
    cardType: CardType,
    flagType: FlagType,
  ): Card {
    const c: Card = new Card();

    c.clientId = clientId;
    c.cardId = cardId;
    c.cardNumber = c.maskedCardNumber(cardNumber);
    c.cardType = cardType;
    c.flagType = flagType;

    return c;
  }

  static fromPrimitives(plainData: any): Card {
    const c: Card = new Card();

    c.clientId = plainData.clientId;
    c.cardId = plainData.cardId;
    c.cardNumber = plainData.cardNumber;
    c.cardType = plainData.cardType;
    c.flagType = plainData.flagType;

    return c;
  }

  private maskedCardNumber(cardNumber: string): string {
    return cardNumber.substr(0, 4) + "********" + cardNumber.substr(12, 4);
  }

  toPrimitives(): any {
    return {
      clientId: this.clientId,
      cardId: this.cardId,
      cardNumber: this.cardNumber,
      cardType: this.cardType,
      flagType: this.flagType,
    };
  }
}
