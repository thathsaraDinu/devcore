/*
  Convert existing plain-text Note content and Question answers
  into Tiptap JSON documents without losing existing data.
*/

-- Note.content: String -> JSONB
ALTER TABLE "Note"
ALTER COLUMN "content" TYPE JSONB
USING jsonb_build_object(
  'type', 'doc',
  'content',
  jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'content',
      CASE
        WHEN "content" = '' THEN '[]'::jsonb
        ELSE jsonb_build_array(
          jsonb_build_object(
            'type', 'text',
            'text', "content"
          )
        )
      END
    )
  )
);

-- Question.answer: String -> JSONB
ALTER TABLE "Question"
ALTER COLUMN "answer" TYPE JSONB
USING CASE
  WHEN "answer" IS NULL THEN NULL
  WHEN "answer" = '' THEN jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', '[]'::jsonb
      )
    )
  )
  ELSE jsonb_build_object(
    'type', 'doc',
    'content',
    jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content',
        jsonb_build_array(
          jsonb_build_object(
            'type', 'text',
            'text', "answer"
          )
        )
      )
    )
  )
END;