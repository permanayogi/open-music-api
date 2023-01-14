const routes = (handler) => [
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
