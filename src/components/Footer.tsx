import { footer } from "../content";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="bg-bg-surface py-8">
      <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <img src="/signature.png" alt={footer.name} className="h-7 w-auto" />
          <p className="text-sm text-text-muted">{footer.copyright}</p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-5">
          {footer.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-sm text-text-secondary hover:text-text-primary">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap items-center justify-center gap-5">
          {footer.social.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent hover:text-text-primary"
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
