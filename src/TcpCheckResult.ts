interface TcpCheckResultSuccess {
  state: 'success'
  responseTime: number
}

interface TcpCheckResultError {
  state: 'error'
  error: Error,
  responseTime: number
}

interface TcpCheckResulTimeout {
  state: 'timeout'
  responseTime: number
}

type TcpCheckResult = TcpCheckResultSuccess | TcpCheckResultError | TcpCheckResulTimeout


export default TcpCheckResult
