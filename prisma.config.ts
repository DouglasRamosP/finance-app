// prisma.config.ts
import 'dotenv/config'
import path from 'node:path'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  // garante que a URL vem do .env
  datasource: {
    url: env('DATABASE_URL'),
  },
})
