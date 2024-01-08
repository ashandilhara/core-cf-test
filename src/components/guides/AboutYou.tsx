import styles from './AboutYou.module.scss';
import { Section } from 'components/section/Section';
import { section, tile } from 'src/types';
import { Button } from 'components/button/Button';

type Props = {
  sections: Array<section>;
  tiles: {
    [key: string]: tile;
  }
  sectionsStatus: {
    [key: string]: {
      isDisplayed: boolean,
      isCompleted: boolean
    }
  }
  inputsState: {
    [key: string]: {
      value: Array<string> | string ;
    }
  }
  onChangeValue: any,
  handleNextClick: any,
  handleBackClick: any,
  rendering: any
}

const AboutYou = (props: Props) => {
  const { sections, tiles, sectionsStatus, onChangeValue, handleNextClick, handleBackClick, inputsState } = props;

  const sectionsStatusTemp = { ...sectionsStatus };
  // remove the first node and only the children sections will be verified
  if (sections && sections.length > 0) delete sectionsStatusTemp[sections[0].id];
  const isCompleted = Object.keys(sectionsStatusTemp)
    .filter((element: any) => sectionsStatusTemp[element].isDisplayed)
    .some((item: any) => sectionsStatusTemp[item].isCompleted === true);

  return (
    <div className={styles.contentWrapper}>
      <h3 className="heading3">About you</h3>
      <h5 className={`${styles.introHeading} heading5`}>Tell us about your situation</h5>
       {sections &&
          sections.map((section: section, index: number) => {
            const inputStateValue = inputsState[section.id] && inputsState[section.id].value ? inputsState[section.id].value : []
            return (
              <Section
                {...section}
                key={index}
                allTiles={tiles}
                onChangeValue={onChangeValue}
                status={sectionsStatus[section.id]}
                inputsState={inputStateValue}
              />
            )
          })}
      <div className={ styles.bottomButtons }>
      <Button onClick={() => {handleBackClick()}}>Back</Button>
      <Button disabled={!isCompleted} secondary onClick={() => {handleNextClick()}}>Next</Button>
     </div>
    </div>
  );
};

export default AboutYou;
