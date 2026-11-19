export type LocaleCode = "en" | "hi" | "ma";

export type UserRole =
  | "customer"
  | "super_admin"
  | "store_manager"
  | "support"
  | "content_editor"
  | "farm_manager"
  | "finance_manager";

export interface ProductVariantDTO {
  id: string;
  sku: string;
  label: string;
  priceInr: number;
  stockQty: number;
  isDefault: boolean;
}

export interface ProductDTO {
  id: string;
  slug: string;
  nameEn: string;
  nameHi?: string | null;
  nameMa?: string | null;
  descriptionEn: string;
  sourcingInfo?: string | null;
  productionMethod?: string | null;
  storageInstructions?: string | null;
  variants: ProductVariantDTO[];
}

export interface CowProfileDTO {
  id: string;
  slug: string;
  name: string;
  breed: string;
  story: string;
  sponsorshipAvailable: boolean;
  monthlyAmountInr?: number | null;
}

export interface BhungaStayDTO {
  id: string;
  slug: string;
  title: string;
  nightlyRateInr: number;
  maxGuests: number;
  description: string;
}
