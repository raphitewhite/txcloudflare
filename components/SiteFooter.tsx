const footerColumns = [
  {
    title: "Meta technologies",
    links: ["Facebook", "Instagram", "Messenger", "WhatsApp", "Meta Quest", "Workplace"],
  },
  {
    title: "Tools",
    links: ["Ads Manager", "Meta Business Suite", "Commerce Manager", "Events Manager", "Payments Hub"],
  },
  {
    title: "Goals",
    links: ["Convert leads", "Grow online sales", "Drive in-store sales", "Brand awareness"],
  },
  {
    title: "Business types",
    links: ["Small business", "Enterprise", "Creators", "Developers"],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-slate-400 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-white">{column.title}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <a className="hover:text-white" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Meta.</p>
          <div className="flex gap-4">
            {["About", "Careers", "Privacy", "Terms", "Cookie policy"].map((item) => (
              <a key={item} href="#" className="hover:text-white">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
