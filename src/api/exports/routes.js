const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistid}',
    handler: (request, h) => handler.postExportPlaylistSongsHandler(request, h),
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
