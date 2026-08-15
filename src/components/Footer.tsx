import { footer } from "../content";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="bg-bg-surface py-8">
      <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-base font-medium text-text-primary">{footer.name}</p>
          <p className="mt-1 text-sm text-text-muted">{footer.copyright}</p>
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
