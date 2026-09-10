/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/

-- PASSO 1: Criar TODAS as tabelas novas primeiro
-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PASSO 2: Criar índices
-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- PASSO 3: Inserir as roles baseadas no enum antigo
INSERT INTO "roles" ("name", "description") VALUES
    ('OWNER', 'Acesso total ao sistema'),
    ('ADMIN', 'Administrador com acesso amplo'),
    ('MESSAGEONLY', 'Apenas recados de unidade'),
    ('NEWSONLY', 'Apenas notícias'),
    ('MESSAGENEWS', 'Notícias + Recados Multi'),
    ('EVENTS', 'Gerenciamento de eventos')
ON CONFLICT ("name") DO NOTHING;

-- PASSO 4: MIGRAR DADOS - Criar UserRoleAssignment para cada usuário
-- CORREÇÃO: Usar CAST para converter enum UserRole para text
INSERT INTO "user_roles" ("id", "userId", "roleId", "createdAt")
SELECT 
    CONCAT('mig_', "id", '_', COALESCE((SELECT "id" FROM "roles" WHERE "name" = CAST("user"."role" AS TEXT)), 2)) as id,
    "user"."id" as "userId",
    COALESCE((SELECT "id" FROM "roles" WHERE "name" = CAST("user"."role" AS TEXT)), 2) as "roleId",
    NOW() as "createdAt"
FROM "user"
WHERE "user"."role" IS NOT NULL;

-- PASSO 5: Criar foreign keys (antes de dropar a coluna)
-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PASSO 6: AGORA SIM - Dropar a coluna antiga
-- AlterTable
ALTER TABLE "user" DROP COLUMN "role";

-- DropEnum
DROP TYPE "UserRole";