export type KycVerification = {
  sessionId: string;
  dni?: string;
  profileId?: string;
  status: string;
  AMLStatus: string;
  statusReasons: string[];
  updatedAt: Date;
};
