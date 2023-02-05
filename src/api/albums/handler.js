/* eslint-disable radix */
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album: {
          id: album[0].id,
          name: album[0].name,
          year: album[0].year,
          coverUrl: album[0].cover,
          songs: !album[0].song_id ? [] : album.map((albumData) => ({
            id: albumData.song_id,
            title: albumData.name,
            performer: albumData.year,
          })),
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const albumLike = await this._service.addLikeOrDislikeAlbumById(credentialId, id);
    const response = h.response({
      status: 'success',
      message: albumLike,
    });
    response.code(201);
    return response;
  }

  async getLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { result, header } = await this._service.getAlbumLike(id);
    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(result),
      },
    });
    response.header('X-Data-Source', header);
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
