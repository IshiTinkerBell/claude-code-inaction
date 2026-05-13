// @vitest-environment node
import { test, expect, vi, beforeEach } from "vitest";
import { jwtVerify } from "jose";

vi.mock("server-only", () => ({}));

const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

const JWT_SECRET = new TextEncoder().encode("development-secret-key");

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.JWT_SECRET;
  process.env.NODE_ENV = "test";
});

test("createSession sets an httpOnly auth-token cookie", async () => {
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");

  expect(mockCookieStore.set).toHaveBeenCalledOnce();
  const [name, , options] = mockCookieStore.set.mock.calls[0];
  expect(name).toBe("auth-token");
  expect(options.httpOnly).toBe(true);
});

test("createSession cookie has correct sameSite and path", async () => {
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookieStore.set.mock.calls[0];
  expect(options.sameSite).toBe("lax");
  expect(options.path).toBe("/");
});

test("createSession sets secure:false outside production", async () => {
  process.env.NODE_ENV = "test";
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookieStore.set.mock.calls[0];
  expect(options.secure).toBe(false);
});

test("createSession sets secure:true in production", async () => {
  process.env.NODE_ENV = "production";
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookieStore.set.mock.calls[0];
  expect(options.secure).toBe(true);

  process.env.NODE_ENV = "test";
});

test("createSession cookie expires in ~7 days", async () => {
  const before = Date.now();
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");
  const after = Date.now();

  const [, , options] = mockCookieStore.set.mock.calls[0];
  const expiresMs = options.expires.getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  expect(expiresMs).toBeGreaterThanOrEqual(before + sevenDaysMs - 1000);
  expect(expiresMs).toBeLessThanOrEqual(after + sevenDaysMs + 1000);
});

test("createSession mints a valid HS256 JWT", async () => {
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");

  const [, token] = mockCookieStore.set.mock.calls[0];
  const { payload } = await jwtVerify(token, JWT_SECRET);

  expect(payload.userId).toBe("user-123");
  expect(payload.email).toBe("test@example.com");
});

test("createSession JWT contains expiresAt ~7 days from now", async () => {
  const before = Date.now();
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");
  const after = Date.now();

  const [, token] = mockCookieStore.set.mock.calls[0];
  const { payload } = await jwtVerify(token, JWT_SECRET);

  const expiresAt = new Date(payload.expiresAt as string).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  expect(expiresAt).toBeGreaterThanOrEqual(before + sevenDaysMs - 1000);
  expect(expiresAt).toBeLessThanOrEqual(after + sevenDaysMs + 1000);
});

test("createSession JWT exp claim is ~7 days from now", async () => {
  const before = Math.floor(Date.now() / 1000);
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");
  const after = Math.floor(Date.now() / 1000);

  const [, token] = mockCookieStore.set.mock.calls[0];
  const { payload } = await jwtVerify(token, JWT_SECRET);

  const sevenDaysSecs = 7 * 24 * 60 * 60;
  expect(payload.exp).toBeGreaterThanOrEqual(before + sevenDaysSecs - 5);
  expect(payload.exp).toBeLessThanOrEqual(after + sevenDaysSecs + 5);
});
