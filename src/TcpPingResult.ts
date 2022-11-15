import { Timings } from './Timer'

interface TcpCheckResultSuccess {
  state: 'SUCCESS'
  timings: Timings
}

interface TcpCheckResultError {
  state: 'ERROR'
  error: Error,
  timings: Timings
}

interface TcpCheckResulTimeout {
  state: 'TIMEOUT'
  timings: Timings
}

type TcpPingResult = TcpCheckResultSuccess | TcpCheckResultError | TcpCheckResulTimeout


export default TcpPingResult
