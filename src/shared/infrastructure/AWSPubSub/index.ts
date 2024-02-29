import * as AWS from "aws-sdk";
import { MessageBus } from "../../domain/interfaces/message_bus";
import { logger } from "../../../index";

export class SNSMessage implements MessageBus {
  private sns: AWS.SNS;
  private sqs: AWS.SQS;

  constructor() {
    this.sns = new AWS.SNS();
    this.sqs = new AWS.SQS();
  }

  static instance() {
    return new SNSMessage();
  }

  async transmissionMessage(payload: string, topic: string): Promise<void> {
    try {
      const params = {
        Message: payload,
        TopicArn: `arn:aws:sns:${process.env.AWS_REGION}:837217772820:${topic}`,
      };

      const result = await this.sns.publish(params).promise();
      logger.info(`Message ${result.MessageId} published.`);
    } catch (error) {
      logger.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }
  }

  subscribe(topic: string, callback: Function): void {
    const SQSUrl = `https://sqs.${process.env.AWS_REGION}.amazonaws.com/837217772820/${topic}-sqs`;
    const params = {
      QueueUrl: SQSUrl,
      WaitTimeSeconds: 20,
      MaxNumberOfMessages: 1,
    };

    const receiveMessage = async () => {
      try {
        const data = await this.sqs.receiveMessage(params).promise();

        if (data.Messages && data.Messages.length > 0) {
          const message = data.Messages[0];
          const payload = message.Body;

          logger.info(`Received message id: ${message.MessageId}\t`);
          logger.info(`Received message Data: ${payload}`);

          // Procesa el mensaje
          callback(payload);

          // Elimina el mensaje de la cola después de procesarlo
          await this.sqs
            .deleteMessage({
              QueueUrl: SQSUrl,
              ReceiptHandle: message.ReceiptHandle,
            })
            .promise();
        }
      } catch (error) {
        logger.error(
          `Received error while receiving messages: ${error.message}`,
        );
      } finally {
        // Continúa recibiendo mensajes en un bucle infinito
        await receiveMessage();
      }
    };

    receiveMessage();
  }
}
