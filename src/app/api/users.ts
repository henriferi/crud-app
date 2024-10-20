import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { matricula, name, email, role } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          matricula,
          name,
          email,
          role,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Falha ao criar usuário" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
  
}
