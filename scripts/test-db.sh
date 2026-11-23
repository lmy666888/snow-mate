#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
DB_DIR="$ROOT/.local/pg-day1"
PORT="${SNOWMATE_TEST_PG_PORT:-55439}"
mkdir -p "$ROOT/.local"
if [ ! -f "$DB_DIR/PG_VERSION" ]; then initdb -D "$DB_DIR" -A trust --no-locale > "$ROOT/.local/pg-init.log"; fi
pg_ctl -D "$DB_DIR" -l "$ROOT/.local/pg.log" -o "-p $PORT -h 127.0.0.1 -k $ROOT/.local" start > /dev/null
trap 'pg_ctl -D "$DB_DIR" stop -m fast > /dev/null' EXIT
# Dedicated repository-local disposable database only. No Supabase or remote database is accessed.
DB_NAME="snowmate_policy_test"
if psql -h 127.0.0.1 -p "$PORT" -d postgres -tAc "select 1 from pg_database where datname='$DB_NAME'" | rg -q 1; then
 dropdb -h 127.0.0.1 -p "$PORT" "$DB_NAME"
fi
createdb -h 127.0.0.1 -p "$PORT" "$DB_NAME"
psql -X -h 127.0.0.1 -p "$PORT" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f supabase/tests/bootstrap.sql > "$ROOT/.local/db-bootstrap.log"
psql -X -h 127.0.0.1 -p "$PORT" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f supabase/migrations/202611230001_essential_foundation.sql > "$ROOT/.local/db-migration.log"
psql -X -h 127.0.0.1 -p "$PORT" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f supabase/tests/policies.sql
