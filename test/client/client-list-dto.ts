import {
  AccountType,
  CompanyDTO,
  IClient,
  IndividualDTO,
  Paginate,
  StorageAWS,
} from "../../src";

export const clientListDto = async (
  clients: Paginate<IClient>,
): Promise<Paginate<CompanyDTO | IndividualDTO>> => {
  const awsS3: StorageAWS = new StorageAWS(process.env.BUCKET_CLIENT_DOCUMENTS);

  const results = clients.results.map(async (client: IClient) => {
    const clientPrimitive = client.toPrimitives();

    const documents =
      clientPrimitive.documents === undefined ||
      clientPrimitive.documents.length === 0
        ? []
        : await documentData(clientPrimitive.documents, awsS3);

    if (client.getClientType() === AccountType.COMPANY) {
      const partners = await getPartners(clientPrimitive.partners, awsS3);
      return { ...clientPrimitive, documents, partners } as CompanyDTO;
    }

    return {
      ...clientPrimitive,
      documents,
    } as IndividualDTO;
  });

  return {
    nextPag: clients.nextPag,
    prevPag: clients.prevPag,
    count: clients.count,
    results: await Promise.all(results),
  };
};

const documentData = async (documents: any[], awsS3: StorageAWS) => {
  return await Promise.all(
    documents.map(async (document: any) => ({
      ...document,
      url: await awsS3.downloadFile(document.patch),
    })),
  );
};

const getPartners = async (partners: any[], awsS3: StorageAWS) => {
  return await Promise.all(
    partners.map(async (partner: any) => {
      return {
        ...partner,
        documents:
          partner.documents === undefined
            ? []
            : await documentData(partner.documents, awsS3),
      };
    }),
  );
};
