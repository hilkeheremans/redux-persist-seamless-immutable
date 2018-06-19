const Immutable = require('seamless-immutable');
const isImmutable = a => Immutable.isImmutable(a);
const toImmutable = a => Immutable(a);

module.exports = {
    isImmutable,
    toImmutable
};
