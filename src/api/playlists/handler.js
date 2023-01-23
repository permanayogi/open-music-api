class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    await this._service.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._service.verifySongId(songId);
    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    await this._service.addPlaylistSong({ playlistId, songId });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });

    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    const playlistSongs = await this._service.getPlaylistSongsById(playlistId);
    return {
      status: 'success',
      data: {
        playlist: {
          id: playlistSongs[0].id,
          name: playlistSongs[0].name,
          username: playlistSongs[0].username,
          songs: !playlistSongs[0].song_id ? [] : playlistSongs.map((songData) => ({
            id: songData.song_id,
            title: songData.title,
            performer: songData.performer,
          })),
        },
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistSongById({ playlistId, songId });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
