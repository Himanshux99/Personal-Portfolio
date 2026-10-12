import { site } from "../site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-8">
      <div className="shell flex flex-col gap-4 text-sm text-mute md:flex-row md:items-center md:justify-between">
        <p>
          <span className="text-ink">{site.name}</span>. {year}.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><a className="link-u hover:text-ink" href="#work">Work</a></li>
            <li><a className="link-u hover:text-ink" href="#about">About</a></li>
            <li><a className="link-u hover:text-ink" href="#contact">Contact</a></li>
            <li>
              <a className="link-u hover:text-ink" href={site.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li><a className="link-u hover:text-ink" href="#top">Back to top</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
