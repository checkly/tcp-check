type hrTime = [number, number]

export type Timings = {
  start: number,
  lookup: number,
  connect: number,
  data: number,
  error: number,
  end: number
  phases: {
    dns: number,
    connect: number,
    firstByte: number,
    total: number
  }
}

type TimingCombo = {
  hrTime: hrTime,
  unix: number
}


export class Timer {
  private _start: TimingCombo
  private _lookup: TimingCombo
  private _connect: TimingCombo
  private _data: TimingCombo
  private _error: TimingCombo
  private _end: TimingCombo

  constructor() {
    this._start = {hrTime: [0, 0], unix: 0}
    this._lookup = {hrTime: [0, 0], unix: 0}
    this._connect = {hrTime: [0, 0], unix: 0}
    this._data = {hrTime: [0, 0], unix: 0}
    this._error = {hrTime: [0, 0], unix: 0}
    this._end = {hrTime: [0, 0], unix: 0}
  }

  start(): void {
    this._start.hrTime = process.hrtime()
    this._start.unix = Date.now()
  }

  markLookup(): void {
    this._lookup.hrTime = process.hrtime(this._start.hrTime)
    this._lookup.unix = Date.now()
  }

  markConnect(): void {
    this._connect.hrTime = process.hrtime(this._start.hrTime)
    this._connect.unix = Date.now()
  }

  markData(): void {
    this._data.hrTime = process.hrtime(this._start.hrTime)
    this._data.unix = Date.now()
  }

  markError(): void {
    this._error.hrTime = process.hrtime(this._start.hrTime)
    this._error.unix = Date.now()
  }

  stop(): void {
    this._end.hrTime = process.hrtime(this._start.hrTime)
    this._end.unix = Date.now()
  }

  getTimings(): Timings {
    const marks = {
      start: this._start.unix,
      lookup: this._lookup.unix,
      connect: this._connect.unix,
      data: this._data.unix,
      error: this._error.unix,
      end: this._end.unix,
    }

    const dns = this._toMilliseconds(this._lookup.hrTime)
    const connect = this._toMilliseconds(this._connect.hrTime) - this._toMilliseconds(this._lookup.hrTime)
    const firstByte = this._data.unix
      ? this._toMilliseconds(this._data.hrTime) - this._toMilliseconds(this._lookup.hrTime)
      : 0
    const total = dns + connect + firstByte

    const phases = {
      dns,
      connect,
      firstByte,
      total
    }
    return { ...marks, phases }
  }

  _toMilliseconds (time: hrTime) : number {
    return (time[0] * 1e9 + time[1]) / 1e6
  }
}
