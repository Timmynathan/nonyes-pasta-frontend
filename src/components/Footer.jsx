const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Nonye's Pasta! I have an enquiry.")}`;

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-red text-white py-16 mt-24">
      <div className="max-w-6xl mx-auto px-4">

        {/* Top: logo + tagline */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-10 border-b border-white/20">
          <div>
            <img src="/logo.png" alt="Nonye's Pasta" className="h-20 w-auto object-contain mb-3" />
            <p className="text-white/70 italic text-sm">Love at first bite.</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-brand-red font-bold px-6 py-3 rounded-full hover:bg-white/90 transition text-sm w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Contact details */}
        <div className="grid md:grid-cols-3 gap-8 mb-10 text-sm">
          <div>
            <h4 className="font-bold text-base mb-3 uppercase tracking-wide">Contact Us</h4>
            <p className="text-white/80 mb-1">📍 Lagos, Nigeria</p>
            <p className="text-white/80 mb-1">📞 0812 541 1593</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white"
            >
              💬 WhatsApp us
            </a>
          </div>
          <div>
            <h4 className="font-bold text-base mb-3 uppercase tracking-wide">Order Info</h4>
            <p className="text-white/80 mb-1">📅 Preorders open Thursday for Saturday</p>
            <p className="text-white/80 mb-1">📅 Preorders open Friday for Sunday</p>
            <p className="text-white/80 mt-2">All dishes are freshly made to order.</p>
          </div>
          <div>
            <h4 className="font-bold text-base mb-3 uppercase tracking-wide">Follow Us</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.tiktok.com/@nonyes.pasta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/>
                </svg>
                TikTok
              </a>
              <a
                href="https://snapchat.com/t/UwHKyAdj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.006 2c-1.438 0-4.064.398-5.57 2.883-.602 1.003-.73 2.164-.66 3.146-.303.148-.617.228-.93.228-.42 0-.79-.14-1.05-.23l-.06-.02c-.09-.03-.17-.05-.26-.05-.22 0-.63.1-.68.56-.04.38.19.7.68.93.06.03.49.21.9.35.1.03.17.07.22.1-.08.2-.22.46-.49.72-.44.42-1.02.66-1.56.66-.1 0-.2-.01-.28-.03l-.06-.01c-.1-.02-.22-.03-.34-.03-.67 0-1.21.35-1.21.78 0 .32.27.6.76.77.07.02.14.05.23.07.6.19 1.6.38 2.16 1.23.03.04.05.09.08.14.11.22.12.43.04.58-.2.37-.9.56-1.36.67-.17.04-.32.08-.43.12-.5.18-.77.44-.76.74.01.37.44.65 1.13.73.16.02.27.14.32.35.07.3.28.52.57.6.22.06.47.04.73-.06.34-.13.68-.19 1.03-.19.22 0 .44.03.65.08.47.12.88.4 1.3.69.8.57 1.7 1.21 3.16 1.21 1.47 0 2.37-.64 3.17-1.21.42-.3.82-.57 1.29-.69.21-.05.43-.08.65-.08.35 0 .7.06 1.02.19.26.1.51.12.73.06.29-.08.5-.3.57-.6.05-.21.16-.33.32-.35.69-.08 1.12-.36 1.13-.73.01-.3-.26-.56-.76-.74-.11-.04-.26-.08-.43-.12-.46-.11-1.16-.3-1.36-.67-.08-.15-.07-.36.04-.58.03-.05.05-.1.08-.14.56-.85 1.56-1.04 2.16-1.23.09-.02.16-.05.23-.07.49-.17.76-.45.76-.77 0-.43-.54-.78-1.21-.78-.12 0-.24.01-.34.03l-.06.01c-.08.02-.18.03-.28.03-.54 0-1.12-.24-1.56-.66-.27-.26-.41-.52-.49-.72.05-.03.12-.07.22-.1.41-.14.84-.32.9-.35.49-.23.72-.55.68-.93-.05-.46-.46-.56-.68-.56-.09 0-.17.02-.26.05l-.06.02c-.26.09-.63.23-1.05.23-.31 0-.63-.08-.93-.22.07-.99-.07-2.17-.68-3.17C16.07 2.398 13.444 2 12.006 2z"/>
                </svg>
                Snapchat
              </a>
            </div>
            <p className="text-white/70 text-xs mt-3">
              For catering services and large orders, reach us on WhatsApp.
            </p>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs border-t border-white/20 pt-6">
          &copy; {new Date().getFullYear()} Nonye's Pasta. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
