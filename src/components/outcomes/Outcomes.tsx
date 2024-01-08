import { useEffect } from 'react';
import { setOutcomes, selectOutcome, loadingOutcomes } from 'src/redux/features/outcomesSlice';
import { back } from 'src/redux/features/sectionsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from 'src/redux/store';
import config from 'temp/config';
import { GetFnGOutcomesDocument } from 'src/graphQL/OutcomesConnectedQuery.graphql';
import {
    GraphQLRequestClient
  } from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './Outcomes.module.scss';
import { OutcomeContent } from 'components/outcomes/OutcomeContent';
import MyGuide from 'components/outcomes/MyGuide';
import Loading from './Loading';
import Tag from 'components/tags/Tag';
import { Button } from 'components/button/Button';
import { ProgressBar } from 'components/progress-bar/ProgressBar';
import { OutcomesValueData } from 'src/types';
import { Tooltip } from 'components/Tooltip/Tooltip';




type SectionTypeItem = {
  icon: JSX.Element;
  title: string;
  sections: Array<JSX.Element>;
}


type SectionsByType = {
  "action": SectionTypeItem;
  "definition": SectionTypeItem;
  "how": SectionTypeItem;
  "why": SectionTypeItem;
  "tools":SectionTypeItem;
};


const Outcomes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const outcomesSlice: any = useAppSelector(state => state.outcomesSlice)
    const sectionsSlice: any = useAppSelector(state => state.sectionsSlice)
    const {displayingOutcome: {title, outcomeTexts, id, guideCategory}, relevantSelection, isLoading} = outcomesSlice

    // create a simple array with ids and title of all tiles selected in the previous section
    const tilesSelectedArray: any = [];
    Object.keys(sectionsSlice.inputsState).map((id) => {
      const values =  Array.isArray(sectionsSlice.inputsState[id].value) ? sectionsSlice.inputsState[id].value : [sectionsSlice.inputsState[id].value]
      values.map((value: string) => {
        tilesSelectedArray.push({id: value, title: sectionsSlice.tiles[value].title});
      })
    })
    
    useEffect(() => {
      const fetchData = async () => {
        dispatch(loadingOutcomes({isLoading: true}))
        const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
          apiKey: config.sitecoreApiKey,
        });
        const result = await graphQLClient.request<OutcomesValueData>(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          GetFnGOutcomesDocument as any, {
              datasource: sectionsSlice.outcomeRootId,
              language: "en",
            }
        );
        const outcomesUnderGuide = result.outcomesUnderGuide.outcomes.results;
        const outcomesOutsideOfGuide = result.outcomesOutsideOfGuide.results;
        const tooltipsforGuideCategorization = result.ToolTipsforGuideCategorization.tooltips.results;
        setTimeout(() => {
          dispatch(setOutcomes({outcomesUnderGuide, outcomesOutsideOfGuide, tooltipsforGuideCategorization, tilesSelected: tilesSelectedArray}));
        }, 1500);
      };
      fetchData();
    }, []);

    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    if (isLoading) {
      handleScrollToTop();
      return (
        <>
          <ProgressBar progress={sectionsSlice.progress} />
          <Loading />
        </>
      )
    }

    const handleMyGuideOutcomeClick = (id: string) => {
      dispatch(selectOutcome({id}))
    }

    const handleRestartMyGuide = () => {
      dispatch(back())
    }

    const handleDownloadPDF = () => {
      window.print()
    }

    const getSectionTitle = (typeName: string) => {
      const outcomeObj = outcomesSlice.displayingOutcome;
      switch (typeName) {
        case 'action':
          return outcomeObj.actionSectionTitle.value;
        case 'definition': 
          return outcomeObj.definitionSectionTitle.value;
        case 'how':
          return outcomeObj.howSectionTitle.value;
        case 'why':
          return outcomeObj.whySectionTitle.value;
        case 'tools':
          return outcomeObj.toolsAndCalculatorsSectionTitle.value;
        default:
            return ""
      }
    }
    const sectionsByType: SectionsByType = {
      'action': {
        icon: <i className="fa-sharp fa-solid fa-circle-check"></i>,
        title: "",
        sections: []
      },
      'definition': {
        icon: <i className="fa-sharp fa-solid fa-question-circle"></i>,
        title: "",
        sections: []
      },
      'how': {
        icon: <i className="fa-sharp fa-solid fa-user"></i>,
        title: "",
        sections: []
      },
      'why': {
        icon: <i className="fa-sharp fa-solid fa-user"></i>,
        title: "",
        sections: []
      },
      'tools': {
        icon: <i className="fa-sharp fa-solid fa-tools"></i>,
        title: "",
        sections: []
      },
    }

    const categoryTooltipIndex = outcomesSlice.tooltips.findIndex((tooltip: any) => tooltip.typeName.value === guideCategory.targetItem.type.value);
    const categoryTooltip = outcomesSlice.tooltips[categoryTooltipIndex];
    outcomeTexts?.results.map((result: any, index: number) => {
        const sectionTypeName: string =  result.outcomeSectionType.targetItem.typeName.value;
        if (sectionsByType[sectionTypeName as keyof SectionsByType].title === "") {
          sectionsByType[sectionTypeName as keyof SectionsByType].title = getSectionTitle(sectionTypeName);
        }
        sectionsByType[sectionTypeName as keyof SectionsByType].sections.push(<div key={index} dangerouslySetInnerHTML={{ __html: result.textContent.value }}></div>)
    })
    
    return (
      <div className={styles.outcomes}>
        <div className={styles.outcomes__sidebar}>
          <MyGuide
            outcomes={outcomesSlice.outcomes} 
            handleMyGuideOutcomeClick={handleMyGuideOutcomeClick}
            handleRestartMyGuide={handleRestartMyGuide}
            idSelected={id}
            types={outcomesSlice.tooltips}
          />
        </div>
          <div className={styles.outcomes__main}>
            <div className={styles.outcomes__main__contentWrapper}>
              
              { categoryTooltip &&
                <div className={styles.outcomes__category}>
                  <span className={styles.outcomes__categoryTooltip} >
                   <Tooltip title={categoryTooltip.typeName.value} content={categoryTooltip.tooltip.value} />   
                  </span>
                </div>
              }
              
              <h3 className={`heading3 ${styles.outcomes__title}`}>{title && title.value}</h3>
              <div className={styles.outcomes__list}>
                { //action
                  sectionsByType.action.sections.length > 0 && (
                    <OutcomeContent title={sectionsByType.action.title} icon={sectionsByType.action.icon} expanded={true}>
                      {sectionsByType.action.sections}
                    </OutcomeContent>
                  )
                }
                 { //definition
                  sectionsByType.definition.sections.length > 0 && (
                    <OutcomeContent title={sectionsByType.definition.title} icon={sectionsByType.definition.icon}>
                      {sectionsByType.definition.sections}
                    </OutcomeContent>
                  )
                }
                { //why
                  sectionsByType.why.sections.length > 0 && (
                    <OutcomeContent title={sectionsByType.why.title} icon={sectionsByType.why.icon}>
                      <div>
                        <strong>based on your situation:</strong>
                        <div className={styles.outcomes__tags}>
                        {relevantSelection[id].map((selection: {id: string, title: string} , i: number) => (<Tag key={i} text={selection.title}/>))}
                        </div>
                      </div>
                      {sectionsByType.why.sections}
                    </OutcomeContent>
                  )
                }
                { //how
                  sectionsByType.how.sections.length > 0 && (
                    <OutcomeContent title={sectionsByType.how.title} icon={sectionsByType.how.icon}>
                      {sectionsByType.how.sections}
                    </OutcomeContent>
                  )
                }
                { //tools
                  sectionsByType.tools.sections.length > 0 && (
                    <OutcomeContent title={sectionsByType.tools.title} icon={sectionsByType.tools.icon}>
                      {sectionsByType.tools.sections}
                    </OutcomeContent>
                  )
                }
              </div>
            <div className={styles.outcomes__bottomButtons}>
              <Button onClick={handleDownloadPDF} tertiary>Download PDF <i className="fa-sharp fa-solid fa-arrow-down"></i></Button>
              <Button onClick={handleScrollToTop} tertiary>Back to top <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M0 12C0 5.37097 5.37097 0 12 0C18.629 0 24 5.37097 24 12C24 18.629 18.629 24 12 24C5.37097 24 0 18.629 0 12ZM6.94839 13.3984L10.4516 9.74516V18.5806C10.4516 19.2242 10.9694 19.7419 11.6129 19.7419H12.3871C13.0306 19.7419 13.5484 19.2242 13.5484 18.5806V9.74516L17.0516 13.3984C17.5016 13.8677 18.2516 13.8774 18.7113 13.4177L19.2387 12.8855C19.6935 12.4306 19.6935 11.6952 19.2387 11.2452L12.8226 4.82419C12.3677 4.36935 11.6323 4.36935 11.1823 4.82419L4.75645 11.2452C4.30161 11.7 4.30161 12.4355 4.75645 12.8855L5.28387 13.4177C5.74839 13.8774 6.49839 13.8677 6.94839 13.3984Z" fill="#085A64" />
              </svg></Button>
            </div>
            </div>
          </div>
      </div>
      )    
}


export default Outcomes;