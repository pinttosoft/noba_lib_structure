export type KycVerification = {
  sessionId: string;
  status: string;
  AMLStatus: string;
  statusReasons: string[];
  dni?: string;
  updatedAt: Date;
};
