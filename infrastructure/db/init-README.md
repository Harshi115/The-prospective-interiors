# Database Init Scripts

Place any `.sql` files here that need to run once when a fresh database
container is first created (e.g. seed data, initial schema tweaks).

Naming convention: `init-01-something.sql`, `init-02-something-else.sql`
(numbered prefix controls execution order).

This project currently uses Strapi's own SQLite database (managed inside
the `cms/` service), so this folder is a placeholder for now — it becomes
relevant if/when a separate Postgres/MySQL database is introduced.