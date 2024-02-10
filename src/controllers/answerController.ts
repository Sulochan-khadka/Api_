import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllAnswers = async (req: Request, res: Response) => {
  const allAnswers = await prisma.answer.findMany();
  res.json(allAnswers);
};

export const postAnswer = async (req: Request, res: Response) => {
  const { body, questionId } = req.body;
  //@ts-ignore
  const user = req.user;
  try {
    const result = await prisma.answer.create({
      data: {
        body,
        questionId,
        userId: user.id,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Unable to post the answer' });
  }
};

export const getAnswerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const answer = await prisma.answer.findUnique({
    where: { id: Number(id) },
  });
  if (!answer) {
    return res.status(404).json('answer not found');
  }
  res.json(answer);
};
export const editAnswer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body, questionId, userId } = req.body;
  try {
    const result = await prisma.answer.update({
      where: { id: Number(id) },
      data: { body, questionId, userId },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'failed to update the answer' });
  }
};

export const deleteAnswer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.answer.delete({ where: { id: Number(id) } });
    res.json({ message: 'answer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'unable to delete the answer' });
  }
};
