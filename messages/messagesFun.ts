import { IIPServer, IStatusServer } from '../interface'

const messagesFun = {
  startServerMessage: (status: any) => {
    return 'Server iniciado, aguarde cerca de 2 minutos!'
  },
  stopServerMessage: (status: any) => {
    return 'Server parando...'
  },
  statusServiceMessage: (status: IStatusServer) => {
    return `Ativos: ${status.runningCount}\nDesignado: ${status.desiredCount}`
  },
  ipServiceMessage: (status: IIPServer | string) => {
    if (typeof status === 'string') {
      return 'Não a task rodando ou você deve esperar 1 minuto.'
    }
    return `IP: ${status.ip}`
  },
  error: (status: any) => {
    return 'Ops, algo deu errado'
  },
  userInvalid: (status: any) => {
    return 'Usuario invalido!'
  },
}

export default messagesFun
