export interface PaymentSettings {
  upiId: string;
  upiName: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: string;
  whatsappNumber: string;
}

export const PAYMENT_CONFIG: PaymentSettings = {
  upiId: "7373262607@okbizaxis",
  upiName: "NSJ Jewellery",
  bankName: "State Bank of India (SBI)",
  accountHolder: "NSJ Jewellery (Sandesh Barde)",
  accountNumber: "41982345091",
  ifscCode: "SBIN0001234",
  branch: "Main Branch",
  accountType: "Current / Savings Account",
  whatsappNumber: "917373262607",
};

/** Generates standard UPI payment URI */
export function getUpiUri(amount: number, orderId: string, note = "NSJ Jewellery Order"): string {
  const upiId = PAYMENT_CONFIG.upiId;
  const name = PAYMENT_CONFIG.upiName;
  const cleanNote = `${note} ${orderId}`.trim();
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
}

/** Generates dynamic QR code image URL */
export function getUpiQrCodeUrl(amount: number, orderId: string): string {
  const uri = getUpiUri(amount, orderId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(uri)}`;
}
