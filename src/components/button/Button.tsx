
import styles from './Button.module.scss'

 // styles.error

export function Button(props: any) {
  const {children, onClick, secondary, disabled, tertiary, customStyle, innerRef} = props;
  
  let btnStyle = styles.primary;
  if (secondary) btnStyle = styles.secondary;
  if (tertiary) btnStyle = styles.tertiary;
  return (
     <button ref={innerRef} disabled={disabled} onClick={onClick} className={ `${btnStyle} ${disabled && styles.btnDisabled} ${customStyle ? customStyle : ""}` }>
      {children}
     </button>
  )
}