CREATE TABLE IF NOT EXISTS "categories" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "page" character varying NOT NULL DEFAULT 'policies',
    "order" integer NOT NULL DEFAULT 0,
    "is_active" boolean NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_categories_slug" UNIQUE ("slug")
);
-- Seed defaults
INSERT INTO "categories" ("name", "slug", "page", "order")
VALUES ('Rules', 'rules', 'policies', 1),
    ('Selection', 'selection', 'policies', 2),
    ('Calendar', 'calendar', 'policies', 3),
    (
        'Classification',
        'classification',
        'policies',
        4
    ),
    ('Match', 'match', 'policies', 5) ON CONFLICT ("slug") DO NOTHING;
-- Add category_id to downloads
ALTER TABLE "downloads"
ADD COLUMN IF NOT EXISTS "category_id" uuid;
-- Migrate existing data
UPDATE "downloads"
SET "category_id" = c.id
FROM "categories" c
WHERE "downloads"."category" = c.slug;
-- Add Foreign Key (only if it doesn't exist)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'FK_downloads_category_id'
) THEN
ALTER TABLE "downloads"
ADD CONSTRAINT "FK_downloads_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE
SET NULL;
END IF;
END $$;