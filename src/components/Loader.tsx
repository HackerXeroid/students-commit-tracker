import styles from "./Loader.module.css";

interface LoaderProps {
  variant?: string;
}

function Loader({ variant }: LoaderProps) {
  if (variant === "hourglass")
    return <div className={`${styles.ldsHourglass} scale-75`}></div>;

  return <div className={styles.loader}></div>;
}

export default Loader;
