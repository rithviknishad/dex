import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center p-24 min-h-screen">
      <div className={styles.center + " scale-150"}>
        <span className="font-black text-xl text-brand-500 tracking-widest">
          VAIDYUTI
        </span>
        <div className={styles.dex}>
          <span className="text-brand-300">DEX</span>
        </div>
      </div>

      <div className={styles.description}>
        <p>
          Get started by building&nbsp;
          <code className={styles.code}>Prosumers and Scenes</code>
        </p>
      </div>
    </div>
  );
}
