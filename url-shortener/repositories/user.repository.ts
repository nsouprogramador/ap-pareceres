/**
 * repositories/user.repository.ts
 * Acesso a dados de usuários (cadastro e autenticação).
 */
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({ data });
  },
};
