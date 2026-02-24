import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import "./Footer.css";

const SOCIAL = [
  { icon: <Github size={24} />, href: "#", label: "GitHub" },
  { icon: <Linkedin size={24} />, href: "#", label: "LinkedIn" },
  { icon: <Twitter size={24} />, href: "#", label: "Twitter" },
  { icon: <Mail size={24} />, href: "#", label: "Email" },
];

const Footer = () => {
  return (
    <footer className="text-center py-5 border-top footer-custom">
      <div className="container">
        <div className="social-links mb-3">
          {SOCIAL.map(({ icon, href, label }) => (
            <a key={label} href={href} className="social-icon" aria-label={label}>
              {icon}
            </a>
          ))}
        </div>
        <p className="mb-0 text-muted">
          &copy; 2026 Web3Forward BuildMindz. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;