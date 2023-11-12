import './globals.css';
import React, { Suspense } from 'react';
import useSettings from "@/stores/settings";
import { findSettingByName } from '@/lib/admin/fields';
import RootLayout from '@/components/RootLayout';
import { getSettingsData } from '@/actions/admin/settings';


const Layout = async ({ children }: {
  children: React.ReactNode
}) => {

  const settings = await getSettingsData()
  const siteFavicon = findSettingByName(settings, "site favicon")

  return (
    <html lang='vi'>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
        { siteFavicon
          ? <link rel="icon" type={siteFavicon.mime} href={siteFavicon.url}></link>
          : null
        }
      </head>
      <body id='__next'>
        <RootLayout settings={settings}>{children}</RootLayout>
      </body>
    </html>
  );
}

export default Layout