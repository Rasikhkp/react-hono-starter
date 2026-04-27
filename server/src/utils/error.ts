import { ContentfulStatusCode } from "hono/utils/http-status"

export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR"
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

export class AppError extends Error {
  code: ErrorCode
  status: ContentfulStatusCode

  constructor(code: ErrorCode, message: string, status: ContentfulStatusCode = 400) {
    super(message)
    this.code = code
    this.status = status
  }
}
