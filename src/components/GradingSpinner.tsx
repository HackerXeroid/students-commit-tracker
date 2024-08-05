import styles from "./GradingSpinner.module.css";

function GradingSpinner() {
  return (
    <td>
      <div className={`${styles.ldsDualRing}`}></div>
    </td>
  );
}

export default GradingSpinner;
