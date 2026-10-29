import { Composition } from 'remotion';
import { Edit } from './edit';
import { defaults, editSchema, getDuration } from './schema';
import './style.css';

export const Root = () => <>
  {[
    { id: 'BoticaVivaVertical', width: 1080, height: 1920 },
    { id: 'BoticaVivaQuadrado', width: 1080, height: 1080 },
    { id: 'BoticaVivaHorizontal', width: 1920, height: 1080 },
  ].map(format => <Composition
    key={format.id} {...format} component={Edit} schema={editSchema}
    fps={30} durationInFrames={60} defaultProps={defaults}
    calculateMetadata={({ props }) => {
      const validated = editSchema.parse(props);
      return { durationInFrames: getDuration(validated), props: validated };
    }}
  />)}
</>;
