import { STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY } from "../../config";
import {
  CreatePaymentResponse,
  PaymentGateway,
  PaymentMetadata,
} from "./payment.type";

import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

const createPayment = async (
  amount: number,
  metadata: PaymentMetadata
): Promise<CreatePaymentResponse> => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata,
  });

  return {
    secret: paymentIntent.client_secret as string,
    pubKey: STRIPE_PUBLIC_KEY,
    amount: paymentIntent.amount,
  };
};

const getPayment = async (
  paymentId: string
): Promise<Record<string, unknown>> => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
  return {
    status: paymentIntent.status,
    paymentLog: paymentIntent,
  };
};

export const StripePayment: PaymentGateway = {
  createPayment,
  getPayment,
};
