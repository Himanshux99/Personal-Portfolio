import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { site } from "../site";
import Reveal from "./Reveal";

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  };
  return (
    <button type="button" className="btn" onClick={copy} aria-live="polite">
      {copied ? <Check size={16} strokeWidth={1.75} /> : <Copy size={16} strokeWidth={1.75} />}
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad border-t border-line">
      <div className="shell">
        <Reveal>
          <h2 id="contact-title" className="display max-w-[14ch] text-[clamp(2.8rem,8.4vw,7.5rem)]">
            Got a problem worth building for?
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-wrap gap-3">
            {site.email && (
              <>
                <a href={`mailto:${site.email}`} className="btn btn-primary">
                  <Mail size={16} strokeWidth={1.75} /> {site.email}
                </a>
                <CopyEmail email={site.email} />
              </>
            )}
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className={`btn ${site.email ? "" : "btn-primary"}`}
            >
              GitHub profile <ArrowUpRight size={16} strokeWidth={1.75} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {site.linkedin && (
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn">
                LinkedIn <ArrowUpRight size={16} strokeWidth={1.75} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {site.resume && (
              <a href={site.resume} className="btn" download>
                Resume
              </a>
            )}
          </div>
          {!site.email && (
            <p className="mt-5 max-w-[46ch] text-sm text-mute">
              The repositories are the best way to reach me for now. An email address and LinkedIn link will be added here.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
