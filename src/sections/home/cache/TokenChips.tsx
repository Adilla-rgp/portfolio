import { Tag } from "@/components/ui/Tag";
import { cacheContent } from "@/content/cache";

interface TokenChipsProps {
  tokens: readonly string[];
  /** Tokens present in both messages. */
  shared: ReadonlySet<string>;
  /** Names the list for screen readers, e.g. the field label. */
  label: string;
}

export function TokenChips({ tokens, shared, label }: TokenChipsProps) {
  if (tokens.length === 0) return null;

  return (
    <ul aria-label={cacheContent.tokensLabel(label)} className="flex flex-wrap gap-1.5">
      {tokens.map((token) => {
        const isShared = shared.has(token);
        return (
          <li key={token}>
            <Tag tone={isShared ? "signal" : "quiet"} className="normal-case">
              {token}
              {isShared && <span className="sr-only"> ({cacheContent.sharedHint})</span>}
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}
