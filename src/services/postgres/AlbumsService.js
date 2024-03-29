/* eslint-disable radix */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cachceService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Album gagal ditambahlan');
    }

    return rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT albums.id, albums.name, albums.year, albums.cover, songs.id AS song_id, songs.title, songs.performer
      FROM albums 
      LEFT JOIN songs ON songs.album_id = albums.id 
      WHERE albums.id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return rows;
  }

  async updateAlbumCover(id, url) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [url, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addLikeOrDislikeAlbumById(userId, albumId) {
    const id = nanoid(16);
    let message;
    await this.getAlbumById(albumId);
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const check = await this._pool.query(query);

    if (check.rowCount === 0) {
      const insert = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)',
        values: [id, userId, albumId],
      };
      this._pool.query(insert);
      message = 'Berhasil like album';
      await this._cachceService.delete(`albumlike:${albumId}`);
    } else {
      const _delete = {
        text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
        values: [userId, albumId],
      };
      this._pool.query(_delete);
      message = 'Berhasil dislike album';
      await this._cachceService.delete(`albumlike:${albumId}`);
    }
    return message;
  }

  async getAlbumLike(albumId) {
    try {
      const likeCache = await this._cachceService.get(`albumlike:${albumId}`);
      const result = JSON.parse(likeCache);
      const header = 'cache';
      return { result, header };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const { rows } = await this._pool.query(query);
      const result = rows[0].count;
      await this._cachceService.set(`albumlike:${albumId}`, JSON.stringify(parseInt(result)));
      const header = 'db';
      return { result, header };
    }
  }
}

module.exports = AlbumsService;
