import Link from "next/link";
import { headers } from "next/headers";

import styles from "../styles/index.module.css";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./_components/sign-out-button";

export default async function Home() {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  return (
    <div className={styles.container}>
      <h1>Sell Items</h1>

      {!session ? (
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up">Create account</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            Signed in as <strong>{session.user.email}</strong>
          </div>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
