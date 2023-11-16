import { DocumentType } from "../domain/enums/document_type.enum";
import { DocumentSide } from "../domain/enums/document_side.enum";
import { Layer2DocumentType } from "../domain/enums/layer2_document_type.enum";

export class NobaDocumentTypeConverter {
  static convertThirPartyToNoba(thirdPartyType: string): DocumentType | null {
    switch (thirdPartyType) {
      case "PASSPORT":
        return DocumentType.PASSPORT;
      case "DRIVERS_LICENCE_FRONT":
        return DocumentType.DRIVERS_LICENSE;
      // Add other mappings as needed
      default:
        return null;
    }
  }

  static convertNobaToThirdParty(
    nobaType: DocumentType,
    side?: DocumentSide,
  ): string | null {
    switch (nobaType) {
      case DocumentType.PASSPORT:
        return Layer2DocumentType.PASSPORT;
      case DocumentType.DRIVERS_LICENSE:
        return side === DocumentSide.FRONT
          ? Layer2DocumentType.DRIVERS_LICENCE_FRONT
          : Layer2DocumentType.DRIVERS_LICENCE_BACK;
      // Add other mappings as needed
      default:
        return null;
    }
  }
}
