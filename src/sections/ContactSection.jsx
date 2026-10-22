import { site } from "../data/editorial";
import FooterGarden from "../components/FooterGarden";
import "../styles/contact-archive.css";
export default function ContactSection() {
  return (
    <section
      id="contact"
      tabIndex="-1"
      className="portfolio-section editorial-contact contact-archive"
      aria-labelledby="contact-title"
    >
      <div className="footer-identity">
        <a
          className="footer-signature"
          href="#home"
          aria-label="Preethi, back to home"
        >
          <span aria-hidden="true">✳</span>
          <h2 id="contact-title">Preethi</h2>
        </a>
        <p>
          A little logic.
          <br />A little imagination.
        </p>
        <FooterGarden />
      </div>
      <div className="footer-socials">
        <h3>Find me elsewhere</h3>
        {site.socials.map((social) => (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
        {site.email && <a href={`mailto:${site.email}`}>Say hello ↗</a>}
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        Preethi
      </div>
      <footer className="portfolio-footer footer-credits">
        <a className="footer-back-top" href="#home">Back to top ↑</a>
        <span>© Preethi.</span>
        <span>Made with care & curiosity.</span>
      </footer>
    </section>
  );
}
