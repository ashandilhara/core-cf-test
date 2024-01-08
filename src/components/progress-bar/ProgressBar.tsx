import { stage } from 'src/types';
import styles from './ProgressBar.module.scss';
import { Transition } from 'react-transition-group';
import { useState, useRef, useEffect } from 'react';

export function ProgressBar(props: { progress: Array<stage> }) {
  const { progress } = props;
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setInProp(true)
  }, []);

  if (!progress) return null;

  return (
    <div className={styles.container}>
      <Transition in={inProp} timeout={300} nodeRef={nodeRef}>
        {(state) => {
            return (
              <div className={styles.bars}>

              <span
                className={`${styles.stageIcon} ${
                  progress[0].isCompleted ? styles.stageIconCompleted : ''
                } ${progress[0].isActive && styles.stageIconActive}`}
              ></span>
              <div className={`${styles.bar}`}>
                <div
                    className={`${styles.bar__fill} ${progress[1].isActive && state === "entered" ? styles.fillEntered : ''} ${progress[1].isCompleted ? styles.fillComplete : ""}`}
                ></div>
              </div>

              <span
                className={`${styles.stageIcon} ${
                  progress[1].isCompleted ? styles.stageIconCompleted : ''
                } ${progress[1].isActive && styles.stageIconActive}`}
              ></span>
              <div className={`${styles.bar}`}>
                <div
                  className={`${styles.bar__fill} ${progress[2].isActive && state === "entered" ? styles.fillEntered : '' } ${progress[2].isCompleted ? styles.fillComplete : ""}`}
                ></div>
              </div>
              <span
                className={`${styles.stageIcon} ${
                  progress[2].isCompleted ? styles.stageIconCompleted : ''
                } ${progress[2].isActive && styles.stageIconActive}`}
              ></span>
            </div>
            )
        }}
      </Transition>
     
     
      <div className={styles.stages}>
        {progress.map((stage: any, i: number) => {
          return (
            <div key={i} className={styles.stage}>
              <span
                className={`${styles.stageName}  ${stage.isActive ? styles.stageNameActive : ''}`}
              >
                {stage.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
