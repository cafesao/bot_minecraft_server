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
  [command: string]: string
}

export interface ICommands {
  [command: string]: Function
}

export interface IStatus {
  runningCount: number
  desiredCount: number
}
