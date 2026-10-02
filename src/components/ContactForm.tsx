"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle, Send } from "lucide-react";

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/contact", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Contact status unavailable");
        return (await response.json()) as { configured?: boolean };
      })
      .then((result) => {
        if (mounted) setConfigured(result.configured === true);
      })
      .catch(() => {
        if (mounted) setConfigured(false);
      });
    return () => { mounted = false; };
  }, []);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      const result = (await response.json()) as { ok?: boolean; code?: string };

      if (!response.ok || !result.ok) {
        if (result.code === "CONTACT_NOT_CONFIGURED") {
          setError("Private message delivery isn’t connected yet. Your message was not collected.");
        } else if (result.code === "INVALID_MESSAGE") {
          setError("Please check your name, email address, and message, then try again.");
        } else {
          setError("The message could not be delivered. Please try again later.");
        }
        setState("error");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setError("The message could not be delivered. Please try again later.");
      setState("error");
    }
  }

  if (configured === null) {
    return (
      <div className="contact-form contact-form-unavailable" role="status" aria-live="polite">
        <div className="form-heading"><span className="form-index">MESSAGE / PRIVATE</span><span className="form-status"><i /> CHECKING ROUTE</span></div>
        <div className="form-unavailable-icon" aria-hidden="true"><span /><i /><b /></div>
        <h3>Checking the private message route.</h3>
        <p>The page will only collect your message when delivery is ready.</p>
        <span className="form-config-note">VERIFYING SECURE ENDPOINT</span>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="contact-form contact-form-unavailable" role="status">
        <div className="form-heading"><span className="form-index">MESSAGE / PRIVATE</span><span className="form-status"><i /> DELIVERY OFFLINE</span></div>
        <div className="form-unavailable-icon" aria-hidden="true"><span /><i /><b /></div>
        <h3>Private delivery is not connected yet.</h3>
        <p>The form will be ready when its private delivery endpoint is configured. No message is collected before then.</p>
        <span className="form-config-note">AWAITING SECURE ENDPOINT</span>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submitMessage} aria-busy={state === "sending"}>
      <div className="form-heading"><span className="form-index">MESSAGE / PRIVATE</span><span className="form-status form-status-live"><i /> DELIVERY READY</span></div>
      <label htmlFor="contact-name">Your name</label>
      <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={120} required disabled={state === "sending"} />
      <label htmlFor="contact-email">Email for a reply</label>
      <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required disabled={state === "sending"} />
      <label htmlFor="contact-message">What would you like to discuss?</label>
      <textarea id="contact-message" name="message" rows={4} maxLength={5000} required disabled={state === "sending"} />
      <button className="button button-primary form-submit" data-tilt type="submit" disabled={state === "sending"}>
        {state === "sending" ? <>Sending <LoaderCircle size={15} className="spinner" /></> : state === "success" ? <>Sent <Check size={15} /></> : <>Send a message <Send size={14} /></>}
        {state === "idle" && <ArrowUpRight size={14} />}
      </button>
      <p className="form-feedback" aria-live="polite" role={state === "error" ? "alert" : "status"}>
        {state === "success" ? "Your message was accepted for delivery. Thanks for reaching out." : state === "error" ? error : "Your message is routed through a private delivery endpoint."}
      </p>
    </form>
  );
}
