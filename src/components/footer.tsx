"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold font-cormorant text-white mb-2">
                Niat Qurban
              </h3>
              <p className="text-sm text-slate-300">
                Berbagi berkah, menanam kebajikan
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors inline-block"
                aria-label="Facebook"
              >
                <span className="text-sm font-semibold">f</span>
              </a>
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors inline-block"
                aria-label="Instagram"
              >
                <span className="text-sm font-semibold">ig</span>
              </a>
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors inline-block"
                aria-label="Twitter"
              >
                <span className="text-sm font-semibold">tw</span>
              </a>
            </div>
          </div>

          {/* Produk */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produk</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Paket Qurban
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Paket Aqiqah
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Katalog Lengkap
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Harga & Promo
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="font-semibold text-white mb-4">Informasi</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Dukungan */}
          <div>
            <h4 className="font-semibold text-white mb-4">Dukungan</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Pengiriman & Ongkir
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold text-white mb-4">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <Phone size={18} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                <a
                  href="tel:+62123456789"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  +62 (123) 456-789
                </a>
              </li>
              <li className="flex gap-3 items-start">
                <Mail size={18} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                <a
                  href="mailto:info@niatqurban.com"
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  info@niatqurban.com
                </a>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin size={18} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                <p className="text-slate-300 text-sm">
                  Jakarta, Indonesia
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Wujudkan Niat Qurban Anda
          </h3>
          <p className="text-emerald-100 mb-6">
            Pilih paket qurban atau aqiqah terbaik untuk berkah keluarga Anda
          </p>
          <button className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
            Pesan Sekarang
          </button>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Brand Message */}
            <div className="text-center md:text-left">
              <p className="text-emerald-400 font-semibold text-sm">
                Ibadah dengan hati, tulus dan ikhlas
              </p>
            </div>

            {/* Copyright */}
            <div className="text-center text-sm text-slate-400">
              <p>
                &copy; {currentYear} Niat Qurban. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex justify-center md:justify-end gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
