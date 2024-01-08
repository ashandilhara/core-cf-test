import { Button } from 'components/button/Button';
import styles from 'components/outcomes/MyGuide.module.scss';
import { ChangeEvent } from 'react';
import { Tooltip } from 'components/Tooltip/Tooltip';



const MyGuide = (props: any) => {
  const { outcomes, handleMyGuideOutcomeClick, idSelected, handleRestartMyGuide, types } = props;

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleMyGuideOutcomeClick(e.target.value);
  }
  const typeGroups: any = [];

    types.map((item: any) => {

      const filterOutcomes = outcomes.filter((outcome: any) => outcome.guideCategory.targetItem.type.value === item.typeName.value)

      typeGroups[`${item.typeName.value}`] = {
        name: item.typeName.value,
        tooltipContent: item.tooltip.value,
        outcomesButtons: filterOutcomes.map((el: any, index: number) => (
          <button
              key={index}
              className={`${styles.myGuide__outcomes__btn} ${idSelected === el.id ? "is-selected" : ""}`}
              onClick={() => {
                handleMyGuideOutcomeClick(el.id);
              }}
            >
              {el.title.value}
          </button>)),
          outcomesDropdown: filterOutcomes.map((el: any, index: number) => (<option key={index} value={el.id}>{el.title.value}</option>))
      }
    })

  return (
    <div className={styles.myGuide}>
      <div className={styles.myGuide__title}>
        <h3 className={`${styles.myGuide__title__text} heading5`}>Āwhina Mai</h3>
      </div>

      {
        typeGroups.obligations && typeGroups.obligations.outcomesButtons.length > 0 && (
          <div className={styles.myGuide__outcomes}>
            <div className={styles.myGuide__outcomeTitle}>
              <Tooltip title={typeGroups.obligations.name} content={typeGroups.obligations.tooltipContent} />
            </div>
            {typeGroups.obligations.outcomesButtons}
          </ div>
        )
      }

      {
        typeGroups.entitlements && typeGroups.entitlements.outcomesButtons.length > 0 && (
          <div className={styles.myGuide__outcomes}>
          <div className={styles.myGuide__outcomeTitle}>
            <Tooltip title={typeGroups.entitlements.name} content={typeGroups.entitlements.tooltipContent} />
          </div>
          {typeGroups.entitlements.outcomesButtons}
        </div>)
      }
     
      <div className={styles.myGuide__bottomCtas}>
        <Button onClick={() => { console.log("Download full guide...") }} tertiary> <span>Download full guide</span> <i className="fa-sharp fa-solid fa-arrow-down"></i></Button>
        <Button onClick={handleRestartMyGuide} tertiary> <span>Restart Āwhina Mai</span> <i className="fa-sharp fa-solid fa-rotate-left"></i></Button>
      </div>
      <div className={`${styles.myGuide__outcomes} ${styles.myGuide__outcomes__mobile}`}>
        <label>Select a guide</label>
        <div className={styles.myGuide__outcomes__dropdown}>
          <select name="dropdownGuides" id="dropdownGuides" onChange={(e) => {handleDropdownChange(e)}}>
            {typeGroups.obligations && typeGroups.obligations.outcomesDropdown.length > 0 && (
              <optgroup label={typeGroups.obligations.name}>
               {typeGroups.obligations.outcomesDropdown}
             </optgroup>
            )}
             {typeGroups.entitlements && typeGroups.entitlements.outcomesDropdown.length > 0 && (
              <optgroup label={typeGroups.entitlements.name}>
               {typeGroups.entitlements.outcomesDropdown}
             </optgroup>
            )}
          </select>
        </div>
      </div>
    </div>
  );
}


export default MyGuide;