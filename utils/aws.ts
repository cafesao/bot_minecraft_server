import senselogs from 'senselogs'
import { ECS as AWSECS, EC2 as AWSEC2 } from 'aws-sdk'

const log = new senselogs()

const ECS = new AWSECS()
const EC2 = new AWSEC2()

async function getListTask(): Promise<string | false> {
  try {
    const params = {
      cluster: process.env.CLUSTER,
    }
    const data = await ECS.listTasks(params).promise()
    if (data.taskArns?.length === 0) return false
    if (data.taskArns) {
      return data.taskArns[0].split('/')[2]
    }
    return false
  } catch (error: any) {
    log.error(error)
    return false
  }
}

async function getEIP(): Promise<string | false> {
  try {
    const task = await getListTask()
    if (!task) return false
    const params = {
      tasks: [task],
      cluster: process.env.CLUSTER,
    }
    const data = await ECS.describeTasks(params).promise()
    if (
      data.tasks &&
      data.tasks[0].attachments &&
      data.tasks[0].attachments[0].details
    ) {
      return data.tasks[0].attachments[0].details.filter((value) => {
        if (value.name === 'networkInterfaceId') return value
      })[0].value!
    }
    return false
  } catch (error: any) {
    log.error(error)
    return false
  }
}

const aws = {
  initService: async () => {
    try {
      const params = {
        cluster: process.env.CLUSTER,
        service: process.env.SERVICE,
        desiredCount: 1,
      }
      await ECS.updateService(params).promise()
      return true
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
  stopService: async () => {
    try {
      const params = {
        cluster: process.env.CLUSTER,
        service: process.env.SERVICE,
        desiredCount: 0,
      }
      await ECS.updateService(params).promise()
      return true
    } catch (error: any) {
      log.error(error)
      return false
    }
  },

  statusService: async () => {
    try {
      const params = {
        services: [process.env.SERVICE],
        cluster: process.env.CLUSTER,
      }
      const data = await ECS.describeServices(params).promise()
      if (data.services) {
        return {
          runningCount: data.services[0].runningCount,
          desiredCount: data.services[0].desiredCount,
        }
      }
      return false
    } catch (error: any) {
      log.error(error)
      return false
    }
  },

  ipService: async () => {
    try {
      const EIP = await getEIP()
      if (!EIP) return 'not_task'
      const params = {
        NetworkInterfaceIds: [EIP],
      }
      const data = await EC2.describeNetworkInterfaces(params).promise()
      if (data.NetworkInterfaces) {
        return {
          ip: data.NetworkInterfaces[0].Association?.PublicIp,
        }
      }
      return false
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
}

export default aws
