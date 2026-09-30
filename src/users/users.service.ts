import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { users } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import type { NewUser } from 'src/db/schema';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async findByVerificationToken(token: string) {
    return db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    });
  }

  async findAll() {
    return db.query.users.findMany();
  }

  async create(data: NewUser) {
    // we insert the new user to table users
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  }
}
