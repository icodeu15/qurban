export const categoryOptions = ["KAMBING", "SAPI", "KERBAU", "AQIQAH"] as const;
export type CategoryOption = (typeof categoryOptions)[number];

export type ProductRecord = {
  id: string;
  name: string;
  category: CategoryOption;
  price: number | null;
  label: string | null;
  image: string | null;
  externalUrl: string | null;
  isActive: boolean;
  description: string | null;
  sortOrder: number;
};

export type BannerRecord = {
  id: string;
  name: string;
  category: CategoryOption | null;
  price: number | null;
  label: string | null;
  image: string | null;
  externalUrl: string | null;
  isActive: boolean;
  headline: string | null;
  subheadline: string | null;
};

export type PublicBannerRecord = BannerRecord;

export type SectionRecord = {
  id: string;
  name: string;
  category: CategoryOption | null;
  price: number | null;
  label: string | null;
  image: string | null;
  externalUrl: string | null;
  isActive: boolean;
  title: string | null;
  content: string | null;
  kind: string;
  sortOrder: number;
};
