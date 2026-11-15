/**
 * Micro-service de contact — AFRIK'LEARN Consulting (site vitrine).
 *
 * Pourquoi un service séparé plutôt qu'une route Astro ?
 * Le site vitrine est buildé en statique pur (output: "static", voir astro.config.mjs)
 * pour tenir les budgets de performance (CLAUDE.md §11). Astro statique ne peut pas
 * exécuter de logique serveur à la requête sans adaptateur Node — ce qui romprait ce choix.
 * Ce micro-service isole le SEUL besoin dynamique (l'envoi d'email) et tourne sous PM2
 * sur le VPS existant, exactement comme academy.afriklearn-consulting.com.
 *
 * Nginx route /api/contact vers ce service (voir docs/deployment.md).
 * Démarrage : pm2 start index.js --name afriklearn-vitrine-contact
 */
import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import { z } from "zod";

const app = express();
const PORT = process.env.CONTACT_SERVICE_PORT ?? 4001;

app.use(express.json({ limit: "20kb" }));

// --- Validation ---
const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  organization: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  subject: z.enum(["formation", "conseil", "partenariat", "autre"]),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot
});

const SUBJECT_LABELS = {
  formation: "Formation",
  conseil: "Conseil",
  partenariat: "Partenariat",
  autre: "Autre",
};

// --- Rate limiting en mémoire (par IP) ---
const WINDOW_MS = Number(process.env.CONTACT_FORM_RATE_LIMIT_WINDOW_MS ?? 60_000);
const MAX_REQUESTS = Number(process.env.CONTACT_FORM_RATE_LIMIT_MAX ?? 5);
const submissionLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

// --- SMTP ---
function buildTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("Configuration SMTP incomplète — vérifier le .env du service.");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

app.post("/api/contact", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? req.socket.remoteAddress;

    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "Trop de requêtes. Réessayez plus tard." });
    }

    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Données invalides." });
    }

    // Honeypot rempli = bot : on répond 200 sans rien envoyer, sans alerter le bot.
    if (result.data.website) {
      return res.status(200).json({ ok: true });
    }

    const { name, email, organization, phone, subject, message } = result.data;
    const subjectLabel = SUBJECT_LABELS[subject];

    const transporter = buildTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `[Site vitrine] Nouveau contact — ${subjectLabel}`,
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        organization ? `Organisation : ${organization}` : null,
        phone ? `Téléphone : ${phone}` : null,
        `Sujet : ${subjectLabel}`,
        "",
        "Message :",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Erreur formulaire contact :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`[contact-service] en écoute sur le port ${PORT}`);
});
