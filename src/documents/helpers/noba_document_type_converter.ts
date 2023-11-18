import { DocumentType } from "../domain/enums/document_type.enum";
import { DocumentSide } from "../domain/enums/document_side.enum";
import { Layer2Documents } from "../domain/enums/layer2_document_type.enum";

export class NobaDocumentTypeConverter {
  static convertThirdPartyToNoba(thirdPartyType: string): DocumentType | null {
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
  ): Layer2Documents | null {
    // console.log('"nobaType, side",');
    // console.log(nobaType, side);
    switch (nobaType) {
      case DocumentType.PASSPORT:
        return Layer2Documents.PASSPORT;
      case DocumentType.DRIVERS_LICENSE:
        // console.log("side", side);
        // console.log("side === DocumentSide.FRONT", side === DocumentSide.FRONT);
        return side === DocumentSide.FRONT
          ? Layer2Documents.DRIVERS_LICENCE_FRONT
          : Layer2Documents.DRIVERS_LICENCE_BACK;
      // Add other mappings as needed
      default:
        return null;
    }
  }
}
