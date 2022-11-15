import * as net from 'net'
import TcpPingResult from './TcpPingResult'
import { Timer } from './Timer'

const second : number = 1000

export interface TcpPingOptions {
  host: string
  port: number
}


export class TcpPing {
  private _socket: net.Socket
  private _defaultTimeout: number
  private _timer: Timer


  constructor() {
    this._socket = new net.Socket()
    this._timer = new Timer()
    this._defaultTimeout = 5 * second
  }

  async ping(options: TcpPingOptions): Promise<TcpPingResult> {
    try {
      this._timer.start()
      this._socket.connect(options.port, options.host)
    } catch (err) {
      this._timer.markError()
      this._timer.stop()
      return { state: 'ERROR', error: err as Error, timings: this._timer.getTimings() }
    }

    return this._waitForEvent()
  }

  _waitForEvent(): Promise<TcpPingResult> {
    return new Promise((resolve) => {
      const success = () => {
        this._timer.markConnect()
        this._timer.stop()
        this._socket.off('error', fail)
        this._socket.destroy()
        const result : TcpPingResult = { state: 'SUCCESS', timings: this._timer.getTimings() }
        return resolve(result)
      }

      const fail = (err: Error) => {
        this._timer.markError()
        this._timer.stop()
        this._socket.off('close', success)
        this._socket.destroy()
        const result : TcpPingResult = { state: 'ERROR', error: err, timings: this._timer.getTimings() }
        return resolve(result)
      }

      this._socket.once('lookup', () => { this._timer.markLookup() })
      this._socket.once('connect', success)
      this._socket.once('error', fail)
    })
  }
}
