// pages/api/auth/ramais/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ramais, users } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

async function getSession(req: NextRequest) {
  return await auth.api.getSession({ headers: await headers() });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(session.user.id))
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const whereClause = user.role === 'owner' 
      ? undefined 
      : eq(ramais.unidadeId, user.unidadeId!);

    const allRamais = await db.query.ramais.findMany({
      where: whereClause,
      orderBy: (ramais, { asc }) => [asc(ramais.unidadeId), asc(ramais.numero)]
    });

    return NextResponse.json(allRamais);
  } catch (error) {
    console.error('Erro ao buscar ramais:', error);
    return NextResponse.json({ error: 'Erro ao buscar ramais' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(session.user.id))
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { numero, nome, setor, unidadeId } = body;

    if (user.role === 'ti' && unidadeId !== user.unidadeId) {
      return NextResponse.json(
        { error: 'Você só pode criar ramais da sua unidade' }, 
        { status: 403 }
      );
    }

    const novoRamal = await db.insert(ramais).values({
      numero,
      nome,
      setor,
      unidadeId,
    }).returning();

    return NextResponse.json(novoRamal[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ramal:', error);
    return NextResponse.json({ error: 'Erro ao criar ramal' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(session.user.id))
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { id, numero, nome, setor, unidadeId } = body;

    const ramalExistente = await db.query.ramais.findFirst({
      where: eq(ramais.id, id)
    });

    if (!ramalExistente) {
      return NextResponse.json({ error: 'Ramal não encontrado' }, { status: 404 });
    }

    if (user.role === 'ti' && ramalExistente.unidadeId !== user.unidadeId) {
      return NextResponse.json(
        { error: 'Você só pode editar ramais da sua unidade' }, 
        { status: 403 }
      );
    }

    const ramalAtualizado = await db.update(ramais)
      .set({
        numero,
        nome,
        setor,
        unidadeId,
        updatedAt: new Date(),
      })
      .where(eq(ramais.id, id))
      .returning();

    return NextResponse.json(ramalAtualizado[0]);
  } catch (error) {
    console.error('Erro ao atualizar ramal:', error);
    return NextResponse.json({ error: 'Erro ao atualizar ramal' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(session.user.id))
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    const ramalExistente = await db.query.ramais.findFirst({
      where: eq(ramais.id, parseInt(id))
    });

    if (!ramalExistente) {
      return NextResponse.json({ error: 'Ramal não encontrado' }, { status: 404 });
    }

    if (user.role === 'ti' && ramalExistente.unidadeId !== user.unidadeId) {
      return NextResponse.json(
        { error: 'Você só pode deletar ramais da sua unidade' }, 
        { status: 403 }
      );
    }

    await db.delete(ramais).where(eq(ramais.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar ramal:', error);
    return NextResponse.json({ error: 'Erro ao deletar ramal' }, { status: 500 });
  }
}