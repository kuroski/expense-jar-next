import React from 'react'
import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '@/theme'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content="Expense jar" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Expense jar" />
          <meta name="description" content="Manage your subscriptions" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          {/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}
          <meta name="msapplication-TileColor" content="#4e81ee" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#4e81ee" />
          <title>Expense jar</title>

          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
          <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#4e81ee" />
          <link rel="shortcut icon" href="/icons/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="http://expense-jar-next.vercel.app" />
          <meta name="twitter:title" content="Expense jar" />
          <meta name="twitter:description" content="Manage your subscriptions" />
          <meta name="twitter:image" content="http://expense-jar-next.vercel.app/icons/icon-192x192.png" />
          <meta name="twitter:creator" content="@DavidWShadow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Expense jar" />
          <meta property="og:description" content="Manage your subscriptions" />
          <meta property="og:site_name" content="Expense jar" />
          <meta property="og:url" content="http://expense-jar-next.vercel.app" />
          <meta property="og:image" content="http://expense-jar-next.vercel.app/icons/apple-touch-icon.png" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config!.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
