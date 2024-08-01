import { IClient } from "./interfaces/client.interface";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import {
  AccountStatus,
  AccountType,
  IAccount,
  IOwnerAccount,
} from "../../account";
import { CompanyDTO } from "./types/company.type";
import { IndividualDTO } from "./types/Individual.type";
import {
  Address,
  ContactInformation,
  GenericException,
  removeAccents,
} from "../../shared";
import { InvalidMethodForClientType } from "./exceptions/invalid_method_client_type";
import { ResidencyStatus } from "./enums/residency_status";
import {
  CommissionForRechargingCard,
  FeeACHPanama,
  FeeAchUsd,
  FeeSwap,
  FeeWire,
  TransactionalProfile,
} from "../../system_configuration";
import { Documents } from "../../documents";
import { KycAction } from "./types/kyc-action.type";
import { InvestmentProfile } from "./types/investment-profile.type";
import { KycProfileType } from "./types/kyc-profile.type";
import { KycVerification } from "./types/kyc-verification";
import { FollowUpClient } from "./types/follow-up-client.type";
import { TransactionalProfileType } from "./types/transactional-profile.type";
import { WalletProvider } from "../../wallet";

export class Client extends AggregateRoot implements IClient {
  private clientId: string;
  private clientData: any;
  private clientType: AccountType;
  private account: IAccount;
  private id?: string;
  private isSegregated?: boolean;
  private kycRequestedChanges?: KycAction[];
  private clientFollowUp?: FollowUpClient[];
  private accountId: string;
  private taxId?: string;
  private status: AccountStatus;
  private feeSwap?: FeeSwap;
  private feeWire?: FeeWire;
  private feeACHPanama?: FeeACHPanama;
  private feeRechargingCard: CommissionForRechargingCard;
  private feeAchUsd?: FeeAchUsd;
  private transactionalProfile: TransactionalProfileType;
  private documents: Documents[] = [];
  private companyPartners: IOwnerAccount[] = [];
  private twoFactorActive: boolean = false;
  private createdAt: Date;
  private approvedAt: Date;
  private addressShipping: Address;
  private nationality?: string;
  private documentExpirationDate?: string;
  private assignedWalletProvider: WalletProvider[];

  setAssignedWalletProvider(walletProvider: WalletProvider[]): Client {
    this.assignedWalletProvider = walletProvider;
    return this;
  }

  setAddressShipping(address: Address): Client {
    this.addressShipping = { ...address, isShipping: true };
    this.clientData.addressShipping = this.addressShipping;
    return this;
  }

  getAssignedWalletProvider(): WalletProvider[] {
    return this.assignedWalletProvider;
  }

  getAddressShipping(): Address {
    return this.clientData.addressShipping;
  }

  getId(): string {
    return this.id;
  }

  getFirstName(): string {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType, "getFirstName");
    }
    return this.clientData.firstName;
  }

  getLastName(): string {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType, "getLastName");
    }
    return this.clientData.lastName;
  }

  setStatus(clientStatus: AccountStatus): Client {
    this.status = clientStatus;
    return this;
  }

  setTaxId(taxId?: string): Client {
    this.taxId = taxId;
    return this;
  }

  setClientId(clientId: string): Client {
    this.clientId = clientId;
    return this;
  }

  setId(id: string): Client {
    this.id = id;
    return this;
  }

  setAccount(account: IAccount): Client {
    this.account = account;
    this.accountId = account.getAccountId();
    return this;
  }

  setAccountId(accountId: string): Client {
    this.accountId = accountId;
    return this;
  }

  setFeeWire(fee: FeeWire): Client {
    this.feeWire = fee;
    return this;
  }

  setFeeSwap(fee: FeeSwap): Client {
    this.feeSwap = fee;
    return this;
  }

  setFeeRechargingCard(fee: CommissionForRechargingCard): Client {
    this.feeRechargingCard = fee;
    return this;
  }

  setTransactionalProfile(transactionalProfile: TransactionalProfile): IClient {
    this.transactionalProfile = transactionalProfile;
    return this;
  }

  setFeeACHPanama(fee: FeeACHPanama) {
    this.feeACHPanama = fee;
    return this;
  }

  setFeeAchUsd(feeAchUsd: FeeAchUsd): IClient {
    this.feeAchUsd = feeAchUsd;
    return this;
  }

  setClientData(data: any): Client {
    this.clientData = data;
    this.createdAt = data.createdAt;
    this.approvedAt = data.approvedAt;
    this.nationality = data.nationality;
    this.documentExpirationDate = data.documentExpirationDate;
    this.twoFactorActive = data.twoFactorActive ?? false;
    this.clientFollowUp = data.clientFollowUp ?? [];

    return this;
  }

  setDocument(dni: string, document: Documents): Client {
    if (dni === this.getIDNumber()) {
      if (this.documents && this.documents.length > 0) {
        const documentExist = this.documents.find(
          (doc) =>
            doc.getDocumentSide() === document.getDocumentSide() &&
            doc.getDocumentType() === document.getDocumentType(),
        );

        if (!documentExist) {
          this.documents.push(document);
          return;
        }

        this.documents = this.documents.map((doc) => {
          if (
            doc.getDocumentSide() === document.getDocumentSide() &&
            doc.getDocumentType() === document.getDocumentType()
          ) {
            return Documents.updateDocument(doc, {
              patch: document.getPathFile(),
            });
          }

          return doc;
        });
      } else {
        this.documents = [document];
      }

      return;
    }

    if (!this.companyPartners || this.companyPartners.length === 0) {
      throw new GenericException("Company partners not found");
    }

    this.companyPartners.forEach((p: IOwnerAccount) => {
      if (p.getIdentifyNumber() === dni) {
        p.setDocument(document);
      }
    });
    return this;
  }

  setClientType(clientType: AccountType): Client {
    this.clientType = clientType;
    return this;
  }

  setCompanyPartners(partners: IOwnerAccount[]): Client {
    this.companyPartners = partners;
    return this;
  }

  getCompanyPartners(): IndividualDTO[] | undefined {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getCompanyToPrimitives",
      );
    }

    return this.clientData.partners;
  }

  setCreatedAt(date: Date): Client {
    this.createdAt = date;
    return this;
  }

  setApprovedAt(date: Date): Client {
    this.approvedAt = date;
    return this;
  }

  getTaxId(): string {
    return this.taxId;
  }

  getStatus(): AccountStatus {
    return this.status;
  }

  getAccount(): IAccount {
    return this.account;
  }

  build(): void {
    if (this.clientType == AccountType.COMPANY) {
      this.clientId =
        this.clientData.informationCompany.name.replace(" ", "-") +
        this.clientData.informationCompany.registerNumber;
    } else {
      this.clientId =
        this.clientData.firstName.substring(0, 1) +
        this.clientData.lastName.replace(" ", "-") +
        this.clientData.dni;
    }

    this.clientId = removeAccents(this.clientId).replace(/\s/g, "-");
  }

  getCompanyToPrimitives(): CompanyDTO {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getCompanyToPrimitives",
      );
    }
    return this.clientData as CompanyDTO;
  }

  getNaics(): { code: string; description: string } {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType, "getNaics");
    }
    return {
      code: this.clientData.informationCompany.naics,
      description: this.clientData.informationCompany.naicsDescription,
    };
  }

  getEstablishedDate(): Date {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getEstablishedDate",
      );
    }
    return this.clientData.informationCompany.establishedDate;
  }

  getWebSite(): string {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType, "getWebSite");
    }
    return this.clientData.informationCompany.webSite;
  }

  getEmploymentStatus() {
    if (this.clientType !== AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getEmploymentStatus",
      );
    }
    return this.clientData.employmentStatus;
  }

  getOccupation() {
    if (this.clientType !== AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType, "getOccupation");
    }
    return this.clientData.occupation;
  }

  getClientId(): string {
    return this.clientId;
  }

  getClientType(): AccountType {
    return this.clientType;
  }

  getName(): string {
    if (this.clientType == AccountType.INDIVIDUAL) {
      return (
        this.clientData.firstName +
        " " +
        this.clientData.middleName +
        " " +
        this.clientData.lastName
      );
    }

    return this.clientData.informationCompany.name;
  }

  getPhoneNumber() {
    if (this.clientType === AccountType.INDIVIDUAL)
      return this.clientData.phoneNumber;

    return this.clientData.informationCompany.phoneNumber;
  }

  getCountryPhone() {
    if (this.clientType === AccountType.INDIVIDUAL)
      return this.clientData.phoneCountry;

    return this.clientData.informationCompany.phoneCountry;
  }

  getEmail(): string {
    return this.clientData.email;
  }

  getIDNumber(): string {
    if (this.clientType === AccountType.COMPANY) {
      return (this.toPrimitives() as CompanyDTO).informationCompany
        .registerNumber;
    } else {
      return (this.toPrimitives() as IndividualDTO).dni;
    }
  }

  getAddress(): Address {
    const d = this.toPrimitives();
    if (this.clientType === AccountType.COMPANY) {
      return (this.toPrimitives() as CompanyDTO).informationCompany
        .physicalAddress;
    }

    return {
      streetOne: d.streetOne,
      streetTwo: d.streetTwo,
      postalCode: d.postalCode,
      city: d.city,
      region: d.region,
      country: d.country,
    };
  }

  getContactInformation(): ContactInformation {
    const d = this.toPrimitives();

    return {
      phoneCountry: d.phoneCountry,
      phoneNumber: d.phoneNumber,
      email: d.email,
    };
  }

  getPassportNumber(): string {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getPassportNumber",
      );
    }
    return this.clientData.passport;
  }

  getDateOfBirth(): Date {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType, "getDateOfBirth");
    }

    return this.clientData.dateBirth;
  }

  getResidencyStatus(): ResidencyStatus {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getResidencyStatus",
      );
    }

    return this.clientData.residencyStatus;
  }

  getFeeRechargingCard(): CommissionForRechargingCard {
    return this.feeRechargingCard;
  }

  getFeeSwap(): FeeSwap {
    return this.feeSwap;
  }

  getFeeWire(): FeeWire {
    return this.feeWire;
  }

  getTransactionalProfile(): TransactionalProfileType {
    return this.transactionalProfile;
  }

  getFeeACHPanama(): FeeACHPanama {
    return this.feeACHPanama;
  }

  getFeeAchUsd(): FeeAchUsd {
    return this.feeAchUsd;
  }

  activeTwoFactorAuth(): void {
    this.twoFactorActive = true;
  }

  disableTwoFactorAuth(): void {
    this.twoFactorActive = false;
  }

  updateData(data: IndividualDTO | CompanyDTO): void {
    this.clientData = data;
    delete this.clientData.password;
    delete this.clientData._id;
  }

  markAsSendData(): IClient {
    this.status = AccountStatus.SUBMITTED;
    return this;
  }

  markAsUnderReview(): IClient {
    this.status = AccountStatus.PROCESSING;
    return this;
  }

  approveSegregated(): void {
    this.status = AccountStatus.APPROVED;
    this.setApprovedAt(new Date());

    this.accountId = process.env.PINTTOSOFT_ACCOUNT;
    this.isSegregated = true;
  }

  approveOwnAccount(): void {
    this.isSegregated = false;
    this.setApprovedAt(new Date());
    this.status = AccountStatus.APPROVED;
  }

  rejectSegregated(): void {
    this.status = AccountStatus.REJECTED;
  }

  setKYCVerification(data: KycVerification): Client {
    this.clientData.kycVerification = data;

    return this;
  }

  getKYCVerification(): KycVerification {
    return this.clientData.kycVerification;
  }

  getKYCVerificationPartner(dni: string): KycVerification {
    const partner = this.getCompanyPartners().find(
      (partner: IndividualDTO) => partner.dni === dni,
    );

    if (!partner) {
      return null;
    }

    return partner.kycVerification;
  }

  setKycVerificationToPartner(kycVerification: KycVerification): IClient {
    const partners = this.getCompanyPartners().map((partner) => {
      if (partner.dni === kycVerification.reference) {
        return {
          ...partner,
          kycVerification,
        };
      }

      return partner;
    });
    this.setClientData({ ...this.clientData, partners });

    return this;
  }

  setKycVerificationToDocument(kycVerification: KycVerification): IClient {
    const documents = this.getPrincipalDocuments().map((document) => {
      let newDoc = null;
      if (document.getDocumentId() === kycVerification.reference) {
        newDoc = Documents.updateDocument(document, {
          kycVerification,
        });
      }

      return newDoc ? newDoc : document;
    });

    this.documents = documents;

    return this;
  }

  getKycActions(): KycAction[] {
    if (this.clientType === AccountType.INDIVIDUAL) {
      return this.kycRequestedChanges;
    }

    const actions: KycAction[] = [];
    this.getCompanyPartners().map((partner: IndividualDTO) => {
      actions.push(...partner.kycRequestedChanges);
    });

    return actions;
  }

  getClientFollowUp(): FollowUpClient[] {
    return this.clientFollowUp;
  }

  setKycAction(kycAction: KycAction): IClient {
    if (!this.kycRequestedChanges) {
      this.kycRequestedChanges = [kycAction];
    } else {
      this.kycRequestedChanges.push(kycAction);
    }

    return this;
  }

  setClientFollowUp(clientFollowUp: FollowUpClient): IClient {
    if (!this.clientFollowUp) {
      this.clientFollowUp = [clientFollowUp];
    } else {
      this.clientFollowUp.push(clientFollowUp);
    }

    return this;
  }

  setKycActionToPartner(kycAction: KycAction): IClient {
    const partners = this.getCompanyPartners().map((partner) => {
      if (partner.dni === kycAction.dni) {
        const actions = partner.kycRequestedChanges ?? [];

        return {
          ...partner,
          kycRequestedChanges: [...actions, kycAction],
        };
      }

      return partner;
    });
    this.setClientData({ ...this.clientData, partners });

    return this;
  }

  deleteKycAction(id: string) {
    if (!this.kycRequestedChanges || this.kycRequestedChanges.length === 0) {
      throw new GenericException("Action not found");
    }

    const foundActionIndex = this.kycRequestedChanges.findIndex(
      (action: KycAction): boolean => action.id === id,
    );

    if (foundActionIndex === -1) {
      throw new GenericException("No action found");
    }

    this.kycRequestedChanges.splice(foundActionIndex, 1);
  }

  deleteFollowUp(id: string) {
    if (!this.clientFollowUp || this.clientFollowUp.length === 0) {
      throw new GenericException("Action not found");
    }

    const foundActionIndex = this.clientFollowUp.findIndex(
      (follow: FollowUpClient): boolean => follow.id === id,
    );

    if (foundActionIndex === -1) {
      throw new GenericException("No action found");
    }

    this.clientFollowUp.splice(foundActionIndex, 1);
  }

  deleteKycActionToPartner(kycAction: KycAction): void {
    const partners = this.getCompanyPartners();

    if (!partners || partners.length === 0) {
      throw new GenericException("No partners for the company");
    }

    const foundPartnerIndex = partners.findIndex(
      (partner): boolean => partner.dni === kycAction.dni,
    );

    if (foundPartnerIndex === -1) {
      throw new GenericException("Partner not found");
    }

    const foundActionIndex = partners[
      foundPartnerIndex
    ].kycRequestedChanges.findIndex(
      (action): boolean => action.id === kycAction.id,
    );

    if (foundActionIndex === -1) {
      throw new GenericException("No action found for the partner");
    }

    partners[foundPartnerIndex].kycRequestedChanges.splice(foundActionIndex, 1);

    this.setClientData({ ...this.clientData, partners });
  }

  deleteAllDocumentsPartners(dni: string): void {
    this.companyPartners.forEach((p: IOwnerAccount) => {
      if (p.getIdentifyNumber() === dni) {
        p.deleteAllDocs();
      }
    });
  }

  // retorna los documento del cliente de la cuenta, es decir
  // si es un cliente individual retorna sus documentos
  // si es una empresa retorna los documentos de la empresa
  getPrincipalDocuments(): Documents[] {
    return this.documents;
  }

  getInvestmentProfile(): InvestmentProfile {
    if (this.clientType === AccountType.INDIVIDUAL) {
      return {
        monthlyCryptoDeposits: this.clientData.monthlyCryptoDeposits ?? "",
        monthlyCryptoInvestmentDeposit:
          this.clientData.monthlyCryptoInvestmentDeposit ?? "",
        monthlyCryptoInvestmentWithdrawal:
          this.clientData.monthlyCryptoInvestmentWithdrawal ?? "",
        monthlyCryptoWithdrawals:
          this.clientData.monthlyCryptoWithdrawals ?? "",
        monthlyDeposits: this.clientData.monthlyDeposits ?? "",
        monthlyInvestmentDeposit:
          this.clientData.monthlyInvestmentDeposit ?? "",
        monthlyInvestmentWithdrawal:
          this.clientData.monthlyInvestmentWithdrawal ?? "",
        monthlyWithdrawals: this.clientData.monthlyWithdrawals ?? "",
        primarySourceOfFunds: this.clientData.primarySourceOfFunds ?? "",
        usdValueOfCrypto: this.clientData.usdValueOfCrypto ?? "",
        usdValueOfFiat: this.clientData.usdValueOfFiat ?? "",
      };
    }

    return this.clientData.investmentProfile;
  }

  getKYCProfile(): KycProfileType {
    if (this.clientType === AccountType.INDIVIDUAL) {
      return {
        businessJurisdictions: [],
        fundsSendReceiveJurisdictions:
          this.clientData.fundsSendReceiveJurisdictions ?? "",
        engageInActivities: this.clientData.engageInActivities ?? "",
        regulatedStatus: "",
        descriptionBusinessNature: "",
      };
    }
    return {
      businessJurisdictions:
        this.clientData.kycProfile.fundsSendReceiveJurisdictions ?? "",
      fundsSendReceiveJurisdictions:
        this.clientData.kycProfile.fundsSendReceiveJurisdictions ?? "",
      engageInActivities: this.clientData.kycProfile.engageInActivities ?? "",
      regulatedStatus: this.clientData.kycProfile.regulatedStatus,
      descriptionBusinessNature:
        this.clientData.kycProfile.descriptionBusinessNature ?? "",
    };
  }

  setCustomerIdentifierInServiceProvider(
    serviceProviderId: string,
    partnerDNI: string,
  ): void {
    const partnerIndex = this.clientData.partners.findIndex(
      (partner: IndividualDTO) => partner.dni === partnerDNI,
    );

    if (partnerIndex === -1) {
      throw new GenericException("Partner not found");
    }

    this.clientData.partners[partnerIndex].serviceProviderId =
      serviceProviderId;
  }

  getNationality(): string {
    return this.nationality;
  }

  getDocumentExpirationDate(): string {
    return this.documentExpirationDate;
  }

  toPrimitives(): any {
    return {
      isSegregated: this.isSegregated,
      clientId: this.clientId,
      ...this.clientData,
      type: this.clientType,
      accountId: this.accountId,
      status: this.status,
      feeSwap: this.feeSwap.toPrimitives(),
      feeWire: this.feeWire.toPrimitives(),
      feeACHPanama: this.feeACHPanama ? this.feeACHPanama.toPrimitives() : null,
      feeRechargingCard: this.feeRechargingCard.toPrimitives(),
      transactionalProfile: this.transactionalProfile,
      feeAchUsd: this.feeAchUsd ? this.feeAchUsd.toPrimitives() : null,
      documents: this.documents.map((d: Documents) => d.toPrimitives()),
      twoFactorActive: this.twoFactorActive,
      createdAt: this.createdAt,
      approvedAt: this.approvedAt,
      kycRequestedChanges: this.kycRequestedChanges,
      clientFollowUp: this.clientFollowUp,
      assignedWalletProvider: this.assignedWalletProvider,
    };
  }
}
