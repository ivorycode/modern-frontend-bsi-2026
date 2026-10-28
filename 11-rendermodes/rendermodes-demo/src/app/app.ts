import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  template: `
    <header>
      <a routerLink="/" class="logo">Muster Versicherung</a>
      <nav>
        <a routerLink="/produkte" routerLinkActive="active">Produkte <small>SSG</small></a>
        <a routerLink="/unwetter" routerLinkActive="active">Unwetter <small>SSR</small></a>
        <a routerLink="/portal" routerLinkActive="active">Kundenportal <small>CSR</small></a>
      </nav>
    </header>

    <main>
      <router-outlet />
    </main>
  `,
  styles: `
    header {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1rem 2rem;
      background: #003a70;
    }
    header a {
      color: white;
      text-decoration: none;
    }
    .logo {
      font-weight: bold;
      font-size: 1.2rem;
    }
    nav {
      display: flex;
      gap: 1.5rem;
    }
    nav a.active {
      text-decoration: underline;
    }
    small {
      opacity: 0.7;
    }
    main {
      padding: 1rem 2rem;
    }
  `,
})
export class App {}
