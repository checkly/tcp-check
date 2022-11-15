type hrTime = [number, number]

export type Timings = {
  start: number,
  lookup: number,
  connect: number,
  error: number,
  end: number
  phases: {
    dns: number,
    connect: number
    total: number
  }
}

type TimingCombo = {
  hrTime: hrTime,
  unix: number
}


export class Timer {
  private _start:  TimingCombo
  private _lookup: TimingCombo
  private _connect: TimingCombo
  private _error: TimingCombo
  private _end: TimingCombo

  constructor() {
    this._start = { hrTime: [0,0], unix: 0 }
    this._lookup = { hrTime: [0,0], unix: 0 }
    this._connect = { hrTime: [0,0], unix: 0 }
    this._error = { hrTime: [0,0], unix: 0 }
    this._end = { hrTime: [0,0], unix: 0 }
  }

  start () : void {
    this._start.hrTime =  process.hrtime()
    this._start.unix =  Date.now()
  }

  markLookup () : void {
    this._lookup.hrTime = process.hrtime(this._start.hrTime)
    this._lookup.unix = Date.now()
  }

  markConnect () : void {
    this._connect.hrTime = process.hrtime(this._start.hrTime)
    this._connect.unix = Date.now()
  }


  markError () : void {
    this._error.hrTime = process.hrtime(this._start.hrTime)
    this._error.unix = Date.now()
  }

  stop () : void {
    this._end.hrTime =  process.hrtime(this._start.hrTime)
    this._end.unix = Date.now()
  }

  getTimings () : Timings {
    return {
      start: this._start.unix,
      lookup: this._lookup.unix,
      connect: this._connect.unix,
      error: this._error.unix,
      end: this._end.unix,
      phases: {
        dns: this._toMilliseconds(this._lookup.hrTime),
        connect: this._toMilliseconds(this._connect.hrTime) - this._toMilliseconds(this._lookup.hrTime),
        total: this._toMilliseconds(this._end.hrTime)
      }
    }
  }

  _toMilliseconds (time: hrTime) : number {
    return (time[0] * 1e9 + time[1]) / 1e6
  }
}
