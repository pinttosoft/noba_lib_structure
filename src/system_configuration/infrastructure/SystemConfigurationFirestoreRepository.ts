// import { System_configuration_repositoryInterface } from "../domain/interfaces/System_configuration_repositoryInterface";
// import { FirestoreConnection } from "../../shared/infrastructure";
// import { Fee_swapType } from "../domain/types/Fee_swapType";
// import { firestore } from "firebase-admin";
// import Firestore = firestore.Firestore;
// import { FeeWireContent } from "../domain/types/FeeWireContent";
// import { Fee_swap_for_program_referrals } from "../domain/types/Fee_swap_for_program_referrals";
//
// export class SystemConfigurationFirestoreRepository
//   implements System_configuration_repositoryInterface
// {
//   public db: Firestore;
//
//   private static _instance: SystemConfigurationFirestoreRepository;
//
//   constructor() {
//     this.db = FirestoreConnection();
//   }
//
//   static instance(): System_configuration_repositoryInterface {
//     if (this._instance) {
//       return this._instance;
//     }
//
//     this._instance = new SystemConfigurationFirestoreRepository();
//     return this._instance;
//   }
//
//   async getIntegratorSwapFee(): Promise<Fee_swapType> {
//     const data = await this.db.collection("system_configuration").get();
//
//     return { ...data.docs[0].data().integrator };
//   }
//
//   async getNobaFee(): Promise<Fee_swapType> {
//     const data = await this.db.collection("system_configuration").get();
//
//     return { ...data.docs[0].data().noba };
//   }
//
//   async getDefaultFeeWire(): Promise<FeeWireContent> {
//     const data = await this.db.collection("system_configuration").get();
//
//     return { ...data.docs[0].data().feeWire };
//   }
//
//   async getDefaultFeeSwap(): Promise<Fee_swapType> {
//     const data = await this.db.collection("system_configuration").get();
//
//     return { ...data.docs[0].data().feeSwap };
//   }
//
//   async getFeeNobaForSwapOfBusinessOpportunities(): Promise<number> {
//     const data = await this.db.collection("system_configuration").get();
//
//     return data.docs[0].data().getFeeNobaForSwapOfBusinessOpportunities;
//   }
//
//   async getFeeSwapProgramReferrals(): Promise<Fee_swap_for_program_referrals> {
//     const data = await this.db.collection("system_configuration").get();
//
//     return { ...data.docs[0].data().feeSwapProgramReferrals };
//   }
// }
