import React, { useState, useEffect, useRef } from 'react';
import styles from './Tooltip.module.scss'

export function Tooltip(props: {title: string, content:string}) {
    const {title, content} = props
    const [display, setDisplay] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        document.addEventListener("keydown", handleEscapeKey);
        document.addEventListener("mousedown", handleClickOutside);
        if(closeRef.current) {
            closeRef.current.focus()
        }
        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
            document.removeEventListener("mousedown", handleClickOutside);
          };
    })
    
    const handleClick = () => {
        setDisplay(true)
    }

    const handleClose = () => {
        setDisplay(false)
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
        if ((e.keyCode || e.which) === 27) setDisplay(false);
      }

    const handleClickOutside = (e: any) => {
        // If click outside component, and dropdown is open close dropdown
        if (nodeRef.current && !nodeRef.current.contains(e.target)) {
            setDisplay(false)
        }
      };

    return (
        <div className={styles.tooltip} ref={nodeRef}>
            
            <button onClick={handleClick} className={styles.tooltip__btn}>
                {title}
                <div className={styles.tooltip__icon}>
                {display && <div className={styles.tooltip__tail}></div>}
                <i className="fa-sharp fa-solid fa-circle-info"></i>
                </div>
                
            </button>
            { display && 
                <div className={styles.tooltip__content} >
                    <button onClick={handleClose} className={styles.tooltip__btnClose} ref={closeRef}><i className="fa-sharp fa-solid fa-circle-xmark"></i></button>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
            }

        </div>
    )
}