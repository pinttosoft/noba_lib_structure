export { CompanyDTO } from "./domain/types/company.type";
export { IndividualDTO } from "./domain/types/Individual.type";
export { ResidencyStatus } from "./domain/enums/residency_status";
export { IClient } from "./domain/interfaces/client.interface";
export { IClientRepository } from "./domain/interfaces/client_repository.interface";

export { CompanyType } from "./domain/enums/company_type.enum";

export { ClientFactory } from "./domain/factories/client.factory";
export { Client } from "./domain/client";

export { ClientNotFound } from "./domain/exceptions/client_not_found";
export { InvalidMethodForClientType } from "./domain/exceptions/invalid_method_client_type";

export { ClientMongoRepository } from "./infrastructure/mongo/client_mongo_repository";
