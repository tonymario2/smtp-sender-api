const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post("/send", async (req, res) => {
  let { to, subject, html, from } = req.body;

  if (!to || !subject || !html || !from) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // 🔽 FIX: strip display name if present
  const match = from.match(/<(.+?)>/);
  if (match) {
    from = match[1];
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SMTP API running"));
