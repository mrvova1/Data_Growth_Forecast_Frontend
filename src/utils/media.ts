export const DEFAULT_IMAGE = '/assets/default-service-image.png';
export const DEFAULT_VIDEO = '/assets/default-service-video.mp4';

export function getImageSource(source?: string | null): string {
  return source?.trim() ? source : DEFAULT_IMAGE;
}

export function getVideoSource(source?: string | null): string {
  return source?.trim() ? source : DEFAULT_VIDEO;
}
