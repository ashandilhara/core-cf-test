

import styles from './Button.module.scss'

 // styles.error

export function ButtoLink(props: any) {
  const {children, url, customStyle} = props;
  return (
     <a className={ `${styles.secondary} ${customStyle ? customStyle : ""}` } href={url}>
      {children}
     </a>
  )
}