export type UserData = {
  nome: string
  cpf: string
  nascimento: string
  sexo: string
  nome_mae: string
}

export type AddressData = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export type School = {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  maxRating: number
  type: "Credenciada" | "Parceira"
  categories: string[]
}
