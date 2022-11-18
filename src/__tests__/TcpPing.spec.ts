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
      socketServer = net.createServer().listen(socketPort)

      httpServer = http.createServer((request, response) => {
        response.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
        response.write('works')
        response.end()
      })
      httpServer.listen(httpPort)
    })
    afterAll(() => {
      socketServer.close()
      httpServer.close()
    })
    describe('SUCCESS states', () => {
      test('returns a basic result for an open port', async () => {
        const options: TcpPingOptions = {host: 'localhost', port: socketPort}
        const tcpPingResult = await new TcpPing().ping(options)
        expect(tcpPingResult.state).toEqual('SUCCESS')
        expect(tcpPingResult.timings).toBeDefined()
        expect(tcpPingResult.response).not.toBeDefined()
      })
      test('returns a response when adding a payload', async () => {
        const options: TcpPingOptions = {
          host: 'localhost',
          port: httpPort,
          payload: new Buffer('GET / HTTP/1.1\r\n\r\n', 'utf8')
        }
        const tcpPingResult = await new TcpPing().ping(options)
        const response = tcpPingResult.response?.toString()
        expect(tcpPingResult.timings.end).toBeGreaterThan(0)
        expect(tcpPingResult.state).toEqual('SUCCESS')
        expect(response).not.toBeNull()
        expect(response).toContain('HTTP/1.1 200 OK')
        expect(response).toContain('Content-Type: text/plain')
        expect(response).toContain('works')

      })
  })
    describe('timings', () => {
      test('timing marks', async () => {
        const options: TcpPingOptions = {
          host: 'localhost',
          port: httpPort,
          payload: new Buffer('GET / HTTP/1.1\r\n\r\n', 'utf8')
        }
        const tcpPingResult = await new TcpPing().ping(options)
        expect(tcpPingResult.timings).toBeDefined()
        const { start, lookup, connect, data, error, end } = tcpPingResult.timings
        expect(lookup).toBeGreaterThan(start)
        expect(connect).toBeGreaterThanOrEqual(lookup)
        expect(data).toBeGreaterThan(connect)
        expect(error).toEqual(0)
        expect(end).toBeGreaterThanOrEqual(connect)
      })
      test('timing phases', async () => {
        const options: TcpPingOptions = {
          host: 'localhost',
          port: httpPort,
          payload: new Buffer('GET / HTTP/1.1\r\n\r\n', 'utf8')
        }
        const tcpPingResult = await new TcpPing().ping(options)
        expect(tcpPingResult.timings).toBeDefined()
        const { connect, dns, firstByte, total } = tcpPingResult.timings.phases
        expect(dns).toBeGreaterThan(0)
        expect(connect).toBeGreaterThan(0)
        expect(firstByte).toBeGreaterThan(0)
        expect(total).toEqual(dns + connect + firstByte)
      })
    })
    describe('ERROR states', () => {
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
})
