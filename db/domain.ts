// db/domain.ts
import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const ramais = pgTable("ramais", {
  id: serial("id").primaryKey(),
  numero: varchar("numero", { length: 20 }).notNull(),
  nome: varchar("nome", { length: 255 }),
  setor: varchar("setor", { length: 255 }).notNull(),
  unidadeId: integer("unidade_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
