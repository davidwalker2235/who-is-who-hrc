"use client";

import { useTranslations } from "next-intl";
import {trackOutboundLink} from "@/lib/analytics";

const ERNI_BOTS_URL = "https://ernibots-v2.azurewebsites.net/";
const FIRE_OR_FIRED_URL =
  "https://play.unity.com/api/v1/games/game/ecd2d1e3-a1a0-4df1-88c0-c4266874770a/build/latest/frame";

function GameCard({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonText,
  buttonHref,
  analyticsId,
}: {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  analyticsId: string;
}) {
  return (
    <article className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden rounded-lg bg-[#F5F7F8] md:flex-row">
      <div className="flex min-h-[220px] w-full shrink-0 items-center justify-center p-4 md:h-full md:min-h-0 md:w-1/2 md:max-h-none md:p-6">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-auto max-h-[min(48vh,420px)] w-full object-contain object-center md:max-h-full"
        />
      </div>
      <div
        className="flex w-full flex-col justify-between gap-10 px-8 py-10 text-left md:h-full md:w-1/2"
        style={{ fontFamily: "var(--font-source-sans-pro), sans-serif" }}
      >
        <div className="space-y-4">
          <h3 className="text-2xl md:text-[1.65rem] font-semibold text-[#033778] leading-tight text-left">
            {title}
          </h3>
          <p className="text-[#333333] text-base md:text-lg leading-relaxed text-left">
            {description}
          </p>
        </div>
        <div className="flex justify-start">
          <a
            href={buttonHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void trackOutboundLink(analyticsId, buttonHref, {
              surface: 'video_games_section',
              button_text: buttonText,
              game_title: title
            })}
            className="inline-flex items-center justify-center gap-2 bg-[#033778] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#022a5e] transition-colors duration-300"
            style={{ fontFamily: "var(--font-source-sans-pro), sans-serif" }}
          >
            {buttonText}
            <span aria-hidden className="text-white">
              →
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function VideoGamesSection() {
  const t = useTranslations("home");

  return (
    <section
      className="w-full py-16 px-6 md:px-12 bg-white"
      aria-labelledby="video-games-heading"
    >
      <div className="w-full max-w-[1920px] mx-auto">
        <h2
          id="video-games-heading"
          className="text-4xl md:text-5xl font-semibold text-[#033778] leading-tight text-left mb-10 md:mb-12"
          style={{
            fontFamily: "var(--font-source-sans-pro), sans-serif",
            fontWeight: 600,
          }}
        >
          {t("videoGamesSectionTitle")}
        </h2>
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <GameCard
            imageSrc="/erni-bots-image.png"
            imageAlt={t("videoGamesEerniImageAlt")}
            title={t("videoGamesEerniTitle")}
            description={t("videoGamesEerniDescription")}
            buttonText={t("videoGamesEerniCta")}
            buttonHref={ERNI_BOTS_URL}
            analyticsId="button.video-games.erni-bots"
          />
          <GameCard
            imageSrc="/fire-or-fired-image.jpeg"
            imageAlt={t("videoGamesFireImageAlt")}
            title={t("videoGamesFireTitle")}
            description={t("videoGamesFireDescription")}
            buttonText={t("videoGamesFireCta")}
            buttonHref={FIRE_OR_FIRED_URL}
            analyticsId="button.video-games.fire-or-fired"
          />
        </div>
      </div>
    </section>
  );
}
