// وسيط بين الموقع (https) وبوت xsystemshosting (http://IP:PORT)
// لتغيير العنوان لاحقاً: Vercel > Settings > Environment Variables > BOT_ORIGIN
const ORIGIN = process.env.BOT_ORIGIN || "http://195.123.189.235:25883";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 9000);
    const isPost = req.method === "POST";
    const body = isPost
      ? (typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}))
      : undefined;
    const r = await fetch(ORIGIN + req.url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body,
      signal: ctl.signal,
    });
    clearTimeout(t);
    res.status(r.status).send(await r.text());
  } catch (e) {
    res.status(502).send(JSON.stringify({ error: "تعذّر الوصول للبوت، حاول بعد قليل." }));
  }
};
