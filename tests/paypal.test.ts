// Alias (@) does not work in tests
import { generatePaypalToken, paypal } from "../lib/paypal";

// Test for Paypal Token Generation
test("Generate paypal token", async () => {
  const token = await generatePaypalToken();
  expect(typeof token).toBe("string");
  expect(token.length).toBeGreaterThan(0);
  expect(token).toBeDefined();
});

// Test for Create Order
test("Create order", async () => {
  const price = 50.0;
  const order = await paypal.createOrder(price);
  expect(order).toHaveProperty("id");
  expect(order).toHaveProperty("status", "CREATED");
  expect(order).toHaveProperty("links");
  expect(order.links[0]).toHaveProperty("href");
});

// Test for Capture Payment with mock order
test("Capture payment simulation", async () => {
  const price = 75.0;
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });
  const order = await paypal.createOrder(price);
  const capture = await paypal.capturePayment(order.id);
  expect(capture).toHaveProperty("status", "COMPLETED");
  // Restore the original implementation
  // This is important to avoid side effects in other tests
  mockCapturePayment.mockRestore();
});
