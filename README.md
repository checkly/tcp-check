# TCP ping

- Typescript first
- zero dependencies
- has some tests
- modern codebase

## Usage

```ts
import { TcpPing, TcpPingOptions } from '@checkly/clients/tcp-ping'

const options: TcpPingOptions = { host: 'localhost', port: 8080 }
const tcpPingResult = await new TcpPing().ping(options)

console.log(tcpPingResult)

/** prints
{
  "state": "SUCCESS",
  "timings": {
    "start": 1668546586515,
    "lookup": 1668546586572,
    "connect": 1668546586599,
    "error": 0,
    "end": 1668546586600,
    "phases":{
      "dns": 57.748715,
      "connect": 27.112156000000006,
      "total": 84.916527
  }
**/
```

# Adding payloads

You can write to the socket by adding a payload as a `Buffer`. This will also record the `data` time mark and the 
`firstByte` phase, as well as a `reponse` in the result. This way you can ping Redis for instance:

```ts
import { TcpPing, TcpPingOptions } from '@checkly/clients/tcp-ping'
const options = { host: 'localhost', port: 6379, payload: new Buffer('*1\r\n$4\r\nPING\r\n', 'utf8') }
const tcpPingResult = await new TcpPing().ping(options)

console.log(tcpPingResult)

/** prints
 {
      state: 'SUCCESS',
      timings: {
        start: 1668799114636,
        lookup: 1668799114644,
        connect: 1668799114647,
        data: 1668799114647,
        error: 0,
        end: 1668799114647,
        phases: {
          dns: 7.833849,
          connect: 3.4006320000000008,
          firstByte: 3.571518,
          total: 14.805999
        }
      },
      response: <Buffer 2b 50 4f 4e 47 0d 0a>
    }
**/
```
Converting the `Buffer` to a `string` yields:

```ts
console.log(tcpPingResult.response.toString())
// prints '+PONG\r\n'
```

## Inspiration

https://github.com/zulhilmizainuddin/nodejs-traceroute
https://github.com/apaszke/tcp-ping/blob/master/ping.js
