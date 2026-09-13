import { escapeXml } from "@/lib/shared/xml.ts";

Deno.test("escapeXml escapes XML special characters", () => {
  const actual = escapeXml(`A & B < C > D "quote" 'apostrophe'`);
  const expected =
    "A &amp; B &lt; C &gt; D &quot;quote&quot; &apos;apostrophe&apos;";
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
});
