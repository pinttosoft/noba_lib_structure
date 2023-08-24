export interface MessageBus {
  transmissionMessage(payload: string, topic: string): Promise<void>;
  subscribe(
    subscriptionName: string,
    callback: Function,
    timeout: number,
  ): void;
}
