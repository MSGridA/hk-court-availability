export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-[1900px] px-4 py-6 text-xs text-stone-500 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            HK Court Availability is an independent availability viewer for LCSD / SmartPLAY court data.
          </p>

          <p>
            Always confirm and complete booking on the official SmartPLAY website.
          </p>
        </div>
      </div>
    </footer>
  );
}
