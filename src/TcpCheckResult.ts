interface TcpCheckResultSuccess {
  state: 'SUCCESS'
  responseTime: number
}

interface TcpCheckResultError {
  state: 'ERROR'
  error: Error,
  responseTime: number
}

interface TcpCheckResulTimeout {
  state: 'TIMEOUT'
  responseTime: number
}

type TcpCheckResult = TcpCheckResultSuccess | TcpCheckResultError | TcpCheckResulTimeout


export default TcpCheckResult
