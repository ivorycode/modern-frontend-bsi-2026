/**
 * Musterlösung Aufgabe 1: ProfileCard mit CSS Modules,
 * ausschliesslich Design Tokens (siehe ProfileCard.module.css).
 */
import styles from "./ProfileCard.module.css";

export interface Profile {
  name: string;
  role: string;
  skills: string[];
  online: boolean;
}

export const demoProfile: Profile = {
  name: "Sasha Keller",
  role: "Frontend Engineer",
  skills: ["Angular", "React", "TypeScript", "CSS"],
  online: true,
};

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    // Vertiefung a: Wrapper als Container für die Container Query
    <div className={styles.host}>
      <article className={styles.card}>
        <div className={styles.avatar}>{initials(profile.name)}</div>
        <span
          className={profile.online ? `${styles.status} ${styles.online}` : styles.status}
          role="img"
          aria-label={profile.online ? "online" : "offline"}
        />
        <h3 className={styles.name}>{profile.name}</h3>
        <p className={styles.role}>{profile.role}</p>
        <ul className={styles.skills}>
          {profile.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <button className={styles.follow}>Folgen</button>
      </article>
    </div>
  );
}
