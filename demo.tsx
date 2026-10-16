// Built with Remotion - https://remotion.pro/license
import { Composition } from "remotion";
import { Component } from "./video/hook-question/hook-question";
import { schema, defaults } from "./video/hook-question/hook-question.schema";
import { Component as RatingSummaryScene } from "./video/rating-summary/rating-summary";
import { schema as ratingSchema, defaults as ratingDefaults } from "./video/rating-summary/rating-summary.schema";
import "./assets/nova-pagina/css/fonts.css";
import "./assets/nova-pagina/css/hook-question.css";
import "./assets/nova-pagina/css/rating-summary.css";

export const HookQuestionComposition = () => (
  <Composition
    id="hook-question"
    component={Component}
    schema={schema}
    defaultProps={defaults}
    durationInFrames={105}
    fps={30}
    width={1920}
    height={1080}
  />
);

export const StarRatingSummaryComposition = () => (
  <Composition
    id="rating-summary"
    component={RatingSummaryScene}
    schema={ratingSchema}
    defaultProps={ratingDefaults}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
);
