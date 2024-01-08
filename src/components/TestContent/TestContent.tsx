import {
    GetStaticComponentProps,
    useComponentProps,
    ComponentRendering,
    GraphQLRequestClient
  } from '@sitecore-jss/sitecore-jss-nextjs';

  import config from 'temp/config';

  import { TestContentConnectedQueryDocument } from './TestContentConnectedQuery.graphql';

  type ContentBlockProps = {
    rendering: ComponentRendering;
  };

  type TextValueData = {
    datasource:{
    id: string;
    name: string;
    displayName: string
    text: {
        value: string
    }  
    }
    
  };

  const TestContent = ({ rendering }: ContentBlockProps): JSX.Element => {
    const externalData = useComponentProps<TextValueData>(rendering.uid);
    return (
      <>
        {externalData && (
          <div>
            <h1>{externalData?.datasource.text.value}</h1>
          </div>
        )}
      </>
    );
  };

  export const getStaticProps: GetStaticComponentProps = async (_rendering, layoutData, _context) => {
    //const post = await fetchPost();
    //return post;

    const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
        apiKey: config.sitecoreApiKey,
      });

      const result = await graphQLClient.request<TextValueData>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        TestContentConnectedQueryDocument as any,
        {
          datasource: "/sitecore/content/Guides/Guides/Home/Data/Text 1",
          language: layoutData?.sitecore?.context?.language,
        }
      );

      return result;

  };
  export default TestContent;