import { GetServerSideProps } from 'next'
import React from 'react'
import { getSession } from 'next-auth/client'

const App = (): JSX.Element => <></>
export default App

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session?.user?.email)
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: true,
      },
    }

  return {
    redirect: {
      destination: '/lists',
      permanent: true,
    },
  }
}
