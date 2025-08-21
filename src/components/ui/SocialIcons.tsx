import React from "react";
import { siteConfig } from "@/config/site";
import { FacebookIcon,InstagramIcon,TikTokIcon,XIcon, YoutubeIcon } from "@/components/ui/SocialBrandIcons";

interface SocialIconsProps {
  className?: string;
  iconClassName?: string;
}

const SocialIcons: React.FC<SocialIconsProps> = ({ 
  className = "flex gap-4", 
  iconClassName = "h-6 w-6" 
}) => {
  const ICONS: Record<string, (cls: string) => React.ReactNode> = {
    instagram: (cls) => <InstagramIcon cls={cls} />,
    youtube: (cls) => <YoutubeIcon cls={cls} />,
    facebook: (cls) => <FacebookIcon cls={cls} />,
    x: (cls) => <XIcon cls={cls} />,
    tiktok: (cls) => <TikTokIcon cls={cls} />,
  };

  return (
    <div className={className}>
      {Object.entries(siteConfig.social).map(([key, info]) => {
        const render = ICONS[key];
        if (!render) return null;
        return (
          <a
            key={key}
            href={info.url}
            aria-label={info.label}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400 transition text-blue-800"
          >
            {render(iconClassName)}
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons; 