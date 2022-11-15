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

## Inspiration

https://github.com/zulhilmizainuddin/nodejs-traceroute
https://github.com/apaszke/tcp-ping/blob/master/ping.js
