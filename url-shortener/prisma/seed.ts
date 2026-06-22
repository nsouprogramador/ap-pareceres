/**
 * prisma/seed.ts
 * Popula o banco com um usuário admin e alguns links/cliques de exemplo,
 * úteis para visualizar o dashboard imediatamente após instalar.
 *
 * Executar:  npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";

const prisma = new PrismaClient();
const slugId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  7,
);

const SAMPLE_URLS = [
  "https://nextjs.org/docs",
  "https://www.prisma.io/docs",
  "https://tailwindcss.com",
  "https://ui.shadcn.com",
  "https://vercel.com",
];

const BROWSERS = ["Chrome", "Firefox", "Safari", "Edge"];
const OSES = ["Windows", "macOS", "Linux", "Android", "iOS"];
const DEVICES = ["desktop", "mobile", "tablet"];
const COUNTRIES = ["Brasil", "Estados Unidos", "Portugal", "Alemanha", "Japão"];
const CITIES = ["São Paulo", "New York", "Lisboa", "Berlim", "Tóquio"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@linkly.dev";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123456";
  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Administrador",
      email,
      password: hash,
      role: "ADMIN",
    },
  });

  console.log(`✓ Usuário admin: ${admin.email} (senha: ${password})`);

  // Limpa links anteriores do admin para um seed idempotente.
  await prisma.link.deleteMany({ where: { userId: admin.id } });

  for (const url of SAMPLE_URLS) {
    const totalClicks = Math.floor(Math.random() * 120) + 10;
    const link = await prisma.link.create({
      data: {
        slug: slugId(),
        originalUrl: url,
        userId: admin.id,
        clicks: totalClicks,
        active: true,
      },
    });

    const events = Array.from({ length: totalClicks }).map(() => {
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      return {
        linkId: link.id,
        ip: `${rand(1, 255)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 255)}`,
        city: pick(CITIES),
        country: pick(COUNTRIES),
        browser: pick(BROWSERS),
        os: pick(OSES),
        device: pick(DEVICES),
        referer: pick(["https://google.com", "https://twitter.com", "direct"]),
        userAgent: "seed-script",
        createdAt,
      };
    });

    await prisma.click.createMany({ data: events });
    console.log(`✓ Link /${link.slug} → ${url} (${totalClicks} cliques)`);
  }

  console.log("\nSeed concluído com sucesso! 🚀");
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
