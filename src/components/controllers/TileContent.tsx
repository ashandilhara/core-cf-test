//import { TileController } from 'src/types';
import styles from './TileContent.module.scss';

const TileContent = (props: any) => {
  const {
   content
  } = props;
  return (
    <div className={`${styles.block}`}>
    <div
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  </div>
  );
}

export default TileContent;
