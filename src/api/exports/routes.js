const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistid}',
    handler: handler.postExportPlaylistSongsHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
