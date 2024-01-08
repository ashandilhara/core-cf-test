import { ReactNode } from 'react';
import styles from './PageContainer.module.scss'

interface PageContainerProps
{
   children: ReactNode;
}

export function PageContainer(props: PageContainerProps) {
  const {children} = props;
  return (
     <div className={ styles.container }>
      {children}
     </div>
  )
}