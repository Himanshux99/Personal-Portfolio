import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { site } from "../site";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";
import PixelButton from "./PixelButton";

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
      {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad border-t border-ink">
      <div className="shell">
        <Reveal>
          <SplitHeading id="contact-title" className="display max-w-[13ch] text-[clamp(2.8rem,9vw,8.2rem)]" text="Got a problem worth building for?" />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-wrap gap-3">
            {site.email && (
              <>
                <PixelButton variant="primary" href={`mailto:${site.email}`} className="btn btn-primary">
                  <Mail size={16} strokeWidth={1.5} /> {site.email}
                </PixelButton>
                <CopyEmail email={site.email} />
              </>
            )}
            <a href={site.github} target="_blank" rel="noreferrer" className={`btn ${site.email ? "" : "btn-primary"}`}>
              GitHub profile <ArrowUpRight size={16} strokeWidth={1.5} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {site.linkedin && (
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn">
                LinkedIn <ArrowUpRight size={16} strokeWidth={1.5} />
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
