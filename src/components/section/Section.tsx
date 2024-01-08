import { tile } from 'src/types';
import styles from './Section.module.scss'
import React from 'react';
import { Controller } from 'components/controllers/Controller';
import { Tooltip } from 'components/Tooltip/Tooltip';

type Props = {
  id: string,
  title: string,
  subtitle: string,
  tiles: Array<string>,
  status: {
    isDisplayed: boolean,
    isCompleted: boolean
  },
  onChangeValue: any,
  allowMultipleSelection: boolean,
  inputsState:  Array<string> | string ,
  allTiles: {
    [key: string]: tile;
  },
}

export function Section(props: Props) {
  const {
    id,
    title,
    subtitle,
    tiles,
    status,
    onChangeValue,
    allowMultipleSelection,
    inputsState,
    allTiles,
  } = props;
  if (!status.isDisplayed) return null

  const renderTiles = (tiles: Array<string>) => {

    const controllersArray: any = []
    const tooltipsArray: any = []
    let isGrid = true;
    tiles.map((tileID: string, index: number) => {
      const currentTile: tile = allTiles[tileID];
      controllersArray.push(<Controller
        {...currentTile}
        allowMultipleSelection={allowMultipleSelection}
        key={index}
        parentId={id}
        onChange={onChangeValue}
        inputState={inputsState}
        />
      )

      if(currentTile.tileContent && currentTile.tileContent !== "") isGrid = false;

      if(currentTile.toolTip && (currentTile.toolTip.content !== '' || currentTile.toolTip.title !== '')) {
        tooltipsArray.push(
         <Tooltip key={index} {...currentTile.toolTip} />
        )
      }
    })
    return (
      <div className={styles.section}>
        <div className={`${isGrid ? styles.section__grid : ""}`}>
          {controllersArray}
        </div>
        {tooltipsArray.length > 0 && (
          <div className={styles.section__tooltips}>
          {tooltipsArray}  
        </div>
        )}
      </div>
    )
  }

  return (
    <div id={id}>
      {title && <h6 className="heading6">{title}</h6>}
      {subtitle && <p className={styles.section__subtitle}>{subtitle}</p> }
      {renderTiles(tiles)}
    </div>
  );
}
