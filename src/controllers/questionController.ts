import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllQuestions = async (req: Request, res: Response) => {
  const allQuestions = await prisma.question.findMany();
  res.json(allQuestions);
};

export const askQuestion = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;
  //@ts-ignore
  const user = req.user;

  try {
    const result = await prisma.question.create({
      data: {
        title,
        description,
        type,
        userId: user.id,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Unable to post the question' });
  }
};

export const questionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = await prisma.question.findUnique({
    where: { id: Number(id) },
    include: { answers: true },
  });
  if (!question) {
    return res.status(404).json('question not found');
  }
  res.json(question);
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.question.delete({ where: { id: Number(id) } });
    res.json({ message: 'question deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'unable to delete the question' });
  }
};
