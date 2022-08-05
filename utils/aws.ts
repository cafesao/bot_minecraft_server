import senselogs from 'senselogs'
import { ECS } from 'aws-sdk'

const logs = new senselogs()

const ControllerECS = new ECS()

const aws = {
  initService: async () => {
    try {
      const params: ECS.UpdateServiceRequest = {
        cluster: process.env.CLUSTER,
        service: process.env.SERVICE,
        desiredCount: 1,
      }
      const data = await ControllerECS.updateService(params).promise()
      console.log(data)
      return true
    } catch (error: any) {
      logs.error(error)
      return false
    }
  },
  stopService: async () => {
    try {
      const params: ECS.UpdateServiceRequest = {
        cluster: process.env.CLUSTER,
        service: process.env.SERVICE,
        desiredCount: 0,
      }
      const data = await ControllerECS.updateService(params).promise()
      console.log(data)
      return true
    } catch (error: any) {
      logs.error(error)
      return false
    }
  },

  statusService: async () => {
    try {
      const params = {
        services: [process.env.SERVICE],
        cluster: process.env.CLUSTER,
      }
      const data = await ControllerECS.describeServices(params).promise()
      if (data.services) {
        data.services[0].desiredCount
        return {
          runningCount: data.services[0].runningCount,
          desiredCount: data.services[0].desiredCount,
        }
      }
      return false
    } catch (error: any) {
      logs.error(error)
      return false
    }
  },
}

export default aws
