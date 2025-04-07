const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1c2e] p-4 text-center border-t border-[#2a3b4c]">
      <p className="text-sm text-[#a0b0c0]">© 2025 Auroville Community. All rights reserved.</p>
      <ul className="flex justify-center gap-4 mt-2">
        <li>
          <a href="#" className="text-[#a0b0c0] hover:text-white text-sm">
            About
          </a>
        </li>
        <li>
          <a href="#" className="text-[#a0b0c0] hover:text-white text-sm">
            Contact
          </a>
        </li>
        <li>
          <a href="#" className="text-[#a0b0c0] hover:text-white text-sm">
            Privacy Policy
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
