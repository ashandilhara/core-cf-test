import styles from './OutcomeContent.module.scss'
import React, { useState, useEffect } from "react";


 // styles.error

export function OutcomeContent(props: any) {
  const {children, title, icon, expanded} = props;
  const expandedByDefault = expanded ? true : false;
  const [isExpanded, setExpandedState] = useState(expandedByDefault);

  useEffect(() => {
    setExpandedState(expandedByDefault)
  }, [children]);

  const handleClick = () => {
    if (isExpanded) {
      setExpandedState(false)
    } else {
      setExpandedState(true)
    }
  }


  const hiddenClass = isExpanded ? "" : "is-hidden";
  const chevronClass = isExpanded ? "fa-chevron-up" : "fa-chevron-down";

  return (
    <div className={`${styles.outcomeContent} ${hiddenClass}`}>

        <button onClick={handleClick} className={styles.outcomeContent__btn}>
          {icon}
          <h6 className='heading6'>{title}</h6>
          <i className={`fa-sharp fa-solid ${chevronClass}  ${styles.outcomeContent__chevron}`}></i>
        </button>
        <div className={`${styles.outcomeContent__content}`}>
            {children}
        </div>
    </div>
  )
}