import crypto from "crypto";

export default function handler(req, res) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return res.status(500).json({
        error: "Missing IMAGEKIT_PUBLIC_KEY or IMAGEKIT_PRIVATE_KEY in Vercel env vars",
      });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    return res.status(200).json({ token, expire, signature, publicKey });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to authenticate imagekit" });
  }
}
