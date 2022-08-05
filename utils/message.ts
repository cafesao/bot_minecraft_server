import axios from 'axios'
import senselogs from 'senselogs'

import { IMessages, IStatus } from '../interface'

const logs = new senselogs()

async function sendMessage(message: string, chatId: number) {
  try {
    const fetch = await axios.post(
      `https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
      },
    )
    logs.info(`Status: ${fetch.status}`)
    return true
  } catch (error: any) {
    logs.error(error)
    return false
  }
}

export default async function messages(
  command: string,
  chatId: number,
  status: IStatus = {
    desiredCount: 0,
    runningCount: 0,
  },
) {
  const messages: IMessages = {
    '/start_server': 'Server iniciado, aguarde cerca de 2 minutos!',
    '/stop_server': 'Server parando...',
    error: 'Ops, algo deu errado',
    user_invalid: 'Usuario invalido!',
  }
  if (command === '/status_server') {
    await sendMessage(
      `Ativos: ${status.runningCount}\nDesignado: ${status.desiredCount}`,
      chatId,
    )
  } else {
    await sendMessage(messages[command], chatId)
  }
}
