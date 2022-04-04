# TCP check

- Typescript first
- zero dependencies
- has some tests
- modern codebase

## Usage

```ts
import { TcpCheck, TcpCheckOptions } from '@checkly/tcp-check'

const options: TcpCheckOptions = { host: 'localhost', port: 8080 }
const tcpCheckResult = await new TcpCheck().ping(options)

console.log(tcpCheckResult)

// prints: { state: 'success', responseTime: 948.337506 }
```

## Inspiration

https://github.com/zulhilmizainuddin/nodejs-traceroute
https://github.com/apaszke/tcp-ping/blob/master/ping.js
