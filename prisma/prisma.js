import pkg from '../src/generated/prisma/index.js'
const { PrismaClient } = pkg

export const prisma = new PrismaClient()
