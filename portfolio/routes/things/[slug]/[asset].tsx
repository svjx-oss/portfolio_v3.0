import { define } from "@/utils.ts";

const imageTypes = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const handler = define.handlers({
  async GET(ctx) {
    const { asset, slug } = ctx.params;
    const extension = asset.split(".").pop()?.toLowerCase();
    const contentType = extension &&
      imageTypes[extension as keyof typeof imageTypes];
    if (!contentType || asset.includes("/")) {
      return new Response(null, { status: 404 });
    }

    try {
      const body = await Deno.readFile(`content/things/posts/${slug}/${asset}`);
      return new Response(body, {
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
          "content-type": contentType,
        },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response(null, { status: 404 });
      }
      throw error;
    }
  },
});
