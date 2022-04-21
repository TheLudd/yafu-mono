export interface Parameter {
  name: string,
  type: string,
  generics?: string[],
}

export interface Definition {
  isExported?: boolean,
  name: string,
  type: string,
  parameters: Parameter[],
  line: number,
}

