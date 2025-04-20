
import React from "react";
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeFooter() {
  return (
    <footer className="bg-blue-900 text-blue-100 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Repair Auto Pilot. All rights reserved.
        </div>
        <div className="flex gap-5">
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms-of-use" className="hover:underline">Terms of Use</Link>
        </div>
        <div className="flex gap-3">
          <a href="tel:1234567890" aria-label="Phone"><Phone className="w-5 h-5" /></a>
          <a href="mailto:info@repairautopilot.com" aria-label="Email"><Mail className="w-5 h-5" /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="Linkedin"><Linkedin className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
}
