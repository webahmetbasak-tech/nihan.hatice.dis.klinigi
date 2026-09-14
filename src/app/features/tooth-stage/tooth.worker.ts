/// <reference lib="webworker" />
import { buildLayers } from './tooth-geometry';

/** Diş geometrisini ana thread dışında üretir; tamponlar kopyalanmadan (transfer) geri gönderilir. */
addEventListener('message', ({ data }: MessageEvent<{ quality: 'high' | 'low' }>) => {
  const layers = buildLayers(data.quality);
  const transfer = Object.values(layers).flatMap((m) => [m.positions.buffer, m.normals.buffer]);
  postMessage(layers, transfer);
});
