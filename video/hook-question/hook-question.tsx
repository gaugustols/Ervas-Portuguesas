import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HookQuestion } from "../../components/ui/hook-question";
import type { HookQuestionInput } from "./hook-question.schema";

export function Component(props: HookQuestionInput) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: props.colors.background, justifyContent: "center", padding: "8%" }}>
      <HookQuestion {...props} frame={frame} />
    </AbsoluteFill>
  );
}
