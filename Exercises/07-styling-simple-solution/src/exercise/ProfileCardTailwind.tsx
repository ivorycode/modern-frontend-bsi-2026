/**
 * Musterlösung Aufgabe 2: dieselbe Karte, nur mit Tailwind-Utilities.
 * Die Token-Utilities (bg-surface, text-ink, …) sind im @theme-Block von src/index.css definiert.
 * Vertiefung a (Container Query) ist mit @container am Wrapper und den Varianten @max-[300px]:… gelöst,
 * Vertiefung b (:has()) mit der Variante has-[…].
 */
import { initials, type Profile } from "./ProfileCard.tsx";

export function ProfileCardTailwind({ profile }: { profile: Profile }) {
  return (
    // Vertiefung a: Wrapper als Container für die Container Query
    <div className="@container">
      <article className="relative grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 rounded-(--radius-card) border border-edge bg-surface p-6 text-ink shadow-(--shadow-card) has-[button:hover]:border-accent has-[button:hover]:outline-2 has-[button:hover]:-outline-offset-2 has-[button:hover]:outline-accent @max-[300px]:grid-cols-1 @max-[300px]:justify-items-center @max-[300px]:text-center">
        <div className="row-span-2 grid size-14 place-items-center rounded-full bg-accent text-lg font-bold text-accent-contrast @max-[300px]:row-auto">
          {initials(profile.name)}
        </div>
        <span
          className={`absolute top-5 right-5 size-2.5 rounded-full ${
            profile.online ? "bg-status-online" : "bg-status-offline"
          }`}
          role="img"
          aria-label={profile.online ? "online" : "offline"}
        />
        <h3 className="m-0 text-base font-semibold">{profile.name}</h3>
        <p className="m-0 text-sm text-ink-muted">{profile.role}</p>
        <ul className="col-span-full mt-2 flex list-none flex-wrap gap-1.5 p-0">
          {profile.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-edge px-2.5 py-1 text-xs text-ink-muted"
            >
              {skill}
            </li>
          ))}
        </ul>
        <button className="col-span-full mt-3 cursor-pointer rounded-lg border-none bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast @max-[300px]:justify-self-stretch">
          Folgen
        </button>
      </article>
    </div>
  );
}
