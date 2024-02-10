import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();
export const createUser = async (req: Request, res: Response) => {
  const { email, username, name, type } = req.body;
  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        type,
        bio: 'Newbie here',
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Username or email must be unique' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const allUser = await prisma.user.findMany();
  res.json(allUser);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { questions: true, answers: true },
  });
  if (!user) {
    return res.status(404).json('user not found');
  }
  res.json(user);
};

export const editUserInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;
  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'failed to update the user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'user deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'unable to delete the user' });
  }
};
