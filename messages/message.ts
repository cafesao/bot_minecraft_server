import axios from 'axios'
import senselogs from 'senselogs'

import { IMessages, IStatusServer, IIPServer } from '../interface'
import messagesFun from './messagesFun'

const log = new senselogs()

async function sendMessage(message: string, chatId: number) {
  try {
    const fetch = await axios.post(
      `https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
      },
    )
    log.info(`Status: ${fetch.status}`)
    return true
  } catch (error: any) {
    log.error(error)
    return false
  }
}

export default async function messages(
  command: string,
  chatId: number,
  status: IStatusServer | IIPServer | false = false,
) {
  const messages: IMessages = {
    '/start_server': messagesFun.startServerMessage,
    '/stop_server': messagesFun.stopServerMessage,
    '/status_server': messagesFun.statusServiceMessage,
    '/ip_server': messagesFun.ipServiceMessage,
    error: messagesFun.error,
    user_invalid: messagesFun.userInvalid,
  }
  log.info(
    `command:${command}, chatId:${chatId}, status:${JSON.stringify(status)}`,
  )
  await sendMessage(messages[command](status), chatId)
}
