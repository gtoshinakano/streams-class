import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'


function* run() {
  for (let i = 0; i <= 99; i++) {
    const data = {
      id: randomUUID(),
      name: `Toshi-${i}`
    }
    yield data
  }
}

function handler(req, res) {

  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log(data)
        this.push(JSON.stringify(data) + "\n")
      }
      this.push(null)
    }
  })

  readable.pipe(res)
}

http.createServer(handler)
  .listen(3000)
  .on("listening", () => console.log('Server running on port 3000'))