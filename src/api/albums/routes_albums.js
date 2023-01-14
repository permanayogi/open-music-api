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
];

module.exports = routes;
