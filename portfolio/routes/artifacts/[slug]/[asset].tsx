import { define } from "@/utils.ts";

const assetTypes = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

export const handler = define.handlers({
  async GET(ctx) {
    const { asset, slug } = ctx.params;
    const directory = asset.endsWith(".pdf") ? "files" : "images";
    const filename = `${directory}/${asset}`;
    const extension = asset.split(".").pop()?.toLowerCase();
    const contentType = extension &&
      assetTypes[extension as keyof typeof assetTypes];
    if (!contentType || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(asset)) {
      return new Response(null, { status: 404 });
    }

    try {
      const body = await Deno.readFile(
        `content/artifacts/posts/${slug}/${filename}`,
      );
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
