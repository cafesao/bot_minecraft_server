declare global {
  namespace NodeJS {
    interface ProcessEnv {
      USERNAME: string
      TOKEN: string
      SERVICE: string
      CLUSTER: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
