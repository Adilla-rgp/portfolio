import { LocalClock } from "@/components/layout/LocalClock";
import { Marquee } from "@/components/ui/Marquee";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";
import { site } from "@/content/site";
import { getDeployId } from "@/lib/deploy";

const { status } = homeContent;

export function StatusMarquee() {
  return (
    <Marquee
      aria-label={status.ariaLabel}
      className="border-t border-line bg-bg"
      itemClassName="py-3.5"
    >
      <Text as="span" size="mono">
        {status.clockLabel}{" "}
        <LocalClock
          timeZone={site.timeZone}
          locale={site.locale}
          fallback={status.clockFallback}
        />
      </Text>
      {status.items(getDeployId(status.deployFallback)).map((item) => (
        <Text key={item} as="span" size="mono">
          {item}
        </Text>
      ))}
    </Marquee>
  );
}
