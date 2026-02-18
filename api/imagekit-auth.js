import crypto from "crypto";

export default function handler(req, res) {
  // ✅ No cache (very important)
  res.setHeader("Cache-Control", "no-store, max-age=0");

  // ✅ Allow only GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return res.status(500).json({
        error: "Missing IMAGEKIT_PUBLIC_KEY or IMAGEKIT_PRIVATE_KEY in Vercel env vars",
      });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 60 * 10; // 10 min

    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    return res.status(200).json({
      token,
      expire,
      signature,
      // publicKey optional (keep if you want)
      publicKey,
    });
  } catch (e) {
    console.error("imagekit-auth error:", e);
    return res.status(500).json({ error: "Failed to authenticate imagekit" });
  }
}
