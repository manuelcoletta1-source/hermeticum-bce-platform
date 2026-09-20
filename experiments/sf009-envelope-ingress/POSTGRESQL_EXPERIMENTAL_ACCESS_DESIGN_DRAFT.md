# HBCE PostgreSQL Experimental Access Design

Status: EXPERIMENTAL DRAFT / NOT IMPLEMENTED / NOT EXECUTED

## Observed local configuration

Cluster: 15/hbce_l3_exp
Port: 5433
Databases: postgres, template0, template1
Local socket authentication: peer
Loopback TCP authentication: scram-sha-256

These observations do not establish an application login.

## Proposed isolation

Use a dedicated experimental database rather than placing
revision-test tables in the administrative postgres database.

Separate the following identities:

- Administrative role: provisioning only.
- A/B role: access restricted to the experimental database
  and the tables required for the authorized test.
- O role: diagnostic observation without revision writes.

Do not use the postgres superuser as the A/B identity.

## Authentication decision

OPEN: dedicated TCP credentials or separate Linux identities
compatible with peer authentication.

Do not store passwords, connection strings containing secrets,
or authentication tokens in the repository.

Do not change pg_hba.conf merely to make a test convenient.

## Privilege boundary

A/B must not receive SUPERUSER, CREATEDB, CREATEROLE,
BYPASSRLS or blanket access to unrelated databases.

O must not receive INSERT, UPDATE, DELETE, TRUNCATE or
schema-creation privileges on revision-test objects.

Any additional statistics-visibility privilege for O must
be justified and verified independently.

## Authorization gates

Database creation: NOT_AUTHORIZED
Role creation: NOT_AUTHORIZED
Privilege grants: NOT_AUTHORIZED
Schema migration: NOT_AUTHORIZED
P04/P05 writes: NOT_AUTHORIZED
Human acceptance: PENDING
L3 promotion: NOT_AUTHORIZED

## STEP 185: least-privilege provisioning contract

This section is design only. It does not authorize provisioning.

Proposed database: hbce_l3_test.
Proposed A/B role: hbce_l3_ab.
Proposed observer role: hbce_l3_observer.

These names are candidates, not existing PostgreSQL objects.

### Administrative boundary

The postgres superuser may provision the isolated environment
only after separate human authorization. It must not be the
runtime identity of client A, client B or observer O.

### A/B boundary

A and B use independent connections under a restricted
experimental role. The role may receive only the database,
schema and table privileges required by the authorized test.

Schema ownership, migration privileges and test-data writes
must be distinguished. Authorization to provision the
environment does not authorize running P04/P05.

### Observer boundary

O requires CONNECT and only the diagnostic visibility proven
necessary for the selected backend PIDs.

Do not grant pg_monitor or pg_read_all_stats by default.
If ordinary visibility is insufficient, stop and evaluate a
narrower mechanism before proposing any broader grant.

O must not own revision tables or receive revision-write
privileges.

### Authentication and secrets

Candidate transport: TCP 127.0.0.1:5433 with SCRAM-SHA-256.
Credentials must remain outside the repository and test logs.

No pg_hba.conf change is proposed.

### Separate human decisions

1. Approve or reject the final provisioning commands.
2. Approve or reject the isolated schema migration.
3. Approve or reject experimental P04/P05 writes.
4. Independently review the resulting evidence.

None of these decisions implies L3 promotion.

STEP_185_DESIGN_ONLY=TRUE
PROVISIONING=NOT_AUTHORIZED
SCHEMA_MIGRATION=NOT_AUTHORIZED
P04_P05=NOT_EXECUTED
HUMAN_ACCEPTANCE=PENDING
L3_PROMOTION=NOT_AUTHORIZED

## STEP 185C: provisioning decision package

Status: DESIGN ONLY / NOT AUTHORIZED / NOT EXECUTED

### Selected authentication design

Use TCP 127.0.0.1:5433 with SCRAM-SHA-256.

Use dedicated experimental credentials supplied outside the
repository. Do not print passwords, embed them in command
arguments, or persist them in evidence files.

Do not modify pg_hba.conf.

### Proposed object and privilege matrix

Administrative identity:
- Creates the dedicated database and restricted roles only
  after explicit human authorization.
- Performs any separately authorized schema migration.
- Is not used by A, B or O during the concurrency test.

Database hbce_l3_test:
- A/B: CONNECT only as needed for the experiment.
- O: CONNECT only as needed for diagnostic observation.
- No access to unrelated databases is requested.

Experimental schema:
- A/B: USAGE, not CREATE.
- O: no schema privilege unless a specific observer query
  demonstrably requires it.
- Neither A/B nor O owns the schema.

operation_coordination:
- A/B: SELECT and INSERT for the proposed coordination
  algorithm; no UPDATE, DELETE or TRUNCATE.
- O: no table access.

operation_revisions:
- A/B: SELECT and INSERT for the proposed append-only
  revision algorithm; no UPDATE, DELETE or TRUNCATE.
- O: no table access.

No A/B or O SUPERUSER, CREATEDB, CREATEROLE, BYPASSRLS,
table ownership or schema-creation privilege is proposed.

These privileges are a design target, not an applied grant.
Exact SQL and PostgreSQL default privileges require review
before any provisioning authorization.

### Observer visibility gate

First test ordinary visibility using O against independently
identified A/B backend PIDs.

Required diagnostic fields:
pid, state, wait_event_type, wait_event,
pg_blocking_pids(pid).

Do not infer sufficient visibility merely because a row
appears in pg_stat_activity. Required fields must be
observable and correctly attributable to A/B.

If ordinary visibility is insufficient, stop. Do not grant
pg_monitor or pg_read_all_stats automatically. Propose and
review a narrower observation mechanism separately.

A visibility test is not P04/P05 and does not establish
durable concurrency correctness.

### Authorization boundaries

Gate 1: review and authorize exact provisioning commands.
Gate 2: review and authorize the schema migration.
Gate 3: verify role isolation and observer visibility.
Gate 4: separately authorize P04/P05 data writes.
Gate 5: review evidence and decide human acceptance.

No gate implies permission for the next gate.

STEP_185C_DESIGN_ONLY=TRUE
OBSERVER_VISIBILITY=NOT_VERIFIED_AS_ROLE_O
PROVISIONING=NOT_AUTHORIZED
SCHEMA_MIGRATION=NOT_AUTHORIZED
P04_P05=NOT_EXECUTED
HUMAN_ACCEPTANCE=PENDING
L3_PROMOTION=NOT_AUTHORIZED

## STEP 186B: isolation scope

Status: DESIGN ONLY / NOT EXECUTED

Observed on cluster 15/hbce_l3_exp, port 5433:
- PUBLIC has CONNECT on postgres and template1.
- template0 has datallowconn=false.
- PUBLIC has USAGE but not CREATE on the public schema
  of database postgres.

Selected experimental requirement:
OBJECT_AND_OPERATION_ISOLATION.

This does not claim cluster-wide connection isolation.

A/B:
- Two independent database connections may use the same
  restricted experimental role.
- Proposed access is limited to required SELECT and INSERT
  on experimental coordination and revision tables.
- No ownership, schema CREATE, UPDATE, DELETE or TRUNCATE.
- No claim of isolation between distinct application
  identities is made.

O:
- Separate experimental role.
- No revision-table writes or ownership.
- Required backend diagnostic visibility remains unverified
  until tested under O's actual identity.

Provisioning design:
- Revoke PUBLIC CONNECT on the new experimental database
  before granting explicit CONNECT to experimental roles.
- Do not revoke PUBLIC privileges on existing databases.
- Do not change pg_hba.conf.
- Do not claim that A/B or O cannot connect to postgres
  or template1 solely because their experimental grants
  are restricted.

Residual limitation:
PUBLIC database-level CONNECT elsewhere in the cluster
is outside this experiment's isolation guarantee.
A stronger cluster-wide connection boundary would require
a separate design and authorization.

STEP_186B_DESIGN_ONLY=TRUE
ISOLATION_REQUIREMENT=OBJECT_AND_OPERATION_ISOLATION
CLUSTER_WIDE_CONNECTION_ISOLATION=NOT_CLAIMED
OBSERVER_VISIBILITY=NOT_VERIFIED_AS_ROLE_O
PROVISIONING=NOT_AUTHORIZED
SCHEMA_MIGRATION=NOT_AUTHORIZED
P04_P05=NOT_EXECUTED
L3_PROMOTION=NOT_AUTHORIZED
