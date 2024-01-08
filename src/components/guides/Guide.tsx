import {
  GetStaticComponentProps,
  useComponentProps,
  ComponentRendering,
  GraphQLRequestClient,
} from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './Guide.module.scss';
import { useEffect, ChangeEvent, useState } from 'react';
import { setSections, updateSections, next } from 'src/redux/features/sectionsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from 'src/redux/store';
import { ProgressBar } from 'components/progress-bar/ProgressBar';
import AboutYou from 'components/guides/AboutYou';
import Outcomes from 'components/outcomes/Outcomes';
import config from 'temp/config';
import { GuideConnectedQueryDocument } from 'src/graphQL/GuideConnectedQuery.graphql';

import { GuideValueData } from 'src/types';
import { Modal } from 'components/modal/Modal';

type PostEntity = {
  datasource: {sections: any}
  layoutData: any;
};
type ContentBlockProps = {
  rendering: ComponentRendering;
};

const Guide = ({ rendering }: ContentBlockProps): JSX.Element => {
  const externalData = useComponentProps<PostEntity>(rendering.uid);
  const dispatch = useDispatch<AppDispatch>();
  const sectionsSlice = useAppSelector((state) => state.sectionsSlice);
  const stage = sectionsSlice.progress.find((stage) => stage.index === 1);
  const [showModal, setShowModal] = useState(false);
  const [holdInputChange, setHoldInputChange] = useState<any>({})

  useEffect(() => {
    if (externalData && externalData.datasource) {
      dispatch(setSections(externalData.datasource));
    }
  }, []);

  const handleNextClick = () => {
    dispatch(next());
  };

  const handleBackClick = () => {
    window.location.href = "/";

  };

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleUserConfirmation = (confirmation: boolean) => {
   if(confirmation) {
    setShowModal(false)
    dispatch(updateSections({inputChange: {...holdInputChange}}));
   }
  }

  const handleInputChange = (
    id: string,
    event: ChangeEvent<HTMLInputElement>,
    allowMultipleSelection: boolean
  ) => {

  const needConfirmation = sectionsSlice.sections.some(
    (section) =>
      section.shouldDisplayIf?.inputId === id &&
      sectionsSlice.sectionsStatus[section.id].isCompleted
  );

  if(needConfirmation) {
      //show modal
      setHoldInputChange({id, event, allowMultipleSelection});
      setShowModal(true)
      event.preventDefault();
   } else {
    dispatch(updateSections({inputChange: {id, event, allowMultipleSelection}}));
   }
  };

  const componentToBeRendered =
    stage && stage.isCompleted ? (
      <Outcomes />
    ) : (
      <>
        <ProgressBar progress={sectionsSlice.progress} />
        <AboutYou
          sections={sectionsSlice.sections}
          tiles={sectionsSlice.tiles}
          sectionsStatus={sectionsSlice.sectionsStatus}
          inputsState={sectionsSlice.inputsState}
          onChangeValue={handleInputChange}
          handleNextClick={handleNextClick}
          handleBackClick={handleBackClick}
          rendering={rendering}
        />
      </>
    );

  return (
    <div className={styles.mainContainer}>
      <Modal showModal={showModal} closeModal={handleCloseModal} handleUserConfirmation={handleUserConfirmation} />
      {componentToBeRendered}
    </div>
  );
};

export const getStaticProps: GetStaticComponentProps = async (rendering, layoutData, context) => {
  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
    apiKey: config.sitecoreApiKey,
  });

  const result = await graphQLClient.request<GuideValueData>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GuideConnectedQueryDocument as any,
    {
      datasource: rendering.dataSource,
      language: layoutData?.sitecore?.context?.language,
    }
  );

  return {
    datasource: result.datasource,
    rendering,
    layoutData,
    context,
  };
};

export default Guide;
