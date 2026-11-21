import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <Link to="/" className="brand footer-brand"><span className="brand-mark" aria-hidden="true"><img src="/images/gidra-mark.png" alt="" /></span><span>gidra<span className="brand-period">.</span></span></Link>
      <span className="footer-note">Техника, которая делает каждый день лучше.</span>
      <span className="footer-copy">© 2026 Gidra. Все права защищены.</span>
    </div>
  </footer>
);

export default Footer;