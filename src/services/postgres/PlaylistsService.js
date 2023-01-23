const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username AS username FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(`Playlist gagal dihapus. Playlist dengan ID ${id} tidak ditemukan`);
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    console.log(playlistId);
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }

    return rows[0].id;
  }

  async verifySongId(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(`Playlist gagal ditambahkan. Lagu dengan ID ${id} tidak ditemukan`);
    }
  }

  async getPlaylistSongsById(id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username, songs.id AS song_id, songs.title, songs.performer
      FROM playlists
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    const playlistId = rows[0].id;

    if (!rowCount) {
      throw new NotFoundError(`Playlist dengan ID ${playlistId} tidak ditemukan`);
    }

    return rows;
  }

  async deletePlaylistSongById({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2',
      values: [songId, playlistId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(`Lagu gagal dihapus. Lagu dengan ID ${songId} tidak ditemukan`);
    }
  }
}

module.exports = PlaylistsService;
