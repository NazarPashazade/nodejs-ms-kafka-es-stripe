import { getOrderDetails, PaymentGateway, PaymentMetadata } from "../utils";
import { brokerService } from "./broker.service";

const createPayment = async (
  customerId: number,
  orderNumber: number,
  token: string,
  paymentGateway: PaymentGateway
): Promise<any> => {
  try {
    const order = await getOrderDetails(orderNumber, token);

    if (customerId !== order.customerId) {
      throw new Error("Customer ID does not match the order's customer ID");
    }

    const amountCents = order.amount * 100;
    const metadata: PaymentMetadata = { orderNumber, customerId };

    const { amount, pubKey, secret } = await paymentGateway.createPayment(
      amountCents,
      metadata
    );

    // get Order details from order service
    // create new payment in database
    // call payment gateway to create payment
    // fetch amount
    // return paymentSecrets

    const result = { amount, pubKey, secret, order };
    return result;
  } catch (error) {
    console.error("Failed to publish payment event:", error);
    return false;
  }

  return {};
};

const verifyPayment = async (
  paymentId: string,
  paymentGateway: PaymentGateway
): Promise<any> => {
  try {
    // call payment gateway to verify payment
    const paymentResponse = await paymentGateway.getPayment(paymentId);

    // update Order Status through kafka
    await brokerService.sendPaymentUpdateMessage(paymentResponse);

    return { message: "Payment Verified", ...paymentResponse };
  } catch (error) {
    console.error("Failed to verify payment:", error);
    return false;
  }
};

export const paymentService = {
  createPayment,
  verifyPayment,
};
