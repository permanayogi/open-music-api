const routes = (handler) => [
  // routes for album
  {
    // add albums data
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    // get albums data by id
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbumById(request, h),
  },
  {
    // edit albums data by id
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.putAlbumByIdHandler(request, h),
  },
  {
    // delete albums data by id
    method: 'DELETE',
    path: '/albums{id}',
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
  },

  // routes for song
  {
    // add songs data
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postSongHandler(request, h),
  },
  {
    // get all songs data
    method: 'GET',
    path: '/songs',
    handler: () => handler.getSongsHandler(),
  },
  {
    // get songs data by id
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getSongByIdHandler(request, h),
  },
  {
    // edit songs data by id
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.putSongByIdHandler(request, h),
  },
  {
    // delete songs data by id
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSongByIdHandler(request, h),
  },
];

module.exports = routes;
