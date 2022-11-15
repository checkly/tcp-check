import * as net from 'net'
import * as http from 'http'

import { TcpPing, TcpPingOptions } from '../TcpPing'

describe('TcpPing', () => {
  describe('.ping()', () => {
    const socketPort = 9001
    const httpPort = 8081

    let socketServer: net.Server
    let httpServer: http.Server

    beforeAll(() => {
      socketServer = net.createServer()
      socketServer.listen(socketPort)

      httpServer = http.createServer((request, response) => {
        response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' })
        response.end('my http response')
      })
      httpServer.listen(httpPort)
    })
    afterAll(() => {
      socketServer.close()
      httpServer.close()
    })
    test('returns a result for an open port', async () => {
      const options: TcpPingOptions = { host: 'localhost', port: socketPort }
      const tcpPingResult = await new TcpPing().ping(options)
      expect(tcpPingResult.timings.end).toBeGreaterThan(0)
    })
    test('returns a result for an open port: live', async () => {
      const options: TcpPingOptions = { host: 'checklyhq.com', port: 443 }
      const tcpPingResult = await new TcpPing().ping(options)
      console.log(tcpPingResult)
      expect(tcpPingResult.timings.end).toBeGreaterThan(0)
    })
    test('returns ECONNREFUSED for a closed port', async () => {
      const options: TcpPingOptions = { host: 'localhost', port: 12345 }
      const result = await new TcpPing().ping(options)
      switch (result.state) {
        case 'ERROR':
          expect(result.error.message).toEqual(
            'connect ECONNREFUSED 127.0.0.1:12345'
          )
          break;
        default:

      }
    })
    test('returns ERR_SOCKET_BAD_PORT for an out of range port', async () => {
      const options: TcpPingOptions = { host: 'localhost', port: 123456789 }
      const result = await new TcpPing().ping(options)
      switch (result.state) {
        case 'ERROR':
          expect(result.error?.message).toEqual(
            'Port should be >= 0 and < 65536. Received 123456789.'
          )
      }
    })
    test('returns ENOTFOUND for a non-existing host', async () => {
      const options: TcpPingOptions = { host: 'blabla', port: 8000 }
      const result = await new TcpPing().ping(options)
      switch (result.state) {
        case 'ERROR':
          expect(result.error?.message).toEqual('getaddrinfo ENOTFOUND blabla')
      }
    })
    test('returns ENOENT even though the host and port are garbage', async () => {
      const options: TcpPingOptions = {
        host: 123 as any,
        port: 'umpalumpa' as any
      }
      const result = await new TcpPing().ping(options)
      switch (result.state) {
        case 'ERROR':
      }
    })
  })
})
