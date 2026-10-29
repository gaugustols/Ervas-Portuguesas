import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import './prepare-media.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(root, 'node_modules/@remotion/cli/remotion-cli.js');
const output = fileURLToPath(new URL('../../output/videos/', import.meta.url));
const testMedia = path.join(root, 'media/teste');
const localProps = path.join(root, 'projects/local');
mkdirSync(testMedia, { recursive: true });
const run = args => execFileSync(process.execPath, [cli, ...args], {
  cwd: root, encoding: 'utf8', timeout: 300000, maxBuffer: 8 * 1024 * 1024,
});

// Local, synthetic audio only; no recordings or external services are needed.
const rate = 48000;
const samples = rate * 2;
const wav = Buffer.alloc(44 + samples * 2);
wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36);
wav.writeUInt32LE(samples * 2, 40);
for (let i = 0; i < samples; i++) wav.writeInt16LE(Math.round(Math.sin(i * 2 * Math.PI * 440 / rate) * 2000), 44 + i * 2);
writeFileSync(path.join(testMedia, 'tom.wav'), wav);
const props = { clips: [], captions: [],
  music: 'teste/tom.wav', musicVolume: 0.3, showBrand: true };
const propsPath = path.join(localProps, 'teste.json');
writeFileSync(propsPath, JSON.stringify(props, null, 2));

const inspect = (file, width, height, seconds) => {
  const metadata = JSON.parse(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]));
  const video = metadata.streams.find(stream => stream.codec_type === 'video');
  const audio = metadata.streams.find(stream => stream.codec_type === 'audio');
  assert.equal(video.codec_name, 'h264');
  assert.equal(video.pix_fmt, 'yuv420p');
  assert.equal(video.color_space, 'bt709');
  assert.equal(video.color_range, 'tv');
  assert.equal(video.width, width); assert.equal(video.height, height);
  assert.equal(video.r_frame_rate, '30/1');
  assert.equal(Number(video.nb_frames), seconds * 30);
  assert.equal(audio.codec_name, 'aac');
  assert.ok(Math.abs(Number(metadata.format.duration) - seconds) < 0.1);
  run(['ffmpeg', '-v', 'error', '-xerror', '-i', file, '-c:v', 'rawvideo', '-c:a', 'pcm_s16le', '-f', 'null', '-']);
  return { file, width, height, fps: 30, duration: Number(metadata.format.duration), video: video.codec_name, audio: audio.codec_name, bytes: Number(metadata.format.size), decoded: true };
};

const results = [];
for (const [id, name, width, height] of [
  ['BoticaVivaQuadrado', 'quadrado', 1080, 1080],
  ['BoticaVivaVertical', 'vertical', 1080, 1920],
  ['BoticaVivaHorizontal', 'horizontal', 1920, 1080],
]) {
  console.log('A exportar teste: ' + id);
  const file = path.join(output, 'teste-' + name + '.mp4');
  run(['render', 'src/index.ts', id, file, '--props=' + propsPath, '--log=error']);
  results.push(inspect(file, width, height, 2));
  console.log('OK: ' + name + ', H.264/AAC, 30 fps, 2 segundos.');
}

// Import an actual MP4, trim two non-adjacent passages, retain sound and overlay a caption.
copyFileSync(path.join(output, 'teste-quadrado.mp4'), path.join(testMedia, 'entrada.mp4'));
writeFileSync(propsPath, JSON.stringify({ ...props, music: null,
  clips: [0, 30].map(trimBefore => ({ src: 'teste/entrada.mp4', trimBefore, durationInFrames: 15, volume: 1, fit: 'contain' })),
  captions: [{ start: 0, end: 30, text: 'Teste de corte, som e legenda' }],
}, null, 2));
const edited = path.join(output, 'teste-edicao.mp4');
run(['render', 'src/index.ts', 'BoticaVivaQuadrado', edited, '--props=' + propsPath, '--log=error']);
results.push(inspect(edited, 1080, 1080, 1));
run(['ffmpeg', '-v', 'error', '-y', '-ss', '0.5', '-i', edited, '-frames:v', '1', path.join(output, 'teste-edicao.png')]);

// Input footage, dependencies and exports must never enter the landing-page export.
const exporter = readFileSync(new URL('../../scripts/export-static.mjs', import.meta.url), 'utf8');
assert.ok(!exporter.includes('video-studio') && !exporter.includes('output/videos'));
writeFileSync(path.join(output, 'verificacao.json'), JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
console.log('PASS: 3 formatos, importação MP4, dois cortes, legenda, H.264/AAC e descodificação completa.');
