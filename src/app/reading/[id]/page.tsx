import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type JsonObject = {
  [key: string]: unknown;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function renderContent(value: unknown, key?: string): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }

  // String
  if (typeof value === "string") {
    return (
      <p className="whitespace-pre-line leading-8 text-gray-700">
        {value}
      </p>
    );
  }

  // Number / Boolean
  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <span className="text-gray-700">
        {String(value)}
      </span>
    );
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <div className="space-y-4">
        {value.map((item, index) => (
          <div key={index}>
            {renderContent(item)}
          </div>
        ))}
      </div>
    );
  }

  // Object
  if (isObject(value)) {
    return (
      <div className="space-y-5">
        {Object.entries(value).map(([childKey, childValue]) => {
          // Special handling for points/items
          if (Array.isArray(childValue)) {
            return (
              <div key={childKey}>
                <h4 className="font-semibold text-lg text-gray-900 mb-3 capitalize">
                  {formatKey(childKey)}
                </h4>

                <div className="space-y-3">
                  {childValue.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      {renderContent(item)}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Nested object
          if (isObject(childValue)) {
            return (
              <div
                key={childKey}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5"
              >
                <h4 className="font-semibold text-lg text-gray-900 mb-3">
                  {formatKey(childKey)}
                </h4>

                {renderContent(childValue)}
              </div>
            );
          }

          return (
            <div key={childKey}>
              <h4 className="font-semibold text-gray-900 mb-2">
                {formatKey(childKey)}
              </h4>

              {renderContent(childValue)}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("========== READING DEBUG ==========");
  console.log("URL ID:", id);

  const lesson = await prisma.lessons.findUnique({
    where: {
      id,
    },
  });

  console.log("LESSON FOUND:", !!lesson);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold text-red-600">
            Lesson Not Found
          </h1>

          <p className="mt-4 text-gray-700">
            URL ID:
          </p>

          <code className="block mt-2 p-3 bg-gray-100 rounded text-gray-900">
            {id}
          </code>
        </div>
      </div>
    );
  }

  const body = lesson.body;

  return (
    <main className="min-h-screen bg-gray-950 py-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <header className="mb-10">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              IELTS Reading
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {lesson.title}
          </h1>

          {lesson.titleBn && (
            <p className="mt-4 text-xl text-gray-300">
              {lesson.titleBn}
            </p>
          )}
        </header>

        {/* Main Content */}
        <div className="space-y-8">

          {isObject(body) && (
            <>
              {/* Module */}
              {typeof body.module === "string" && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-5">
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Module
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {body.module}
                  </p>
                </div>
              )}

              {/* Introduction */}
              {typeof body.intro === "string" && (
                <section className="rounded-2xl bg-white p-7 md:p-9 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5">
                    Introduction
                  </h2>

                  <p className="whitespace-pre-line text-lg leading-8 text-gray-700">
                    {body.intro}
                  </p>
                </section>
              )}

              {/* Bangla Introduction */}
              {typeof body.introBn === "string" && (
                <section className="rounded-2xl bg-blue-50 border border-blue-200 p-7 md:p-9">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5">
                    বাংলায় সংক্ষেপে
                  </h2>

                  <p className="whitespace-pre-line text-lg leading-8 text-gray-800">
                    {body.introBn}
                  </p>
                </section>
              )}

              {/* Sections */}
              {Array.isArray(body.sections) && (
                <div className="space-y-8">
                  {body.sections.map((section, index) => {
                    if (!isObject(section)) {
                      return null;
                    }

                    const code =
                      typeof section.code === "string"
                        ? section.code
                        : `section-${index + 1}`;

                    const title =
                      typeof section.title === "string"
                        ? section.title
                        : `Section ${index + 1}`;

                    const titleBn =
                      typeof section.titleBn === "string"
                        ? section.titleBn
                        : null;

                    return (
                      <section
                        key={code}
                        className="rounded-2xl bg-white shadow-lg overflow-hidden"
                      >
                        {/* Section Header */}
                        <div className="bg-gray-100 border-b border-gray-200 p-6 md:p-8">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 rounded-md bg-gray-900 text-white text-sm font-bold">
                              {code}
                            </span>

                            <span className="text-sm font-semibold text-gray-500">
                              Section {index + 1}
                            </span>
                          </div>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {title}
                          </h2>

                          {titleBn && (
                            <p className="mt-2 text-lg text-gray-600">
                              {titleBn}
                            </p>
                          )}
                        </div>

                        {/* Section Content */}
                        <div className="p-6 md:p-8">
                          {section.content !== undefined && (
                            <div>
                              {renderContent(section.content)}
                            </div>
                          )}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}