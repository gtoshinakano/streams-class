import axios from 'axios'
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3000'

async function consume() {
  const res = await axios({
    url,
    method: "GET",
    responseType: 'stream'
  })

  return res.data
}

const stream = await consume()

stream.pipe(
  new Transform({
    transform(chunk, encode, cb) {
      const item = JSON.parse(chunk)
      const myNumber = /\d+/.exec(item.name)[0]
      let name = item.name
      if (myNumber % 2 === 0) name = name.concat(" is even")
      else name = name.concat(" is odd")

      item.name = name

      cb(null, JSON.stringify(item))
    }
  })
    .pipe(
      new Writable({
        write(chunk, encode, cb) {
          console.log("Ja chegou o disco voador", chunk.toString())
          cb()
        }
      })
    )

)
