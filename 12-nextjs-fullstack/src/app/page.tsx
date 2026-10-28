import styles from "@/app/component.module.css";

// export const dynamic = "force-dynamic";

export default function Home() {
  console.log("Rendering Home Page");
  return (
    <div className={styles.wrapper}>
      <h1>React Server Components Demo</h1>
    </div>
  );
}
