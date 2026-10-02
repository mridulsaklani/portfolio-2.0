import Link from "next/link";
import { Workflow } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href="#top" aria-label="Back to top">MS<span>.</span></a>
      <span className="footer-copy">DESIGNED &amp; ENGINEERED WITH CURIOSITY</span>
      <Link className="footer-link" href="/projects">PROJECTS</Link>
      <span className="footer-focus"><Workflow size={13} /> SOFTWARE × AI / ML</span>
      <span className="footer-year">© 2026</span>
    </footer>
  );
}
