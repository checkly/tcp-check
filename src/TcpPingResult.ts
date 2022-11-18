import { Timings } from './Timer'

interface TcpPingResultSuccess {
  state: 'SUCCESS'
  timings: Timings,
  response?: Buffer
}

interface TcpPingResultError {
  state: 'ERROR'
  error: Error,
  timings: Timings
  response?: Buffer
}

interface TcpPingResulTimeout {
  state: 'TIMEOUT'
  timings: Timings
  response?: Buffer
}

type TcpPingResult = TcpPingResultSuccess | TcpPingResultError | TcpPingResulTimeout


export default TcpPingResult
