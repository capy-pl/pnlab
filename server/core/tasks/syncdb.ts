import { Logger } from '../util';
import MigrationModel from '../../models/Migration';
import migrations from '../../migrations';
import Migration from '../../models/Migration';

export async function syncdb() {
  Logger.info('Start synchronizing database.');
  let latestVersion = 0;
  let migrationsAppliedNum = 0;
  try {
    const latestMigration = await MigrationModel.findOne().sort({
      applyDate: -1,
    });
    if (latestMigration) {
      latestVersion = latestMigration.version;
    }
  } catch (err) {
    Logger.info('No migration applied.');
    const initMigration = new MigrationModel({
      version: 0,
      applyStatus: 'success',
      applyDate: new Date(),
    });
    await initMigration.save();
  }
  for (const migration of migrations) {
    if (migration.version > latestVersion) {
      try {
        await migration.apply();
        const migrationRecord = new Migration({
          version: migration.version,
          applyStatus: 'success',
          applyDate: new Date(),
        });
        await migrationRecord.save();
        latestVersion = migration.version;
        migrationsAppliedNum += 1;
      } catch (err) {
        Logger.error(err);
        Logger.error('Migration failed. Process exited.');
        process.exit(1);
      }
    }
  }
  if (migrationsAppliedNum) {
    Logger.info(`There are ${migrationsAppliedNum} migrations applied.`);
  } else {
    Logger.info('No migrations availabe since last update.');
  }
  Logger.info('Finish synchronizing database.');
}
