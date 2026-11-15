import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  email: z.string().email("Adresse email invalide."),
  organization: z.string().optional(),
  phone: z.string().optional(),
  subject: z.enum(["formation", "conseil", "partenariat", "autre"], {
    required_error: "Veuillez choisir un sujet.",
  }),
  message: z.string().min(10, "Le message doit comporter au moins 10 caractères."),
  // Honeypot anti-spam — champ caché, doit rester vide
  website: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Échec de l'envoi");

      setSubmitState("success");
      reset();
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-xl bg-al-success/10 p-6 text-al-success" role="status">
        <p className="font-semibold">Message envoyé avec succès.</p>
        <p className="mt-1 text-sm">Nous reviendrons vers vous dans les plus brefs délais.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot — invisible pour un humain, piège pour les bots */}
      <input
        type="text"
        {...register("website")}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-al-ink-900">
            Nom complet
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="mt-1 w-full rounded-lg border border-al-ink-300 px-3 py-2 text-sm focus-visible:border-al-primary-700"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-al-error">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-al-ink-900">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 w-full rounded-lg border border-al-ink-300 px-3 py-2 text-sm focus-visible:border-al-primary-700"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-al-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-al-ink-900">
            Organisation
          </label>
          <input
            id="organization"
            type="text"
            {...register("organization")}
            className="mt-1 w-full rounded-lg border border-al-ink-300 px-3 py-2 text-sm focus-visible:border-al-primary-700"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-al-ink-900">
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="mt-1 w-full rounded-lg border border-al-ink-300 px-3 py-2 text-sm focus-visible:border-al-primary-700"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-al-ink-900">
          Sujet
        </label>
        <select
          id="subject"
          {...register("subject")}
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-al-ink-300 px-3 py-2 text-sm focus-visible:border-al-primary-700"
          aria-invalid={!!errors.subject}
        >
          <option value="" disabled>
            Choisir un sujet
          </option>
          <option value="formation">Formation</option>
          <option value="conseil">Conseil</option>
          <option value="partenariat">Partenariat</option>
          <option value="autre">Autre</option>
        </select>
        {errors.subject && (
          <p className="mt-1 text-xs text-al-error">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-al-ink-900">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="mt-1 w-full rounded-lg border border-al-ink-300 px-3 py-2 text-sm focus-visible:border-al-primary-700"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-al-error">
            {errors.message.message}
          </p>
        )}
      </div>

      {submitState === "error" && (
        <p role="alert" className="text-sm text-al-error">
          Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter
          directement par email.
        </p>
      )}

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="inline-flex items-center justify-center rounded-xl bg-al-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-al-primary-900 disabled:opacity-50"
      >
        {submitState === "submitting" ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
