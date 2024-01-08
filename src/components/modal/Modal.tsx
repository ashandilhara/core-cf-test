import { Button } from 'components/button/Button';
import styles from './Modal.module.scss';
import { forwardRef, useEffect, useRef } from 'react';

export function Modal (props: {showModal: boolean, closeModal: any, handleUserConfirmation: any}) {
    const {showModal, closeModal, handleUserConfirmation} = props

    const ref = useRef<HTMLInputElement>();
    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
      });

    if (!showModal) return null;
   
    const handleConfirmation = () => {
        handleUserConfirmation(true)
    }

    const FocusedButton = forwardRef((props: any, ref: any) => <Button {...props} innerRef={ref}/>);
    FocusedButton.displayName = "FocusedButton";

    return (
        <div className={styles.modal}>
            <div className={styles.modal__overlay}></div>
            <div className={styles.modal__contentBox} role="dialog" aria-labelledby="modal-title" aria-modal="true" aria-describedby="modal-desc">
                <h6 id="modal-title" className={`heading6 ${styles.modal__title}`}>Are you sure? All progress will be lost.</h6>
                <p id="modal-desc">Changing your tax residency status will clear all of the sections below. You will lose all the selections you&lsquo;ve made so far.</p>
                
                <div className={styles.modal__buttons}>
                    <FocusedButton onClick={handleConfirmation} ref={ref}>Yes, clear answers</FocusedButton>
                    <Button secondary onClick={closeModal}>Cancel</Button>
                </div>
            </div>
        </div>
    )
}