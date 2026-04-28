/** Standardtexter (sv) — används vid seed / uppdatering av demo-innehåll */

export const siteDefaults = {
  siteName: "STEP",
  siteTagline: "Nikotinportioner med plan — från din nivå mot noll, i din takt.",
  navCtaLabel: "STARTA MIN PLAN",
  navCtaHref: "/shop",
  heroEyebrow: "PROGRAMMET",
  heroTitle: "Sluta med nikotin",
  heroTitleAccent: "på riktigt.",
  heroSubtitle:
    "STEP kombinerar tydliga styrkor med månadsleveranser och full kontroll. Ingen bindning — du pausar eller avslutar när du vill. Byggd för vardagen, inte för skuld.",
  heroCtaLabel: "STARTA DIN RESA",
  heroCtaHref: "/shop",
  heroBackgroundImage: "/images/step-hero-nature.png",
  shopTitle: "Välj din nivå",
  shopSubtitle:
    "Tre tydliga planer utgår från hur mycket du använder idag. Alla innehåller samma metod: strukturerad nedstegning, diskret leverans och möjlighet att justera längs vägen.",
  plansSectionTitle: "VÅRA PLANER",
  plansSectionSubtitle: "Hitta volymen som matchar dig — resten guidar vi dig genom.",
  includedTitle: "INGÅR I ALLA PLANER",
  footerLine: "Designad i Sverige. Producerad i Sverige.",
  footerBlurb:
    "STEP är ett konsumentprogram för nikotinportioner med planerad styrka över tid. Det ersätter inte samtal med vårdpersonal om du har hälsorelaterade frågor kring nikotin eller beroende.",
  copyrightText: "STEP",
  metaTitle: "STEP — Steg för steg mot mindre nikotin",
  metaDescription:
    "Prenumeration på nikotinportioner med tydlig plan, månadsleverans i neutral förpackning och flexibla uppsägningar. Välj din nivå och börja i din takt.",
  contactEmail: "support@step.example",
  contactPhone: "+46 8 123 45 67",
  contactHours: "Måndag–fredag 09:00–17:00 (CET)",
  contactCity: "STEP Sverige · Stockholm",
};

export const cmsPages: { slug: string; title: string; content: string }[] = [
  {
    slug: "how-it-works",
    title: "Så fungerar det",
    content: `
<p class="lead">STEP är uppbyggt kring en enkel idé: du ska alltid veta <strong>var du är</strong> i din nedtrappning och <strong>vad nästa månad innebär</strong> — utan att behöva planera själv varje vecka.</p>

<h2>Så här ser resan ut</h2>
<ol>
  <li><strong>Välj plan</strong> utifrån hur mycket du använder idag (10, 20 eller 30 burkar per månad).</li>
  <li><strong>Följ programmet</strong> — varje leverans följer din valda väg ned i styrka över tid, tills du når noll nikotin.</li>
  <li><strong>Justera när livet händer</strong> — pausa, hoppa över en månad eller ändra adress från ditt konto.</li>
</ol>

<h2>Leverans &amp; integritet</h2>
<p>Allt skickas i <strong>neutral ytterkartong</strong> utan genomskinlig reklam. Du får en bekräftelse när paketet är på väg och kan följa status i din orderhistorik.</p>

<h2>Vad STEP inte är</h2>
<p>STEP är inte sjukvård eller individuell rådgivning. Om du har oro kring hjärta, blodtryck, graviditet eller annat som kan påverkas av nikotin bör du prata med legitimerad vårdpersonal innan du ändrar dina vanor.</p>

<div class="callout">
  <strong>Kort sagt:</strong> du väljer nivå och tempo — vi levererar strukturen och portionerna som följer din plan, månad för månad.
</div>
`.trim(),
  },
  {
    slug: "about",
    title: "Om STEP",
    content: `
<p class="lead">STEP föddes ur en enkel frustration: det ska inte krävas en excel-tabell och tre appar för att <strong>trappa ner nikotin</strong> på ett sätt som känns rimligt i vardagen.</p>

<h2>Vårt uppdrag</h2>
<p>Vi vill göra det <strong>konkret och förutsägbart</strong> att gå från dagens användning mot noll — med tydliga steg, ärlig kommunikation och respekt för att livet inte alltid är linjärt.</p>

<h2>Sverige som utgångspunkt</h2>
<p>Produkt och varumärke är utvecklade med fokus på nordisk kvalitet och tydlig konsumentinformation. Vi tror på <strong>diskreta leveranser</strong>, <strong>öppna villkor</strong> och att du ska kunna avsluta utan krångel den dagen du är redo.</p>

<h2>Transparens</h2>
<p>På vår sajt hittar du alltid aktuell information om planer, leverans och kontaktvägar. Har du feedback som gör STEP bättre — tekniskt eller innehållsmässigt — vill vi höra det.</p>

<div class="callout">
  <strong>Varför “steg”?</strong> För att små, tydliga förändringar över tid ofta är lättare att hålla än stora löften över en natt. Ett steg i taget räcker.
</div>
`.trim(),
  },
  {
    slug: "faq",
    title: "Vanliga frågor",
    content: `
<p class="lead">Här samlar vi det vi oftast får frågor om kring leverans, bindning och hur programmet funkar.</p>

<h3>Finns det bindningstid?</h3>
<p><strong>Nej.</strong> Du kan pausa eller säga upp din plan när som helst via kontot. Eventuella leveranser som redan betalats och packats följer ordinarie villkor som visas i kassan.</p>

<h3>Hur ofta levereras det?</h3>
<p>Standard är <strong>månadsleverans</strong> i takt med din plan. Exakt datum kan variera något mellan månader beroende på helgdagar och transportör — du ser alltid nästa datum i din orderöversikt.</p>

<h3>Kan jag byta plan i efterhand?</h3>
<p>Ja, i många fall kan du <strong>uppgradera eller nedgradera</strong> volym (t.ex. från 10 till 20 burkar) om ditt behov ändras. Kontakta support om du redan påbörjat en leveransserie så hjälper vi dig utan dubbeldebitering där det är möjligt.</p>

<h3>Vad står på paketet utifrån?</h3>
<p>Ytteremballage är <strong>neutralt</strong> — inga stora logotyper som avslöjar innehållet för grannar eller kollegor.</p>

<h3>Är STEP samma sak som att sluta “kallturkey”?</h3>
<p>Nej. STEP bygger på <strong>gradvis minskning</strong> av nikotin över tid. För vissa passar kallturkey bättre — det är också okej. Välj det som matchar dig och din situation.</p>

<h3>Hur når jag support?</h3>
<p>Skriv till oss på den mejladress som finns under <a href="/contact">Kontakt</a> och i sidfoten. Vi återkommer normalt inom <strong>1–2 arbetsdagar</strong>.</p>
`.trim(),
  },
  {
    slug: "contact",
    title: "Kontakt",
    content: `
<p class="lead">Har du frågor om din order, faktura eller hur programmet funkar? <strong>Vi finns här</strong> — inget ärende är för litet.</p>

<h2>Snabbast svar</h2>
<p>Mejla <strong>support</strong> med ditt ordernummer (om du har ett) så kan vi hitta dig direkt. Beskriv kort vad det gäller så slipper du onödig ping-pong.</p>

<h2>Öppettider</h2>
<p>Vi bemannar support <strong>vardagar</strong> enligt tiderna i sidfoten. Under storhelg kan svarstiden vara något längre.</p>

<h2>Återförsäljare &amp; press</h2>
<p>Är du butik, distributör eller journalist? Skriv “Wholesale” respektive “Press” i ämnesraden så dirigeras ärendet rätt internt.</p>

<div class="callout">
  <strong>Tips:</strong> lägg gärna till telefonnummer du använt i kassan och postnummer — då går det snabbare att slå upp leveransen.
</div>

<p class="mt-8"><strong>Mejl:</strong> använd adressen i sidfoten — den styr du under <em>Admin → Webbplats → kontaktmejl</em>.</p>
`.trim(),
  },
];
