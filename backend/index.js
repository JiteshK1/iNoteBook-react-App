import { createRequire } from "module";
const require = createRequire(import.meta.url)
import express from "express";
import { connectToMongo } from "./db.js";
import authRoute from "./routes/auth.js";
import notesRoute from "./routes/notes.js";
import cors from 'cors'

connectToMongo()
const app = express()
const port = 5000
app.use(cors())

app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/notes', notesRoute)


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})