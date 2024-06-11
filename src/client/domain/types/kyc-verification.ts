export type KycVerification = {
  sessionId: string;
  reference?: string;
  profileId?: string;
  status: string;
  AMLStatus: string;
  statusReasons: string[];
  updatedAt: Date;
};
