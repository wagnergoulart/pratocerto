export default function handler(req, res) {
  const { mac, type = "colon" } = req.query;

  if (!mac) {
    return res.status(400).json({ error: "MAC não informado" });
  }

  const clean = mac.replace(/[^a-fA-F0-9]/g, '');

  if (clean.length !== 12) {
    return res.status(400).json({ error: "MAC inválido" });
  }

  const parts = clean.match(/.{2}/g);

  let formatted;
  switch (type) {
    case "dash":
      formatted = parts.join("-");
      break;
    case "dot":
      formatted = parts.join("").match(/.{4}/g).join(".");
      break;
    default:
      formatted = parts.join(":");
  }

  res.status(200).json({
    original: mac,
    formatted: formatted.toUpperCase()
  });
}
