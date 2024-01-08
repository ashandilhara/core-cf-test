
import { TileController } from 'components/controllers/TileController';
import TileContent from './TileContent';

type Props = {
  id: string
  parentId: string,
  icon: string,
  title: string,
  onChange: any,
  allowMultipleSelection: boolean,
  inputState: Array<string> | string;
  tileContent?: string,
}


export function Controller(props: Props) {

  const { id, parentId, icon, title, onChange, allowMultipleSelection, inputState, tileContent } = props;

  if(tileContent && tileContent !== '') {
    return (
      <TileContent content={tileContent} />
    )
  }
  const extraParams = allowMultipleSelection ? {
    type: 'checkbox',
  } : {
    name: parentId,
    type: 'radio'
  }

  const inputStateArray = Array.isArray(inputState) ? [...inputState] : [inputState];

  return (
    <TileController
      parentId={parentId}
      {...extraParams}
      icon={icon}
      title={title}
      value={id}
      onChange={onChange}
      allowMultipleSelection={allowMultipleSelection}
      checked={inputStateArray.includes(id)}
    />
  );
}