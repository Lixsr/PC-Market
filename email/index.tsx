import { Resend } from "resend";
import { RESEND_SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import dotenv from "dotenv";
dotenv.config();
import PurchaseReceiptEmail from "./PurchaseReceiptEmail";
const resend = new Resend(process.env.RESEND_API_KEY as string);
resend.apiKeys.create({ name: "Production" });

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${RESEND_SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
