import { APIGatewayProxyHandler } from 'aws-lambda'
import senselogs from 'senselogs'

import messages from './messages/message'
import aws from './utils/aws'
import { IBody, ICommands } from './interface'

const log = new senselogs()

const commands: ICommands = {
  '/start_server': aws.initService,
  '/stop_server': aws.stopService,
  '/status_server': aws.statusService,
  '/ip_server': aws.ipService,
}

export const handler: APIGatewayProxyHandler = async (event): Promise<any> => {
  if (!event.body) return false
  const {
    message: {
      chat: { id, username },
      text,
    },
  } = JSON.parse(event.body) as IBody
  const usernameAllow = process.env.USERNAME.split(',')
  try {
    if (!usernameAllow.includes(username)) {
      await messages('user_invalid', id)
      return false
    }
    const status = await commands[text]()
    if (!status) {
      await messages('error', id)
    } else {
      await messages(text, id, status)
      return true
    }
  } catch (error: any) {
    log.error(error)
  }
}
