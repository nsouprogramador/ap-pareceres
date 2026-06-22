/**
 * services/auth.service.ts
 * Regra de negócio de cadastro de usuário (hash de senha + unicidade de e-mail).
 */
import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import type { RegisterInput } from "@/lib/validations";

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new Error("EMAIL_TAKEN");

    const password = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password,
    });

    return { id: user.id, name: user.name, email: user.email };
  },
};
