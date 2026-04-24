import { expect, test } from "@playwright/test";

function apiEnvelopeOk(data: unknown, traceId = "trace_test_ok") {
  return { traceId, data };
}

function apiEnvelopeError(message: string, traceId = "trace_test_err") {
  return { traceId, error: { message } };
}

test.describe("auth (web)", () => {
  test("sign up navigates to home on success", async ({ page }) => {
    await page.route("**/api/auth/sign-up", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiEnvelopeOk({})),
        headers: { "x-trace-id": "trace_test_ok" },
      });
    });

    await page.goto("/sign-up");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();

    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill(`test+${Date.now()}@example.com`);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Sell Items" })).toBeVisible();
  });

  test("sign up shows API error message + trace id", async ({ page }) => {
    await page.route("**/api/auth/sign-up", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify(apiEnvelopeError("Email already exists.", "trace_signup_400")),
        headers: { "x-trace-id": "trace_signup_400" },
      });
    });

    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("taken@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create account" }).click();

    const alert = page.locator("main [role='alert']");
    await expect(alert).toContainText("Email already exists.");
    await expect(alert).toContainText("Trace ID:");
    await expect(alert).toContainText("trace_signup_400");
  });

  test("sign in navigates to home on success", async ({ page }) => {
    await page.route("**/api/auth/sign-in", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiEnvelopeOk({})),
        headers: { "x-trace-id": "trace_signin_ok" },
      });
    });

    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Sell Items" })).toBeVisible();
  });

  test("sign in shows API error message + trace id", async ({ page }) => {
    await page.route("**/api/auth/sign-in", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify(apiEnvelopeError("Invalid email or password.", "trace_signin_401")),
        headers: { "x-trace-id": "trace_signin_401" },
      });
    });

    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    const alert = page.locator("main [role='alert']");
    await expect(alert).toContainText("Invalid email or password.");
    await expect(alert).toContainText("Trace ID:");
    await expect(alert).toContainText("trace_signin_401");
  });
});

