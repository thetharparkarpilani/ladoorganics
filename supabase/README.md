# Supabase migration baseline and safe adoption

## Current state

The production project already contains application tables and has been repaired using the forward-only schema repair script supplied during this work. The historical SQL files are under `db/migrations/`; Supabase CLI does **not** automatically treat that directory as its migration directory.

The historical files are not safe to replay as a clean sequence:
- There are two different files with the `001` prefix (`001_foundation.sql` and `001_init.sql`) that define overlapping tables differently.
- There are two different files with the `002` prefix that define overlapping modules differently.
- Later migrations assume tables and columns created by those earlier files.
- Production already contains data and manually configured owner access that must be preserved.

## Safety rules

1. Do not run `supabase db push`, reset the project, or replay `db/migrations/*.sql` against production until a canonical baseline has been generated and reviewed.
2. Do not drop/recreate existing production tables or change the owner staff account as part of baseline adoption.
3. Keep `db/migrations/` as historical source material. Do not rename or delete the duplicate-prefix files until their history has been reconciled.
4. Treat `supabase/migrations/` as the only forward migration directory for new Supabase CLI migrations.
5. A migration-history repair is bookkeeping, not a schema repair. Never mark a migration applied merely to silence a CLI warning.

## Baseline adoption procedure (not yet executed)

1. Confirm the linked project ref is the intended production project.
2. Take/verify a database backup before any production migration-history change.
3. Pull or otherwise introspect the current remote schema into a new timestamped migration under `supabase/migrations/`. This must represent the existing schema; it must not blindly replay historical SQL.
4. Review the generated SQL against the live schema, especially table definitions, constraints, indexes, RLS policies, grants, functions, and triggers. Preserve existing data and the owner setup.
5. Compare the generated baseline with the application queries and the forward-only repair script. Resolve differences before treating it as canonical.
6. Only after review, reconcile the remote migration history to the baseline using the Supabase CLI's migration-history repair workflow. Confirm the resulting local/remote migration lists match.
7. Add future schema changes as new timestamped files under `supabase/migrations/`. Test them on a non-production database before production rollout.

## What is intentionally absent

There is not yet a timestamped baseline SQL migration in this directory. Creating one without a complete, verified snapshot of production constraints, indexes, policies, functions, and triggers could make a fresh environment incorrect or encourage unsafe production changes. This README records the safe process; it does not claim that migration history has been repaired.

## Existing project-specific references

- Supabase project ref: `aojsnhnlohakakvnnron`
- Historical SQL: `db/migrations/`
- Application schema repair artifact: `LadoOrganics_Production_Schema_Repair.sql` (kept outside the migration sequence until reconciled)
