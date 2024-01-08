import styles from 'components/outcomes/Loading.module.scss'
const Loading = (props: any) => {
    return (
        <div className={styles.loading} {...props}>
            <div className={styles.loading__contentWrapper}>
                <div className={styles.loading__figure}></div>
                <div className={styles.loading__progressInfo}><span className={styles.loading__loader}></span></div>
            </div>
        </div>
    )
}

export default Loading