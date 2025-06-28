import {
  IconMicrophone,
  IconFileText,
  IconMessage,
  IconPhoto,
  IconEye,
  IconBolt,
  IconMessage2,
  IconRobot,
  IconCurrencyDollar,
  IconPencil,
  IconHome,
  IconHistory,
  IconLayoutDashboard,
  IconBook,
} from "@tabler/icons-react";

type NavLink = {
  href: string;
  label: string;
  icon: any;
  isExternal?: boolean;
  isNew?: boolean;
  isUpdated?: boolean;
};

export const freeTools = [
  {
    href: "https://anotherwrapper.com/open-deep-research",
    label: "Open Deep Research",
    icon: IconBook,
  },
  {
    href: "https://anotherwrapper.com/tools/llm-pricing",
    label: "LLM Pricing Comparison",
    icon: IconCurrencyDollar,
  },
  {
    href: "https://anotherwrapper.com/tools/ai-app-generator",
    label: "AI App Generator",
    icon: IconRobot,
  },
];

export const overviewLinks: NavLink[] = [
  { href: "/apps", label: "Overview", icon: IconLayoutDashboard },
  {
    href: "https://anotherwrapper.lemonsqueezy.com/affiliates",
    isExternal: true,
    label: "Affiliates (50%)",
    icon: IconCurrencyDollar,
  },
];

export const navlinks: NavLink[] = [
  {
    href: "/apps/image-ai",
    label: "Image AI",
    icon: IconPhoto,
    isNew: false,
  },
];

export const landingPages = [
  {
    href: "/landing-pages/sdxl",
    label: "Stable Diffusion XL",
    icon: IconPhoto,
  },
];

export const otherLinks = [
  { href: "/", label: "Home", icon: IconHome },
  {
    href: "https://docs.anotherwrapper.com",
    label: "Documentation",
    icon: IconFileText,
  },
  {
    href: "https://anotherwrapper.lemonsqueezy.com/affiliates",
    label: "Affiliates Program",
    icon: IconCurrencyDollar,
  },
  {
    href: "https://anotherwrapper.com/blog",
    label: "Blog",
    icon: IconPencil,
  },
];
