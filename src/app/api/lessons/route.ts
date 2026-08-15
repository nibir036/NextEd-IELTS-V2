import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function getPrisma() {
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(globalForPrisma.pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") || "grammar";

  try {
    const prisma = getPrisma();
    const lessons = await prisma.lessons.findMany({
      where: {
        section: section as any,
        is_published: true,
      },
      orderBy: { position: "asc" },
      select: {
        id: true,
        title: true,
        titleBn: true,
        body: true,
        position: true,
        difficulty: true,
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Lessons API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}