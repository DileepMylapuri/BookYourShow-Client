import React from "react";
import { ImageData } from "../assets/assets";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const links = {
    Movies: ["Now Showing", "Coming Soon", "Top Rated", "Bollywood", "Hollywood"],
    Events: ["Music Concerts", "Comedy Shows", "Theatre", "Sports", "Activities"],
    Help: ["FAQ", "Contact Us", "Terms & Conditions", "Privacy Policy", "Careers"],
  };

  const socials = [
    { icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
    { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
    { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
    { icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
  ];

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <img src={ImageData.BookYourShow} alt="BookYourShow" className="h-10 object-contain mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for booking movies, events, plays, sports and activities across India.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 bg-zinc-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-red-400 text-sm transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-400" />
              support@bookyourshow.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400" />
              1800-123-1432
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              Andhra Pradesh, India
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} BookYourShow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
