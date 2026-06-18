import * as migration_20260618_060013 from './20260618_060013';

export const migrations = [
  {
    up: migration_20260618_060013.up,
    down: migration_20260618_060013.down,
    name: '20260618_060013'
  },
];
