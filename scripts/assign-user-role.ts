// // scripts/assign-user-role.ts
// import "dotenv/config";
// import { prisma } from "../src/lib/prisma";

// async function main() {
//   const email = process.env.ASSIGN_USER_EMAIL?.trim().toLowerCase();
//   const roleName = process.env.ASSIGN_USER_ROLE?.trim().toUpperCase();
//   const unidadeIdValue = process.env.ASSIGN_USER_UNIDADE_ID;

//   if (!email || !roleName) {
//     throw new Error(
//       "Defina ASSIGN_USER_EMAIL e ASSIGN_USER_ROLE no arquivo .env",
//     );
//   }

//   const unidadeId = unidadeIdValue
//     ? Number(unidadeIdValue)
//     : null;

//   if (
//     unidadeIdValue &&
//     (!Number.isInteger(unidadeId) || unidadeId <= 0)
//   ) {
//     throw new Error("ASSIGN_USER_UNIDADE_ID inválido.");
//   }

//   const user = await prisma.user.findUnique({
//     where: { email },
//     select: {
//       id: true,
//       email: true,
//     },
//   });

//   if (!user) {
//     throw new Error(`Usuário não encontrado: ${email}`);
//   }

//   if (unidadeId !== null) {
//     const unidade = await prisma.unidade.findUnique({
//       where: { id: unidadeId },
//       select: { id: true },
//     });

//     if (!unidade) {
//       throw new Error(`Unidade não encontrada: ${unidadeId}`);
//     }
//   }

//   const role = await prisma.role.upsert({
//     where: {
//       name: roleName,
//     },
//     update: {},
//     create: {
//       name: roleName,
//     },
//   });

//   const updatedUser = await prisma.user.update({
//     where: {
//       id: user.id,
//     },
//     data: {
//       unidadeId,
//       userRoles: {
//         connectOrCreate: {
//           where: {
//             userId_roleId: {
//               userId: user.id,
//               roleId: role.id,
//             },
//           },
//           create: {
//             roleId: role.id,
//           },
//         },
//       },
//     },
//     include: {
//       unidade: true,
//       userRoles: {
//         include: {
//           role: true,
//         },
//       },
//     },
//   });

//   console.log({
//     id: updatedUser.id,
//     email: updatedUser.email,
//     unidade: updatedUser.unidade?.nome ?? null,
//     roles: updatedUser.userRoles.map(
//       (assignment) => assignment.role.name,
//     ),
//   });
// }

// main()
//   .catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });