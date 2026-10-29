import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { EditProps } from './schema';

export const Edit = ({ clips, captions, music, musicVolume, showBrand }: EditProps) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  let cursor = 0;
  const caption = captions.find(item => frame >= item.start && frame < item.end);
  return <AbsoluteFill style={{ background: '#080a09', color: '#f7faf8', fontFamily: 'Botica Jakarta, sans-serif' }}>
    {clips.map((clip, index) => {
      const from = cursor;
      cursor += clip.durationInFrames;
      return <Sequence key={index} from={from} durationInFrames={clip.durationInFrames}>
        <OffthreadVideo src={staticFile(clip.src)} trimBefore={clip.trimBefore} volume={clip.volume}
          style={{ width: '100%', height: '100%', objectFit: clip.fit }} />
      </Sequence>;
    })}
    {!clips.length && <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 24,
      opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' }),
      background: 'radial-gradient(ellipse at 50% 85%, #14251a, #080a09 70%)' }}>
      <div style={{ color: '#79d598', fontSize: 24, letterSpacing: 4 }}>TESTE TÉCNICO</div>
      <div style={{ fontSize: Math.min(width * 0.08, 100), fontWeight: 600 }}>Botica Viva</div>
      <div style={{ color: '#b8c4bb', fontSize: 28 }}>Edição e exportação de vídeo</div>
    </AbsoluteFill>}
    {showBrand && <div style={{ position: 'absolute', top: 56, left: 60, right: 60, paddingBottom: 24,
      borderBottom: '1px solid #32543d', display: 'flex', gap: 18, alignItems: 'center', fontSize: 30, fontWeight: 600 }}>
      <svg width="32" height="36" viewBox="0 0 32 36" fill="none" stroke="#79d598" strokeWidth="1.6"><path d="M16 32V9M16 17C7 17 4 12 4 7c8 0 12 4 12 10Zm0 8c9 0 12-5 12-10-8 0-12 4-12 10Zm0-13c0-6 3-9 7-10 1 6-1 10-7 10Z" /></svg>
      Botica Viva
    </div>}
    {caption && <div style={{ position: 'absolute', bottom: Math.round(height * 0.15), left: 70, right: 70,
      display: 'flex', justifyContent: 'center' }}><div style={{ background: '#101511ee', border: '1px solid #32543d',
        borderRadius: 22, padding: '18px 30px', fontSize: 48, fontWeight: 600, lineHeight: 1.3, textAlign: 'center', whiteSpace: 'pre-wrap' }}>{caption.text}</div></div>}
    {music && <Audio src={staticFile(music)} volume={musicVolume} loop />}
  </AbsoluteFill>;
};
