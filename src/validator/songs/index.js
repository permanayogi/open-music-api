const InvariantError = require('../../exceptions/InvariantError');
const { SongsPayloadSchema } = require('./schema');

const SongsValidatior = {
  validateSongPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidatior;
