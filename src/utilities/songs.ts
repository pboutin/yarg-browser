export const getSongAlbumImageUrl = (songId: string): string => {
  return `/api/songs/${songId}/album-image`;
};
