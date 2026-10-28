/**
 * Übung: ProfileCard gestalten
 * ------------------------------------------------------------
 * Diese Komponente ist bewusst ohne Styling. Aufgabe siehe README.md.
 */

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
    <article /* TODO: Karte */>
      <div /* TODO: Avatar-Kreis mit Initialen */>{initials(profile.name)}</div>
      <span
        /* TODO: Status-Punkt, grün wenn online, sonst grau */
        role="img"
        aria-label={profile.online ? "online" : "offline"}
      />
      <h3 /* TODO */>{profile.name}</h3>
      <p /* TODO */>{profile.role}</p>
      <ul /* TODO: Skill-Tags als «Pills» */>
        {profile.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <button /* TODO: Accent-Button */>Folgen</button>
    </article>
  );
}
