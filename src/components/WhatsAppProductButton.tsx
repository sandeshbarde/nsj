type WhatsAppProductButtonProps = {
  productName: string;
  price?: number;
  productUrl?: string;
};

const WHATSAPP_NUMBER = "917373262607";

export default function WhatsAppProductButton({
  productName,
  price,
  productUrl,
}: WhatsAppProductButtonProps) {
  const handleWhatsApp = () => {
    const priceText =
      typeof price === "number"
        ? `Price: ₹${price.toLocaleString("en-IN")}`
        : "";

    const message = [
      "Hello NSJ Jewellery! 👋",
      "",
      `I am interested in: ${productName}`,
      priceText,
      productUrl ? `Product link: ${productUrl}` : "",
      "",
      "Please share more details.",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <button
      type="button"
      onClick={handleWhatsApp}
      className="flex w-full items-center justify-center gap-2.5 border border-[#25D366] bg-[#25D366]/10 px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase text-[#1a9e4e] transition-all duration-200 hover:bg-[#25D366] hover:text-white"
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-4 w-4 fill-current"
        aria-hidden="true"
      >
        <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.47.658 4.788 1.807 6.794L2 30l7.394-1.78A13.94 13.94 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm7.226 19.47c-.304.853-1.783 1.63-2.438 1.73-.656.101-1.478.142-2.384-.15-.55-.18-1.258-.42-2.16-.822-3.801-1.641-6.285-5.497-6.478-5.75-.193-.254-1.574-2.094-1.574-3.994s.997-2.837 1.35-3.225c.354-.388.77-.485 1.026-.485.257 0 .514.002.738.014.237.013.554-.09.868.66.322.77 1.094 2.67 1.191 2.864.097.193.161.42.032.676-.128.257-.193.418-.386.645-.193.226-.405.504-.578.676-.193.193-.393.401-.169.787.225.387.997 1.643 2.14 2.66 1.47 1.307 2.71 1.713 3.1 1.906.387.194.612.162.837-.097.225-.257.965-1.126 1.222-1.513.257-.387.514-.322.87-.193.355.13 2.254 1.063 2.64 1.257.388.193.645.29.74.45.097.16.097.93-.207 1.783z" />
      </svg>
      Order on WhatsApp
    </button>
  );
}
