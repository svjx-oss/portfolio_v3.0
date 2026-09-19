Reliable systems should make the ordinary path easy to understand.

![An autumn road through a forest](images/sample.jpeg)

## Predictable systems

When a service has clear boundaries and familiar failure modes, teams can spend their attention on the problem in front of them instead of guessing how the platform behaves.

> Reliability is a product feature: people should be able to understand what happens next.

```ts title="retry.ts"
function retryDelay(attempt: number) {
  return Math.min(1_000 * 2 ** attempt, 30_000);
}
```

> [!NOTE]
> This is a callout example for highlighting an important detail without interrupting the flow.

> [!TIP]
> Prefer simple defaults that make the safe path easy to follow.

> [!IMPORTANT]
> Document the constraints that shape an interface before optimizing its implementation.

> [!WARNING]
> Retries need a limit and observability; otherwise they can hide a failing dependency.

> [!CAUTION]
> Do not turn an uncommon case into the default path without a clear reason.

## The useful kind of boring

Useful boring software is not lifeless. It is deliberate: predictable interfaces, visible tradeoffs, and a structure that still reads clearly after the original implementation is forgotten.
