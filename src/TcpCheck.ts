import * as net from 'net'
import TcpCheckResult from './TcpCheckResult'

const second : number = 1000

export interface TcpCheckOptions {
  host: string
  port: number
}

export class TcpCheck {
  private _socket: net.Socket
  private _startHrTime: [number, number]
  private _endHrTime: [number, number]
  private _responseTime: number
  private _defaultTimeout: number


  constructor() {
    this._socket = new net.Socket()
    this._startHrTime = [0,0]
    this._endHrTime = [0,0]
    this._responseTime = 0
    this._defaultTimeout = 5 * second
  }

  async ping(options: TcpCheckOptions): Promise<TcpCheckResult> {
    try {
      this._startHrTime = process.hrtime()
      this._socket.connect(options.port, options.host)
    } catch (err) {
      return { state: 'error', error: err as Error, responseTime: 0 }
    }

    return this._waitForEvent()
  }

  _waitForEvent(): Promise<TcpCheckResult> {
    return new Promise((resolve) => {
      const success = () => {
        this._endHrTime = process.hrtime(this._startHrTime)
        this._socket.off('error', fail)
        this._socket.destroy()
        const result : TcpCheckResult = { state: 'success', responseTime: this._compileResponseTime() }
        return resolve(result)
      }

      const fail = (err: Error) => {
        this._endHrTime = process.hrtime(this._startHrTime)
        this._socket.off('close', success)
        this._socket.destroy()
        const result : TcpCheckResult = { state: 'error', error: err, responseTime: this._compileResponseTime() }
        return resolve(result)
      }

      this._socket.once('connect', success)
      this._socket.once('error', fail)
    })
  }
  _compileResponseTime () {
    return (this._endHrTime[0] * 1e9 + this._startHrTime[1]) / 1e6
  }
}
