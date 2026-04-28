# STEP — Nikotinnedtrappning som prenumeration

> En full-stack Next.js-webbplats för ett nikotinnedtrappningsprogram. Kunder väljer sin startdos, programlängd och antal burkar per leverans. Systemet genererar ett automatiserat leveransschema som stegvis trappas ned mot 0 mg.

---

## Skärmdumpar

| Startsida | Shop |
|-----------|------|
| ![Startsida](docs/screenshots/01-home.png) | ![Shop](docs/screenshots/02-shop.png) |

| Hur det fungerar | FAQ |
|-----------------|-----|
| ![Hur det fungerar](docs/screenshots/03-how-it-works.png) | ![FAQ](docs/screenshots/04-faq.png) |

| Om oss | Kontakt |
|--------|---------|
| ![Om oss](docs/screenshots/05-om-oss.png) | ![Kontakt](docs/screenshots/06-kontakt.png) |

| Logga in | Registrera |
|----------|-----------|
| ![Logga in](docs/screenshots/07-login.png) | ![Registrera](docs/screenshots/08-register.png) |

| Admin-panel |
|-------------|
| ![Admin](docs/screenshots/09-admin-login.png) |

---

## Funktionsöversikt

### Publika sidor

| Sida | URL | Beskrivning |
|------|-----|-------------|
| Startsida | `/` | Hero med logotyp, testimonials, förtroende-badges |
| Shop | `/shop` | Plantabell med alla aktiva planer och priser |
| Hur det fungerar | `/hur-det-fungerar` | Steg-för-steg-guide, nedtrappningskurva, vetenskap |
| FAQ | `/faq` | DB-driven FAQ med expanderbara frågor per kategori |
| Om oss | `/om-oss` | Varumärkeshistoria, värderingar, tidslinje |
| Kontakt | `/kontakt` | Kontaktformulär + kontaktuppgifter |

### Konto & Checkout

| Sida | URL | Beskrivning |
|------|-----|-------------|
| Registrera | `/auth/registrera` | Skapar konto, skickar välkomstmejl |
| Logga in | `/auth/logga-in` | Session-baserad autentisering |
| Konto | `/konto` | Kontoöversikt |
| Prenumeration | `/konto/prenumeration` | Aktiv prenumeration, leveranskalender, pausa/avsluta |
| Profil | `/konto/profil` | Adress, telefon, leveransinstruktioner |
| Säkerhet | `/konto/sakerhet` | Byt lösenord |
| Checkout | `/checkout/[planId]` | Flerstegskassa: kontaktinfo, adress, plankonfig, betalsätt |
| Orderbekräftelse | `/checkout/[planId]/bekraftelse` | Bekräftelsesida med leveransschema |
| Swish-betalning | `/betala/swish` | QR-kod + deeplink + realtids-polling |

### Admin-panel (`/admin`)

| Sida | Funktion |
|------|----------|
| Översikt | Statistik: prenumeranter, ordrar, användare |
| Prenumerationer | Visa/hantera alla prenumerationer, leveranstidslinje, spårning |
| Ordrar | Betalningsstatus, Stripe-id, manuell aktivering |
| Användare | Visa, banna/avbanna kunder |
| Nyhetsbrev | Lista prenumeranter, exportera CSV |
| Betalningsmetoder | Konfigurera Stripe, Klarna, Swish (API-nycklar + certifikat) |
| Planer | Skapa/redigera/ta bort prenumerationsplaner |
| Förtroenderad | Redigera trust-badges på startsidan |
| Sidor (CMS) | Skapa anpassade sidor med HTML-innehåll |
| Webbplats | Alla text-inställningar: hero, SEO, kontaktuppgifter |
| Meny | Hantera header-navigation |

---

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Databas | SQLite via [Prisma](https://prisma.io) + `better-sqlite3` |
| Auth | [NextAuth.js](https://next-auth.js.org) (credentials) |
| Betalningar | Stripe Checkout, Swish Handel API (mTLS), Klarna |
| E-post | [Resend](https://resend.com) med HTML-mallar |
| Teman | [`next-themes`](https://github.com/pacocoursey/next-themes) (dark/light) |
| QR-koder | [`qrcode`](https://www.npmjs.com/package/qrcode) (Swish-betalning) |
| Bildbehandling | [`sharp`](https://sharp.pixelplumbing.com) |

---

## Projektstruktur

```
website/
├── prisma/
│   └── schema.prisma          # Databasmodeller
├── public/
│   ├── step-logo.png          # STEP-logotyp (transparent)
│   └── swish-logo.png         # Swish-logotyp
├── src/
│   ├── app/
│   │   ├── (publika sidor)    # /, /shop, /faq, /om-oss, /kontakt osv.
│   │   ├── admin/             # Admin-panel (/admin/*)
│   │   ├── api/               # API-routes
│   │   │   ├── stripe/        # Stripe checkout + webhook
│   │   │   ├── payments/swish # Swish request, callback, status
│   │   │   ├── contact/       # Kontaktformulär
│   │   │   └── newsletter/    # Nyhetsbrevssignup
│   │   ├── auth/              # Inloggning + registrering
│   │   ├── betala/swish/      # Swish betalningssida (QR + polling)
│   │   ├── checkout/          # Kassaflöde
│   │   └── konto/             # Användarkonto
│   ├── components/
│   │   └── site/              # Header, Footer, PlanCard, MobileNav, osv.
│   └── lib/
│       ├── db.ts              # Prisma-klient
│       ├── email.ts           # Resend e-postmallar
│       ├── paymentConfig.ts   # Betalningsleverantörer från DB
│       ├── planEngine.ts      # Genererar leveransschema
│       ├── siteSettings.ts    # Site-inställningar med fallback
│       ├── stripe.ts          # Stripe-klient
│       └── swish.ts           # Swish Handel API-klient (mTLS)
└── docs/
    └── screenshots/           # Skärmdumpar av alla sidor
```

---

## Databasmodeller

| Modell | Beskrivning |
|--------|-------------|
| `SiteSettings` | All redigerbar text (hero, SEO, kontaktinfo) |
| `User` | Kunder med adress, lösenordshash, ban-status |
| `Plan` | Prenumerationsplaner med priser och bullets |
| `Subscription` | Aktiv prenumeration per kund |
| `Delivery` | Enskilda leveranser i ett program med spårning |
| `Order` | Betalningspost kopplad till Stripe/Swish |
| `NavLink` | Header-navigering (admin-redigerbar) |
| `TrustItem` | Förtroende-badges |
| `FaqItem` | FAQ med kategori och sortering |
| `PaymentProvider` | Betalningsleverantörer med API-konfiguration |
| `NewsletterSubscriber` | E-postprenumeranter |
| `ContentPage` | Fria CMS-sidor |

---

## Betalningsflöden

### Stripe (Kort & Klarna)
1. Kund fyller i kassa → `submitCheckout` skapar `Subscription` + `Order` (PENDING)
2. Redirect → `/api/stripe/checkout` skapar Stripe Checkout Session
3. Kund betalar på Stripe → webhook `checkout.session.completed`
4. Webhook: Order → PAID, Subscription → ACTIVE, bekräftelsemejl skickas

### Swish Handel
1. Kund väljer Swish → skapar order → redirect `/betala/swish?orderId=xxx`
2. Server skapar betalningsförfrågan via mTLS mot Swish API
3. Sidan visar QR-kod + deeplink-knapp (för mobil)
4. Polling var 2:a sekund mot `/api/payments/swish/status`
5. Swish kallar `/api/payments/swish/callback` → Order → PAID + bekräftelsemejl

---

## Kom igång

### Krav
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/DevFelikz/step-website
cd step-website/website
npm install
npx prisma generate
npx prisma db push
```

### Miljövariabler

Kopiera och fyll i `.env`:

```env
# Databas
DATABASE_URL="file:./dev.db"

# Session
SESSION_SECRET="minst-32-tecken-hemlig-nyckel"

# Admin-lösenord (bcrypt-hash)
ADMIN_PASSWORD_HASH=\$2b\$10\$...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (e-post)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@dindomän.se

# Publik URL (för Swish callback)
NEXT_PUBLIC_SITE_URL=https://dindomän.se
```

### Starta

```bash
npm run dev        # Utvecklingsserver → http://localhost:3000
npm run build      # Produktionsbygge
npm start          # Produktionsserver
```

### Betalningsleverantörer (admin)

1. Gå till `/admin/payments`
2. Aktivera önskad leverantör
3. Klistra in API-nycklar / certifikat
4. Spara — betalningsmetoden visas direkt i kassan

**Stripe webhook** (för lokal test): `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Swish certifikat** (konvertera p12 → Base64):
```bash
openssl base64 -in cert.p12 | tr -d '\n'
```

---

## E-posttriggers

| Händelse | Mall |
|----------|------|
| Ny kund registrerar sig | Välkomstmejl |
| Betalning bekräftad (Stripe/Swish) | Orderbekräftelse med leveransschema |
| Admin markerar leverans som skickad | Leveransavisering med spårningslänk |

---

## Tema

Webbplatsen stödjer **mörkt och ljust läge** via `next-themes`. Admin-panelen är alltid mörk oavsett inställning. Temat kan bytas med toggle-knappen i headern.

CSS-variabler definierade i `globals.css`:
- `--color-step-bg`, `--color-step-surface`, `--color-step-card`
- `--color-step-gold`, `--color-step-border`, `--color-step-muted`
- `--color-step-ink` (förgrund)

---

## Licens

Privat projekt — alla rättigheter förbehållna.
