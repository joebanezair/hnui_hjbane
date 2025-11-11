export type SiteConfig = {
  name: string;
  description: string;
  navItems: { label: string; href: string }[];
  navMenuItems: { label: string; href: string }[];
  links: {
    github: string;
    twitter: string;
    docs: string; 
    discord: string;
    sponsor: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "App",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" }
  ],
  navMenuItems: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Login", href: "/" },
    { label: "Sign Up", href: "/signup" },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev"
  }
};
