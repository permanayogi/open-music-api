class ExportsHandler {
  constructor(service, validator, playlistService) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);
    const { playlistid } = request.params;
    await this._playlistService.getPlaylistsById(playlistid);
    await this._playlistService.verifyPlaylistOwner(playlistid, request.auth.credentials.id);
    const message = {
      playlistId: playlistid,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage(
      'export:playlistsongs',
      JSON.stringify(message),
    );
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
