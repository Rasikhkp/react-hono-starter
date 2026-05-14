import { ContentfulStatusCode } from "hono/utils/http-status"

export const ERROR_TYPES = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR"
} as const

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES]

export class AppError extends Error {
  code: ErrorType
  status: ContentfulStatusCode

  constructor(code: ErrorType, message: string, status: ContentfulStatusCode = 400) {
    super(message)
    this.code = code
    this.status = status
  }
}
