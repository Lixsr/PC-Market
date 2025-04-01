// Alias (@) does not work in tests
import { generatePaypalToken } from "../lib/paypal";

test("Generate paypal token", async () => {
  const token = await generatePaypalToken();
  expect (typeof token).toBe("string");
  expect(token.length).toBeGreaterThan(0);
  expect(token).toBeDefined();
  console.log(token);
});
