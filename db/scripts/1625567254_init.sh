#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_USER" <<-EOSQL
        CREATE DATABASE tavernium_db;
EOSQL
