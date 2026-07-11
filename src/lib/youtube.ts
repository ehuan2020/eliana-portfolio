const YOUTUBE_URL_PATTERN = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/

export function getYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_URL_PATTERN)
  return match ? match[1] : null
}

export function getYouTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
}

export function getYouTubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}`
}
