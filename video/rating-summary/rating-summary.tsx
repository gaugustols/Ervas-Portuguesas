import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RatingSummary } from "../../components/ui/rating-summary";
import type { RatingSummaryInput } from "./rating-summary.schema";

export function Component(props: RatingSummaryInput) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: props.colors.background, justifyContent: "center", padding: "6%" }}>
      <RatingSummary {...props} frame={frame} />
    </AbsoluteFill>
  );
}
