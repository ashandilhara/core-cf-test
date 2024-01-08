import styles from "./Tag.module.scss";

const Tag = (props: {text: string}) => {
    const {text} = props
   return (
        <div className={styles.tag}>
            {text}
        </div>
    )
}

export default Tag;