

import { ReactNode } from 'react';
import styles from './Column.module.scss'

interface ColumnProps
{
   left?: boolean;
   right?: boolean;
   half?: boolean;
   children: ReactNode;
}

export function Column(props: ColumnProps) {
  const {children, left, right, half} = props;
  let colStyle = styles.column;
  if (left) colStyle = styles.left;
  if (right) colStyle = styles.right;
  if (half) colStyle = styles.half;

  return (
     <div className={colStyle}>
      {children}
     </div>
  )
}