import mongoose from 'mongoose'
import config from './app/config'
import app from './app'
import { Server } from 'http'
import seedSuperAdmin from './app/db'

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    await seedSuperAdmin()

    server = app.listen(config, () => {
      console.log(`Radioactive app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()

process.on('unhandledRejection', () => {
  console.log('ganjam hoise. server off koira disi.')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log('ganjam hoise. server off koira disi. dhori nai.')
  process.exit(1)
})
