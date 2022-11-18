import * as net from 'net'
import TcpPingResult from './TcpPingResult'
import { Timer } from './Timer'

const second : number = 1000

export interface TcpPingOptions {
  host: string
  port: number
  payload?: Buffer
}

// todo: wait for response data when not providing payload?
export class TcpPing {
  private _socket: net.Socket
  private _defaultTimeout: number
  private _timer: Timer
  private _options: TcpPingOptions

  constructor() {
    this._socket = new net.Socket()
    this._timer = new Timer()
    this._defaultTimeout = 5 * second
    this._options = { host: 'localhost', port: 80 }
  }

  async ping(options: TcpPingOptions): Promise<TcpPingResult> {
    this._options = options

    try {
      this._timer.start()
      this._socket.connect(options.port, options.host, () => {
        if (this._options.payload) {
          this._socket.write(this._options.payload)
        }
      })
    } catch (err) {
      this._timer.markError()
      this._timer.stop()
      return { state: 'ERROR', error: err as Error, timings: this._timer.getTimings() }
    }

    return this._waitForEvent()
  }

  _waitForEvent(): Promise<TcpPingResult> {
    return new Promise((resolve) => {
      const onConnect = () => {
        this._timer.markConnect()

        if (!this._options.payload) {
          _returnSuccess()
        }
      }

      const onData = (chunk: Buffer) => {
        this._timer.markData()
        _returnSuccess(chunk)
      }

      const onError = (err: Error) => {
        this._timer.markError()
        this._timer.stop()
        this._socket.off('close', onConnect)
        this._socket.destroy()
        const result : TcpPingResult = { state: 'ERROR', error: err, timings: this._timer.getTimings() }
        return resolve(result)
      }

      const _returnSuccess = (chunk?: Buffer) => {
        this._timer.stop()
        this._socket.off('error', onError)
        this._socket.destroy()
        const result : TcpPingResult = { state: 'SUCCESS', timings: this._timer.getTimings(), response: chunk }
        return resolve(result)
      }

      this._socket.once('lookup', () => { this._timer.markLookup() })
      this._socket.once('connect', onConnect)
      this._socket.once('data', onData)
      this._socket.once('error', onError)
    })
  }
}
