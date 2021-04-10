import * as t from 'io-ts'

const FormValues = t.type({
  code: t.string,
})
type FormValues = t.TypeOf<typeof FormValues>

export default FormValues
