import { Config } from '@remotion/cli/config';

Config.setPublicDir('./media');
Config.setCodec('h264');
Config.setAudioCodec('aac');
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setCrf(18);
Config.setConcurrency(2);
Config.setVideoImageFormat('png');
