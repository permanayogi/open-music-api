const routes = (handler) => [
  // routes for album
  {
    // add albums data
    method: 'POST',
    path: '/albums',
    handler: '',
  },
  {
    // get albums data by id
    method: 'GET',
    path: '/albums/{id}',
    handler: '',
  },
  {
    // edit albums data by id
    method: 'PUT',
    path: '/albums/{id}',
    handler: '',
  },
  {
    // delete albums data by id
    method: 'DELETE',
    path: '/albums{id}',
    handler: '',
  },

  // routes for song
  {
    // add songs data
    method: 'POST',
    path: '/songs',
    handler: '',
  },
  {
    // get all songs data
    method: 'GET',
    path: '/songs',
    handler: '',
  },
  {
    // get songs data by id
    method: 'GET',
    path: '/songs/{id}',
    handler: '',
  },
  {
    // edit songs data by id
    method: 'PUT',
    path: '/songs/{id}',
    handler: '',
  },
  {
    // delete songs data by id
    method: 'DELETE',
    path: '/songs/{id}',
    handler: '',
  },
];

module.exports = routes;
