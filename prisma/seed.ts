/**
 * Prisma seed — UTF-8 native (Bangla-safe on Windows).
 *
 * Single file: prisma/seed-data/grammar/all-chapters.json
 *
 *   npx tsx --env-file=.env prisma/seed.ts
 *   npm run seed
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Put it in .env or export it.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedModule = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  band_unlock?: string | null;
  description?: string | null;
  position: number;
};

type SeedChapter = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  position: number;
  estimated_min?: number | null;
  difficulty?: number | null;
  band_target?: string | null;
  summary?: string | null;
  content: unknown;
  is_published?: boolean;
};

type SeedExercise = {
  id: string;
  chapter_id: string;
  slug: string;
  title: string;
  kind: string;
  instructions?: string | null;
  items: unknown;
  position: number;
  is_published?: boolean;
};

type AllSeed = {
  modules: SeedModule[];
  chapters: SeedChapter[];
  exercises: SeedExercise[];
};

async function upsertModule(m: SeedModule) {
  const bySlug = await prisma.grammar_modules.findUnique({ where: { slug: m.slug } });
  const byId = await prisma.grammar_modules.findUnique({ where: { id: m.id } });

  const data = {
    title: m.title,
    subtitle: m.subtitle ?? null,
    band_unlock: m.band_unlock ?? null,
    description: m.description ?? null,
    position: m.position,
    is_published: true,
    updated_at: new Date(),
  };

  if (bySlug && bySlug.id === m.id) {
    await prisma.grammar_modules.update({ where: { id: m.id }, data });
    return;
  }
  if (bySlug && bySlug.id !== m.id) {
    // Same slug, different id (from old seed) — update that row in place
    await prisma.grammar_modules.update({
      where: { id: bySlug.id },
      data: { ...data, slug: m.slug },
    });
    return;
  }
  if (byId && byId.slug !== m.slug) {
    // Same id, different slug — update slug + fields
    await prisma.grammar_modules.update({
      where: { id: m.id },
      data: { ...data, slug: m.slug },
    });
    return;
  }
  await prisma.grammar_modules.create({
    data: {
      id: m.id,
      slug: m.slug,
      ...data,
    },
  });
}

async function upsertChapter(ch: SeedChapter) {
  const byId = await prisma.grammar_chapters.findUnique({ where: { id: ch.id } });
  const bySlug = await prisma.grammar_chapters.findUnique({
    where: { module_id_slug: { module_id: ch.module_id, slug: ch.slug } },
  });

  const data = {
    title: ch.title,
    position: ch.position,
    estimated_min: ch.estimated_min ?? null,
    difficulty: ch.difficulty ?? null,
    band_target: ch.band_target ?? null,
    summary: ch.summary ?? null,
    content: ch.content as object,
    is_published: ch.is_published ?? true,
    updated_at: new Date(),
  };

  if (byId) {
    await prisma.grammar_chapters.update({
      where: { id: ch.id },
      data: { ...data, module_id: ch.module_id, slug: ch.slug },
    });
    return;
  }
  if (bySlug) {
    await prisma.grammar_chapters.update({
      where: { id: bySlug.id },
      data,
    });
    return;
  }
  await prisma.grammar_chapters.create({
    data: {
      id: ch.id,
      module_id: ch.module_id,
      slug: ch.slug,
      ...data,
    },
  });
}

async function upsertExercise(ex: SeedExercise) {
  const byId = await prisma.grammar_exercises.findUnique({ where: { id: ex.id } });
  const bySlug = await prisma.grammar_exercises.findUnique({
    where: { chapter_id_slug: { chapter_id: ex.chapter_id, slug: ex.slug } },
  });

  const data = {
    title: ex.title,
    kind: ex.kind as 'correction' | 'essay_edit' | 'mcq' | 'gap_fill',
    instructions: ex.instructions ?? null,
    items: (ex.items ?? []) as object,
    position: ex.position,
    is_published: ex.is_published ?? true,
  };

  if (byId) {
    await prisma.grammar_exercises.update({
      where: { id: ex.id },
      data: { ...data, chapter_id: ex.chapter_id, slug: ex.slug },
    });
    return;
  }
  if (bySlug) {
    await prisma.grammar_exercises.update({
      where: { id: bySlug.id },
      data,
    });
    return;
  }
  await prisma.grammar_exercises.create({
    data: {
      id: ex.id,
      chapter_id: ex.chapter_id,
      slug: ex.slug,
      ...data,
    },
  });
}

type SeedTipsModule = {
  id: string;
  skill?: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  position: number;
};

type SeedTipsChapter = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  position: number;
  estimated_min?: number | null;
  summary?: string | null;
  content: unknown;
  is_published?: boolean;
};

type AllTipsSeed = {
  modules: SeedTipsModule[];
  chapters: SeedTipsChapter[];
};

async function upsertTipsModule(m: SeedTipsModule) {
  const bySlug = await prisma.tips_modules.findUnique({ where: { slug: m.slug } });
  const byId = await prisma.tips_modules.findUnique({ where: { id: m.id } });

  const data = {
    skill: m.skill ?? 'writing',
    title: m.title,
    subtitle: m.subtitle ?? null,
    description: m.description ?? null,
    position: m.position,
    is_published: true,
    updated_at: new Date(),
  };

  if (bySlug && bySlug.id === m.id) {
    await prisma.tips_modules.update({ where: { id: m.id }, data });
    return;
  }
  if (bySlug && bySlug.id !== m.id) {
    await prisma.tips_modules.update({ where: { id: bySlug.id }, data: { ...data, slug: m.slug } });
    return;
  }
  if (byId && byId.slug !== m.slug) {
    await prisma.tips_modules.update({ where: { id: m.id }, data: { ...data, slug: m.slug } });
    return;
  }
  await prisma.tips_modules.create({ data: { id: m.id, slug: m.slug, ...data } });
}

async function upsertTipsChapter(ch: SeedTipsChapter) {
  const byId = await prisma.tips_chapters.findUnique({ where: { id: ch.id } });
  const bySlug = await prisma.tips_chapters.findUnique({
    where: { module_id_slug: { module_id: ch.module_id, slug: ch.slug } },
  });

  const data = {
    title: ch.title,
    position: ch.position,
    estimated_min: ch.estimated_min ?? null,
    summary: ch.summary ?? null,
    content: ch.content as object,
    is_published: ch.is_published ?? true,
    updated_at: new Date(),
  };

  if (byId) {
    await prisma.tips_chapters.update({ where: { id: ch.id }, data: { ...data, module_id: ch.module_id, slug: ch.slug } });
    return;
  }
  if (bySlug) {
    await prisma.tips_chapters.update({ where: { id: bySlug.id }, data });
    return;
  }
  await prisma.tips_chapters.create({ data: { id: ch.id, module_id: ch.module_id, slug: ch.slug, ...data } });
}

async function seedTips() {
  const files = [
    'writing-module-3.json',
    'reading-module-2.json',
  ];

  for (const filename of files) {
    const file = join(__dirname, 'seed-data', 'tips', filename);

    if (!existsSync(file)) {
      console.log('No tips seed file at', file, '- skipping.');
      continue;
    }

    const data = JSON.parse(readFileSync(file, 'utf8')) as AllTipsSeed;

    console.log(
      `Seeding tips file=${filename} modules=${data.modules.length} chapters=${data.chapters.length}`,
    );

    for (const m of data.modules) {
      await upsertTipsModule(m);
      console.log('  tips module', m.slug);
    }

    for (const ch of data.chapters) {
      await upsertTipsChapter(ch);

      const n =
        (ch.content as { blocks?: unknown[] })?.blocks?.length ?? 0;

      console.log(
        '  tips chapter',
        ch.slug,
        `(${n} blocks)`,
      );
    }
  }
}

async function main() {
  const file = join(__dirname, 'seed-data', 'grammar', 'all-chapters.json');
  if (!existsSync(file)) {
    console.error('Missing', file);
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(file, 'utf8')) as AllSeed;
  console.log(
    `Seeding modules=${data.modules.length} chapters=${data.chapters.length} exercises=${data.exercises.length}`,
  );

  for (const m of data.modules) {
    await upsertModule(m);
    console.log('  module', m.slug);
  }

  for (const ch of data.chapters) {
    await upsertChapter(ch);
    const n = (ch.content as { blocks?: unknown[] })?.blocks?.length ?? 0;
    console.log('  chapter', ch.slug, `(${n} blocks)`);
  }

  for (const ex of data.exercises) {
    await upsertExercise(ex);
    console.log('  exercise', ex.slug);
  }

  await seedTips();

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
