import { z } from 'zod'

// * Article Schema

export const createArticleSchema = z.object({
  title: z
    .string({
      required_error: 'title is required',
      invalid_type_error: 'title type should be a string',
    })
    .min(2, { message: 'title length should be more of 2 characters' })
    .max(200),
  description: z
    .string({
      required_error: 'description is required',
      invalid_type_error: 'description type should be a string',
    })
    .min(10),
})

// * Register Schema

export const registerUserSchema = z.object({
  username: z.string().min(2).max(200),
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6).max(200),
})

// * Login Schema
export const loginSchema = z.object({
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
})

// * Update User Schema
export const updateUserSchema = z.object({
  username: z.string().min(2).max(100).optional(),
  email: z.string().min(3).max(200).email().optional(),
  password: z.string().min(6).optional(),
})

//* Create Comment Schema
export const createCommentSchema = z.object({
  text: z.string().min(2).max(500),
  articleId: z.number(),
})
