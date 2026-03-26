ALTER TABLE "FruitItem"
ADD COLUMN "mainImages" JSONB,
ADD COLUMN "showOnHome" BOOLEAN NOT NULL DEFAULT false;

UPDATE "FruitItem"
SET "mainImages" = CASE
  WHEN "mainImage" IS NULL OR trim("mainImage") = '' THEN '[]'::jsonb
  ELSE jsonb_build_array("mainImage")
END
WHERE "mainImages" IS NULL;

CREATE INDEX "FruitItem_showOnHome_idx" ON "FruitItem"("showOnHome");