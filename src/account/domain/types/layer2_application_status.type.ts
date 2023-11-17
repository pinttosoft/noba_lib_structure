import { AccountToOpen, ApplicationType } from "./layer2_application.type";
import { Layer2Documents } from "../../../documents";

export type Layer2ApplicationStatusType = {
  id: string;
  status: string;
  application_type: ApplicationType; // Add other application types if needed
  account_to_open: AccountToOpen;
  terms_and_conditions_accepted: boolean;
  customer_id: string;
  application_errors: string[];
  application_validation_errors: ValidationError[];
  application_document_errors: ApplicationDocumentError[];
  individual_errors?: IndividualError[];
  application_individual_errors?: ApplicationIndividualErrors;
};

type ValidationError = {
  field_name: string;
  field_status: string;
  description: string;
};

export type ApplicationDocumentError = {
  id: string;
  status: string;
  description?: string;
  document: Layer2Documents;
};

type ApplicationIndividualErrors = {
  individual_id: string;
  validation_errors: IndividualValidationError[];
  document_errors: ApplicationDocumentError[];
};

export type IndividualError = {
  id: string;
  individual_validation_errors: ValidationError[];
  individual_document_errors: ApplicationDocumentError[];
};

export type IndividualValidationError = {
  field_name: string;
  field_status: string;
  description: string;
};
