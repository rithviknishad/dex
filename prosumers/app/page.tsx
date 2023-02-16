import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center p-24 min-h-screen font-display">
      <div className="flex flex-col gap-10">
        <div className={styles.center}>
          <span className="font-bold text-2xl text-brand-500 tracking-widest">
            Vaidyuti
          </span>
          <div className={styles.dex}>
            <span className="font-bold text-brand-400 tracking-widest">
              DEX
            </span>
          </div>
        </div>
        <p className="font-mono">
          <span className="text-white">Decentralized Energy Exchage | </span>
          <span className="text-brand-400 font-bold">
            Build and Deploy Scenes
          </span>
        </p>
        <Link className="mx-auto" href="/dashboard">
          <div className={styles.description}>
            <p>
              Open&nbsp;
              <code>Dashboard</code>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
