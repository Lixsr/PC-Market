const baseUrl =
  process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

async function createOrder(price: number) {
  const token = await generatePaypalToken();
  const url = `${baseUrl}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price,
          },
        },
      ],
    }),
  });
  return await handleResponse(response);
}
async function capturePayment(orderId: string) {
  const token = await generatePaypalToken();
  const url = `${baseUrl}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return await handleResponse(response);
}

export const paypal = {
  createOrder,
  capturePayment,
};

// Paypal Token
async function generatePaypalToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const { access_token } = await handleResponse(response);
  return access_token;
}
export { generatePaypalToken };

async function handleResponse(response: Response) {
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(await response.text());
  }
}
