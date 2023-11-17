type MailingAddress = {
  unit_number: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
};

type CustomerDetails = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email_address: string;
  mailing_address: MailingAddress;
  telephone_number: string;
  tax_reference_number: string;
  passport_number: string;
  nationality: string;
  date_of_birth: string; // You might want to use a Date type if you're working with dates
  percentage_ownership: number;
  title: string;
  us_residency_status: "US_CITIZEN" | "NON_CITIZEN";
};

export type AccountToOpen = {
  account_id: string;
  product_id: string;
  asset_type_id: string;
};

export type ApplicationType = {
  INDIVIDUAL: "INDIVIDUAL";
  CORPORATION: "CORPORATION";
};

export type ApplicationDataIndividual = {
  application_type: ApplicationType;
  account_to_open: AccountToOpen;
  terms_and_conditions_accepted: boolean;
  customer_id: string;
  customer_details: CustomerDetails;
};

type InvestmentProfile = {
  primary_source_of_funds: string;
  total_investable_assets: string;
  total_assets: string;
  asset_allocation_to_crypto: string;
  investment_experience_crypto: string;
  investment_strategy_crypto: string;
  initial_deposit_source: string;
  initial_deposit_source_crypto_details: string;
  initial_deposit_source_fiat_details: string;
  ongoing_deposit_source: string;
  frequency_of_crypto_transactions: string;
  crypto_investment_plans: string;
  investment_proceeds_use: string;
  expected_crypto_assets: string;
  perform_transfers_with_unhosted_wallets: boolean;
  known_unhosted_wallet_addresses: string;
  trades_per_month: string;
  usd_value_of_crypto: string;
  frequency_of_transactions: string;
  monthly_crypto_investment_deposit: string;
  monthly_investment_deposit: string;
  monthly_crypto_deposits: string;
  monthly_deposits: string;
  monthly_crypto_investment_withdrawal: string;
  monthly_investment_withdrawal: string;
  monthly_crypto_withdrawals: string;
  monthly_withdrawals: string;
  trade_internationally: boolean;
  trade_jurisdictions: string[];
};

export type KYCProfile = {
  primary_business: string;
  description_of_business_nature: string;
  is_charitable: boolean;
  business_jurisdictions: string[];
  funds_send_receive_jurisdictions: string[];
  new_york_office: boolean;
  engage_in_activities: string[];
  regulated_status: string;
  regulation_agency: string;
  regulation_agency_regulation_number: string;
  control_exemption_reason: string;
  vendors_and_counterparties: string;
};

export type CorporationCustomerDetails = CustomerDetails & {
  registered_name: string;
  trading_name: string;
  registered_number: string;
  registered_address: MailingAddress;
  physical_address: MailingAddress;
  telephone_number: string;
  website_address: string;
  state_of_incorporation: string;
  country_of_incorporation: string;
  corporate_entity_type: string;
  corporate_entity_type_description: string;
  email_address: string;
  established_on: string;
  naics: string;
  naics_description: string;
  investment_profile: InvestmentProfile;
  kyc_profile: KYCProfile;
};

export type CorporationApplicationData = {
  application_type: "CORPORATION";
  account_to_open: AccountToOpen;
  terms_and_conditions_accepted: boolean;
  customer_id: string;
  customer_details: CorporationCustomerDetails;
};
