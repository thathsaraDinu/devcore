-- Add a temporary JSONB column
ALTER TABLE "Question" ADD COLUMN "question_json" JSONB;

-- Convert existing string data to JSON format (wrap in a document structure)
UPDATE "Question"
SET "question_json" = jsonb_build_object(
  'type', 'doc',
  'content', jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'content', jsonb_build_array(
        jsonb_build_object('type', 'text', 'text', "question")
      )
    )
  )
);

-- Drop the old question column
ALTER TABLE "Question" DROP COLUMN "question";

-- Rename the temporary column to question
ALTER TABLE "Question" RENAME COLUMN "question_json" TO "question";

-- Make the column NOT NULL
ALTER TABLE "Question" ALTER COLUMN "question" SET NOT NULL;
