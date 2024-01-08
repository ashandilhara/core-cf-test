import styles from './TileController.module.scss';

type Props = {
  title: string,
  name?: string,
  value: string,
  icon: string,
  type: string,
  onChange: any,
  parentId: string,
  allowMultipleSelection: boolean,
  checked: boolean,
}

export function TileController(props: Props) {
  const {
    title,
    name,
    value,
    icon,
    type,
    onChange,
    parentId,
    allowMultipleSelection,
    checked,
  } = props;
  return (
    <label className={styles.label}>
      <input
        className={styles.input}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(parentId, e, allowMultipleSelection)}
        checked={checked}
        aria-labelledby={`title-${value}`}
      />
      <div className={`${styles.block} check-custom`}>
        <div
          className={`${styles.icon} check-custom__icon`}
          dangerouslySetInnerHTML={{ __html: icon }}
        ></div>
        <span id={`title-${value}`} className={styles.name}>{title}</span>
      </div>
    </label>
  );
}
