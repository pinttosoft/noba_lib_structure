import { Individual } from "../../../client/domain/types/Individual";

type member = {
  title: string;
  percentage: number;
};

export type AccountMember = member & Individual;
