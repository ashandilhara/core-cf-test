/**
 * This Layout is needed for Starter Kit.
 */
import React from 'react';
import Head from 'next/head';
import { Placeholder, LayoutServiceData, Field, HTMLLink } from '@sitecore-jss/sitecore-jss-nextjs';
//import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Scripts from 'src/Scripts';

import { PageContainer } from 'components/custom/PageContainer';

// Prefix public assets with a public URL to enable compatibility with Sitecore Experience Editor.
// If you're not supporting the Experience Editor, you can remove this.
//const publicUrl = getPublicUrl();

const publicUrl = '';

interface LayoutProps {
  layoutData: LayoutServiceData;
  headLinks: HTMLLink[];
  header?: string;
  footer?: string;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ layoutData, headLinks, header, footer }: LayoutProps): JSX.Element => {
  const { route } = layoutData.sitecore;
  const fields = route?.fields as RouteFields;
  const isPageEditing = layoutData.sitecore.context.pageEditing;
  const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode';
  return (
    <>
      <Scripts />
      <Head>
        <title>{fields?.Title?.value?.toString() || 'Page'}</title>
        <link rel="icon" href={`${publicUrl}/favicon.ico`} />
        {headLinks.map((headLink) => (
          <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
        ))}

        <style>
          {`@import url('https://static.cloud.coveo.com/searchui/v2.10109/css/CoveoFullSearch.min.css') layer(coveo);
            @layer coveo, legacy, rebase;`}
        </style>

        <link rel="stylesheet" href={`${publicUrl}/assets/css/main.css`}></link>
        <link rel="stylesheet" href="https://use.typekit.net/kgv5gkd.css" />
        <meta name="robots" content="noindex"></meta>
      </Head>

      <PageContainer>
        {/* root placeholder for the app, which we add components to using route data */}
        <div className={mainClassPageEditing}>
          <div dangerouslySetInnerHTML={{ __html: header ? header : '' }} />
            <main>            
                {route && <Placeholder name="headless-main" rendering={route} />}
            </main>
          <div dangerouslySetInnerHTML={{ __html: footer ? footer : '' }} />
        </div>
      </PageContainer>
    </>
  );
};

export default Layout;
