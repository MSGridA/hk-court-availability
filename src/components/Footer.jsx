export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-[1900px] px-4 py-6 text-xs text-stone-500 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p>
              HK Court Availability is an independent availability viewer for LCSD / SmartPLAY court data.
            </p>
            <p className="mt-1">
              Always confirm and complete booking on the official SmartPLAY website.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
              href="https://www.smartplay.lcsd.gov.hk/website/en/"
              target="_blank"
              rel="noreferrer"
            >
              Official SmartPLAY
            </a>

            <a
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
              href="https://github.com/MSGridA/hk-court-availability"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
              href="https://hk-court-proxy.vmflux-hk.workers.dev/health"
              target="_blank"
              rel="noreferrer"
            >
              Proxy status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
