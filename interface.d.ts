export interface IBody {
  message: {
    chat: {
      id: number
      first_name: string
      last_name: string
      username: string
      type: string
    }
    text: string
  }
}

export interface IMessages {
  [command: string]: Function
}

export interface ICommands {
  [command: string]: Function
}

export interface IStatusServer {
  runningCount?: number
  desiredCount?: number
}

export interface IIPServer {
  ip?: string
}
