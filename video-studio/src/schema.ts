import { z } from 'zod';

// Media stays local to this workstation. Paths are relative to media/.
const mediaPath = z.string().min(1).refine(
  value => !/^[a-z]+:|^[\\/]|[?#]/i.test(value) && !value.split(/[\\/]/).includes('..'),
  'Utiliza um caminho local relativo à pasta media/.',
);

export const editSchema = z.object({
  clips: z.array(z.object({
    src: mediaPath,
    trimBefore: z.number().int().min(0),
    durationInFrames: z.number().int().min(1),
    volume: z.number().min(0).max(1),
    fit: z.enum(['contain', 'cover']),
  })),
  captions: z.array(z.object({
    start: z.number().int().min(0),
    end: z.number().int().min(1),
    text: z.string().min(1),
  }).refine(caption => caption.end > caption.start, 'Fim da legenda deve ser posterior ao início.')),
  music: mediaPath.nullable(),
  musicVolume: z.number().min(0).max(1),
  showBrand: z.boolean(),
});

export type EditProps = z.infer<typeof editSchema>;
export const defaults: EditProps = {
  clips: [], captions: [], music: null, musicVolume: 0.15, showBrand: true,
};

export const getDuration = (props: EditProps) =>
  props.clips.length ? props.clips.reduce((total, clip) => total + clip.durationInFrames, 0) : 60;
