import { ArrowUpRight } from "lucide-react";

export default function BackToTop() {
  return (
    <a className="back-to-top" href="#top" aria-label="Back to top">
      <ArrowUpRight size={16} />
    </a>
  );
}
