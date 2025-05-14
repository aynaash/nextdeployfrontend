
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limit";
import { MAX_TOKENS, REFILL_INTERVAL } from "@/lib/auth/constants";

describe("Rate Limiting", () => {
  const identifier = "test_identifier";

  beforeEach(async () => {
    await resetRateLimit(identifier);
  });

  it("should allow requests under the limit", async () => {
    for (let i = 0; i < MAX_TOKENS; i++) {
      const result = await checkRateLimit(identifier);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(MAX_TOKENS - i - 1);
    }
  });

  it("should block requests over the limit", async () => {
    for (let i = 0; i < MAX_TOKENS; i++) {
      await checkRateLimit(identifier);
    }

    const result = await checkRateLimit(identifier);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should refill tokens after interval", async () => {
    for (let i = 0; i < MAX_TOKENS; i++) {
      await checkRateLimit(identifier);
    }

    jest.useFakeTimers();
    jest.advanceTimersByTime(REFILL_INTERVAL + 1000);

    const result = await checkRateLimit(identifier);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(MAX_TOKENS - 1);

    jest.useRealTimers();
  });
});
