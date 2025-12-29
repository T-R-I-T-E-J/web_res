-- Create Events Table
CREATE TABLE IF NOT EXISTS "events" (
    "id" BIGSERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "location" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    "registration_link" VARCHAR(500),
    "circular_link" VARCHAR(500),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at" TIMESTAMPTZ
);
-- Create Media Type Enum
DO $$ BEGIN CREATE TYPE "media_type_enum" AS ENUM ('image', 'video', 'document');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
-- Create Media Items Table
CREATE TABLE IF NOT EXISTS "media_items" (
    "id" BIGSERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "type" "media_type_enum" NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "category" VARCHAR(100),
    "description" TEXT,
    "alt_text" VARCHAR(255),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "media_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at" TIMESTAMPTZ
);