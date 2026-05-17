import { type } from "arktype";

const a = type({
  name: 'string',
  "oldPassword?": type("string >= 8 | ''").configure({
    message: "Old password must be at least 8 characters",
  }),
})

const out = a({ name: 'tes', oldPassword: "" })

console.log('out', out)
