'use strict';

const { Client } = require('pg');

const OBSERVATION_SQL = [
  'SELECT',
  '  pid,',
  '  state,',
  '  wait_event_type,',
  '  wait_event,',
  '  pg_blocking_pids(pid) AS blocking_pids',
  'FROM pg_catalog.pg_stat_activity',
  'WHERE pid = $1'
].join('\n');

function validatePid(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) {
    throw new TypeError('PID must be a positive safe integer');
  }
  return pid;
}

async function observeContention(
  connectionConfig,
  targetPid,
  clientFactory = config => new Client(config)
) {
  validatePid(targetPid);

  if (!connectionConfig ||
      typeof connectionConfig !== 'object' ||
      Array.isArray(connectionConfig)) {
    throw new TypeError('Explicit connection configuration required');
  }

  if (typeof clientFactory !== 'function') {
    throw new TypeError('Client factory must be a function');
  }

  const client = clientFactory(connectionConfig);
  let primaryError;

  try {
    await client.connect();

    const result = await client.query({
      text: OBSERVATION_SQL,
      values: [targetPid]
    });

    if (result.rows.length !== 1) {
      return {
        status: 'INCONCLUSIVE',
        reason: 'TARGET_PID_NOT_VISIBLE',
        targetPid
      };
    }

    const row = result.rows[0];

    if (
      row.pid !== targetPid ||
      typeof row.state !== 'string' ||
      row.state.length === 0 ||
      !Array.isArray(row.blocking_pids) ||
      !row.blocking_pids.every(
        pid => Number.isSafeInteger(pid) && pid > 0
      )
    ) {
      return {
        status: 'INCONCLUSIVE',
        reason: 'OBSERVATION_NOT_FULLY_VISIBLE',
        targetPid
      };
    }

    return {
      status: 'OBSERVED',
      targetPid,
      state: row.state,
      waitEventType: row.wait_event_type,
      waitEvent: row.wait_event,
      blockingPids: row.blocking_pids
    };
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    try {
      await client.end();
    } catch (closeError) {
      if (!primaryError) throw closeError;
    }
  }
}

module.exports = {
  OBSERVATION_SQL,
  validatePid,
  observeContention
};
