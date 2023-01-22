/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.createConstraint(
    'playlist_song_activities',
    'fk_playlist_song_activities.playlist_id.playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );

  pgm.createConstraint(
    'playlist_song_activities',
    'fk_playlist_song_activities.song_id.songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
  );

  pgm.createConstraint(
    'playlist_song_activities',
    'fk_playlist_song_activities.user_id.users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id.playlists.id');
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.song_id.songs.id');
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.user_id.users.id');
  pgm.dropTable('fk_playlist_song_activities.user_id.users.id');
};
