import VideoBanner from "@/components/VideoBanner";
import Section from "@/components/section";
import VideoGamesSection from "@/components/VideoGamesSection";
import FooterBanner from "@/components/footerBanner";
import {useTranslations} from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div>
      <VideoBanner titleLine1={t("bannerTitleLine1")} titleLine2={t("bannerTitleLine2")} />
      <Section
        title={t("guessWhoTitle")}
        paragraph1={t("guessWhoParagraph1")}
        paragraph2={t("guessWhoParagraph2")}
        buttonText={t("playNow")}
        secondaryButtonText={t("playIn3d")}
        buttonLink="/whoIsWho"
        imageSrc="/robotImage.png"
        imageAlt={t("sectionImageAlt")}
        imagePosition="right"
      />
      <FooterBanner />
    </div>
  );
}
