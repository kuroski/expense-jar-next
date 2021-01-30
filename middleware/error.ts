export default async function onError(error, _req, res) {
  console.log(error)
  res.status(500).end()
}
