import axios from 'axios'

const createAxios = () =>
  axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_HOST}/api`,
  })
export default createAxios
