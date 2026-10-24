// Innehållsfil för Sense (Collision Compass). Texter kan redigeras här utan att röra koden.
// Strukturen bygger på Dans Collision Compass, generaliserad från fastighet till verksamhet.
// Forskningsstöd per skede: se CLAUDE.md och Teoriplattformen (teori/).
window.CONTENT = {
 "version": "prototyp v0.2",
 "titel": "Sense",
 "verktyg": "Dialogverktyg — Learning Curve Approach",
 "undertitel": "Collision Compass: var möter framtiden er verksamhet?",
 "upphov": "© Engströms Mickla AB 2026",
 "integritet": "Allt ni skriver sparas bara i er webbläsare och i de filer ni själva laddar ner. Ingenting skickas till oss eller någon annan.",
 "intro": [
  "Sense är en strukturerad omvärldsövning. Målet är inte att förutsäga framtiden, utan att tillsammans förstå vad som håller på att förändras och vilka antaganden det utmanar.",
  "Resultatet är en Collision Map: de framtidskollisioner där omvärldens tryck möter det som i dag bär er verksamhet. Den blir underlaget för See."
 ],
 "skeden": [
  { "nr": 0, "namn": "Fokus", "tid": "15 min" },
  { "nr": 1, "namn": "Signaler och trender", "tid": "40 min" },
  { "nr": 2, "namn": "Påverkan och säkerhet", "tid": "20 min" },
  { "nr": 3, "namn": "Hur trenderna driver varandra", "tid": "20 min" },
  { "nr": 4, "namn": "Scenarier", "tid": "35 min" },
  { "nr": 5, "namn": "Det som bär verksamheten", "tid": "20 min" },
  { "nr": 6, "namn": "Vindtunnel", "tid": "35 min" },
  { "nr": 7, "namn": "Syntes", "tid": "20 min" },
  { "nr": 8, "namn": "Collision Map", "tid": "20 min" }
 ],
 "tidstext": "Räkna med en förmiddag, ungefär 3 timmar och 45 minuter med paus. Verktyget är gjort för en grupp vid en gemensam skärm, med en facilitator som håller i tangentbordet.",

 "fokus": {
  "rubrik": "Vad vill ni förstå?",
  "text": "Ett bra omvärldsarbete börjar i något ni genuint undrar över eller oroas av. Kryssa de utmaningar som är viktigast för er just nu. Valen styr vilka områden som föreslås i nästa skede.",
  "egenEtikett": "Egen utmaning (frivilligt)",
  "fragaEtikett": "Er fokusfråga",
  "fragaHjalp": "Verktyget föreslår en fråga utifrån era val. Skriv om den så att den låter som ni.",
  "fragaMall": "Hur kan {lista} påverka det som bär {org} fram till {ar}?",
  "tillampningHjalp": "Ska ni använda framtiderna i en tillämpning, till exempel fastighetens värdeutveckling, skriv fokusfrågan om den: Hur kan … påverka värdet på [fastigheten] fram till [år]?",
  "horisontEtikett": "Hur långt fram tittar ni?",
  "horisontHjalp": "Längre horisont ger större osäkerhet och friare tänkande. Tio år är ett vanligt val.",
  "horisonter": [5, 10, 15]
 },
 "utmaningar": [
  { "id": "klimat", "namn": "Klimatkrav och fossilfrihet", "omraden": ["hallbarhet", "energi", "politik"] },
  { "id": "cirk", "namn": "Cirkularitet och resurser", "omraden": ["cirk", "hallbarhet", "ekonomi"] },
  { "id": "digital", "namn": "Digitalisering, data och AI", "omraden": ["digital", "teknik", "larande"] },
  { "id": "kompetens", "namn": "Kompetensförsörjning", "omraden": ["demografi", "larande", "socialt"] },
  { "id": "lonsamhet", "namn": "Lönsamhet och produktivitet", "omraden": ["ekonomi", "teknik", "digital"] },
  { "id": "konjunktur", "namn": "Konjunktur, räntor och finansiering", "omraden": ["ekonomi", "politik"] },
  { "id": "regler", "namn": "Regelverk och rapporteringskrav", "omraden": ["politik", "hallbarhet", "digital"] },
  { "id": "energi", "namn": "Energi och effekt", "omraden": ["energi", "hallbarhet"] },
  { "id": "anpassning", "namn": "Klimatanpassning och resiliens", "omraden": ["hallbarhet", "ekonomi", "politik"] },
  { "id": "beredskap", "namn": "Försörjningsberedskap och leveranskedjor", "omraden": ["ekonomi", "cirk", "politik"] },
  { "id": "kunder", "namn": "Kundernas behov och nya affärsmodeller", "omraden": ["teknik", "flex", "socialt"] },
  { "id": "demografi", "namn": "Demografi, boende och livsstil", "omraden": ["demografi", "flex", "mobilitet"] },
  { "id": "social", "namn": "Social hållbarhet och trygghet", "omraden": ["socialt", "halsa", "mobilitet"] },
  { "id": "fastighet", "namn": "Fastigheters värde och användning", "omraden": ["flex", "hallbarhet", "ekonomi", "digital", "mobilitet"], "tillampning": "fastighet", "fragaMall": "Hur kan {lista} påverka värdet på fastigheten fram till {ar}?", "standard": "förändringar i omvärlden",
    "forstaExempel": { "flex": "Efterfrågan på kontorsytor förändras", "hallbarhet": "Klimatrisker prissätts", "ekonomi": "Fastighetsvärden blir känsligare för ränta och risk", "digital": "Uppkoppling och digitala tjänster tas för givna" } },
  { "id": "kunskap", "namn": "Kunskapsföretagets affärsmodell", "omraden": ["teknik", "digital", "demografi", "larande", "hallbarhet"], "tillampning": "kunskapsforetag", "fragaMall": "Hur kan {lista} påverka hur vi skapar och tar betalt för kundvärde fram till {ar}?", "standard": "AI och förändrade kundbehov",
    "forstaExempel": { "teknik": "Betalning för värde ersätter betalning för tid", "digital": "Kunskapsarbete frikopplas från arbetstid", "demografi": "Vägen in i yrket smalnar", "hallbarhet": "Den dubbla omställningen blir kundens huvudfråga" } },
  { "id": "samverkan", "namn": "Samverkan och industrialisering i värdekedjan", "omraden": ["teknik", "larande", "digital"] }
 ],

 "signaler": {
  "rubrik": "Signaler och trender",
  "text": "En signal är något ni faktiskt kan se i omvärlden: ett beteende, en nyhet, ett beslut, en teknik eller en händelse. En trend är en möjlig riktning som flera signaler tillsammans pekar mot. Ändra, stryk och lägg till. Under varje område finns fler exempel att hämta. Det viktiga är inte att få allt rätt, utan att börja se mönster.",
  "forslagRubrik": "Områden kopplade till er fokusfråga",
  "ovrigaRubrik": "Fler områden",
  "minText": "Ha minst fem trender med innan ni går vidare."
 },
 "omraden": [
  { "id": "hallbarhet", "namn": "Hållbarhet och klimat", "exempel": [
    { "signal": "Klimatdeklarationer för nya byggnader, diskussion om gränsvärden för klimatpåverkan", "trend": "Klimatpåverkan blir avgörande för värde och lönsamhet" },
    { "signal": "Stigande försäkringspremier, krav på klimatriskanalyser", "trend": "Klimatrisker prissätts" },
    { "signal": "Beställare kräver fossilfria arbetsplatser och transporter", "trend": "Fossilfrihet blir ett krav i upphandling" },
    { "signal": "EU:s byggnadsdirektiv kräver att de sämst presterande byggnaderna energieffektiviseras", "trend": "Energiprestanda skiljer ut byggnader som halkar efter" },
    { "signal": "Kunder behöver stöd med både klimatkrav och digitalisering", "trend": "Den dubbla omställningen blir kundens huvudfråga" }
  ] },
  { "id": "energi", "namn": "Energi och försörjning", "exempel": [
    { "signal": "Solceller, lokala elnät, energilagring, effektbrist i storstäder", "trend": "Från central till lokal energiförsörjning" },
    { "signal": "Effektavgifter, elpriser som svänger kraftigt", "trend": "Flexibel elanvändning blir en kostnadsfråga" },
    { "signal": "Eldrivna arbetsmaskiner och transporter", "trend": "Byggande och logistik elektrifieras" }
  ] },
  { "id": "cirk", "namn": "Cirkularitet och material", "exempel": [
    { "signal": "Återbrukskrav, byggdelshubbar, materialpass", "trend": "Återbruk blir standard" },
    { "signal": "Krav på demonterbarhet och livscykelanalyser", "trend": "Byggnader utformas för att kunna tas isär" },
    { "signal": "Brist på råvaror, stigande materialpriser", "trend": "Material blir en strategisk resurs" }
  ] },
  { "id": "digital", "namn": "Digitalisering och AI", "exempel": [
    { "signal": "AI-stöd i projektering och drift, generativ design, digitala tvillingar", "trend": "Verksamheten blir datadriven och mer automatiserad" },
    { "signal": "Krav på informationsleveranser enligt standarder, BIM i förvaltning", "trend": "Information blir en leverans i sig" },
    { "signal": "Cyberattacker mot beställare och leverantörer", "trend": "Informationssäkerhet blir en affärsrisk" },
    { "signal": "Hyresgäster förväntar sig fiber, wifi, digitala lås och bokning", "trend": "Uppkoppling och digitala tjänster tas för givna" },
    { "signal": "AI gör utredning, analys och projektering på timmar i stället för veckor", "trend": "Kunskapsarbete frikopplas från arbetstid" }
  ] },
  { "id": "mobilitet", "namn": "Mobilitet och plats", "exempel": [
    { "signal": "Delad mobilitet, färre parkeringar, distansarbete", "trend": "Mobilitet som tjänst förändrar platsers värde" },
    { "signal": "Mobilitetsåtgärder i stället för parkeringsnormer", "trend": "Planering utgår från resor, inte bilar" },
    { "signal": "Hemleveranser och fler lätta lastbilar i städerna", "trend": "Citylogistik blir en planeringsfråga" }
  ] },
  { "id": "flex", "namn": "Flexibilitet och användning", "exempel": [
    { "signal": "Korta kontrakt, delade ytor, tjänster i stället för produkter", "trend": "Från ägande till användning" },
    { "signal": "Tomma kontor, nya arbetsmönster", "trend": "Ombyggnad och omvandling ersätter nybyggnad" },
    { "signal": "Krav på flexibla planlösningar", "trend": "Byggnader måste klara flera användningar över tid" },
    { "signal": "Hybridarbete, lägre beläggning på kontor, fler mötesytor", "trend": "Efterfrågan på kontorsytor förändras" }
  ] },
  { "id": "ekonomi", "namn": "Ekonomi och geopolitik", "exempel": [
    { "signal": "Ränteoro, materialbrist, handelshinder, krigshot", "trend": "Resiliens blir viktigare än effektivitet" },
    { "signal": "Färre byggstarter, pressade marginaler", "trend": "Lönsamheten pressas i hela värdekedjan" },
    { "signal": "Gröna lån, hållbarhetskrav från banker och investerare", "trend": "Kapital styrs mot hållbara projekt" },
    { "signal": "Högre räntor och avkastningskrav, nedskrivna fastighetsvärden", "trend": "Fastighetsvärden blir känsligare för ränta och risk" }
  ] },
  { "id": "socialt", "namn": "Sociala och kulturella värden", "exempel": [
    { "signal": "Krav på trygghet, platsidentitet och gemenskap", "trend": "Social hållbarhet blir en värdeskapare" },
    { "signal": "Segregation och otrygghet i utsatta områden", "trend": "Platsutveckling blir ett socialt uppdrag" },
    { "signal": "Medborgardialoger, lokala protester mot projekt", "trend": "Acceptans blir en förutsättning för att bygga" }
  ] },
  { "id": "larande", "namn": "Lärande och innovation", "exempel": [
    { "signal": "Testbäddar, samverkan med akademi, innovationsupphandling", "trend": "Förmågan att lära blir en konkurrensfaktor" },
    { "signal": "Piloter och projekt vars resultat aldrig når den ordinarie verksamheten", "trend": "Förmågan att ta emot nytt avgör nyttan av utveckling" },
    { "signal": "Ny kunskap utvecklas snabbare än utbildningarna hinner med", "trend": "Lärande i arbetet blir avgörande" }
  ] },
  { "id": "teknik", "namn": "Teknik och affärsmodeller", "exempel": [
    { "signal": "Data säljs som tjänst, AI ersätter debiterbara timmar, plattformar i värdekedjan", "trend": "Affären blir digital och insiktsdriven" },
    { "signal": "Mer prefabricering och industriellt byggande", "trend": "Byggandet industrialiseras" },
    { "signal": "Robotar och automation på byggarbetsplatsen", "trend": "Tunga och farliga moment automatiseras" },
    { "signal": "Kunder efterfrågar fastpris, abonnemang och betalning för resultat", "trend": "Betalning för värde ersätter betalning för tid" },
    { "signal": "Programvaruföretag, AI-bolag och frilansnätverk tar delar av uppdragen", "trend": "Uppdragen bryts upp i moduler" }
  ] },
  { "id": "demografi", "namn": "Demografi och livsstil", "exempel": [
    { "signal": "Pensionsavgångar, åldrande befolkning, urbanisering", "trend": "Brist på arbetskraft och nya behov av bostäder och lokaler" },
    { "signal": "Färre unga söker yrkesutbildningar inom bygg", "trend": "Kompetensförsörjningen blir en flaskhals" },
    { "signal": "Fler ensamhushåll, äldre som bor kvar hemma", "trend": "Nya behov av bostäder och service" },
    { "signal": "Färre ingångsjobb i de yrken som AI påverkar mest", "trend": "Vägen in i yrket smalnar" }
  ] },
  { "id": "halsa", "namn": "Hälsa och välbefinnande", "exempel": [
    { "signal": "Fokus på inomhusmiljö, psykosocial arbetsmiljö, sjukskrivningstal", "trend": "Hälsa blir ett krav på miljöer och arbetsplatser" },
    { "signal": "Värmeböljor och överhettade byggnader", "trend": "Klimatanpassning blir en hälsofråga" },
    { "signal": "Krav på giftfria material", "trend": "Materialval granskas för sina hälsoeffekter" }
  ] },
  { "id": "politik", "namn": "Politik och styrning", "exempel": [
    { "signal": "EU:s taxonomi, hållbarhetsrapportering, nya upphandlingskrav", "trend": "Styrning genom regler och rapportering ökar" },
    { "signal": "Förslag om förenklade plan- och byggprocesser", "trend": "Snabbare processer men tydligare ansvar" },
    { "signal": "Krav på beredskap och skydd av samhällsviktig verksamhet", "trend": "Försörjningsberedskap blir en del av uppdraget" }
  ] }
 ],


 "bedomning": {
  "rubrik": "Påverkan och säkerhet",
  "text": "Bedöm varje trend på två sätt: hur stor påverkan den kan få på er verksamhet, och hur säkert det är att den slår igenom inom er tidshorisont.",
  "paverkan": ["Ingen", "Liten", "Märkbar", "Stor", "Omvälvande"],
  "sakerhet": ["Ingen vet", "Osäker", "Kanske", "Trolig", "Helt säker"],
  "klasser": {
   "kritisk": { "namn": "Kritisk osäkerhet", "text": "Stor påverkan och osäker utveckling. Det är de här trenderna som skiljer framtiderna åt, och de används för att bygga scenarier." },
   "forutbestamd": { "namn": "Förutbestämt element", "text": "Stor påverkan och säker utveckling. Förändringen är redan i rörelse, även om följderna inte märks än. Den ingår i alla scenarier." },
   "bevaka": { "namn": "Bevaka", "text": "Märkbar påverkan. Värd att följa, men inte i centrum för scenarierna." },
   "ignorera": { "namn": "Lägg åt sidan", "text": "Liten påverkan på er verksamhet just nu." }
  }
 },

 "urval": {
  "rubrik": "Välj trender för påverkansmatrisen",
  "text": "Nu undersöker ni hur trenderna påverkar varandra. Verktyget föreslår de trender som har störst påverkan och mest osäker utveckling. Ni kan byta. Välj tre till fem.",
  "forutbestamdaText": "Förutbestämda element behöver inte vara med här. De finns med i alla scenarier ändå."
 },
 "fragor": {
  "rubrik": "Hur driver trenderna varandra?",
  "fraga": "Om {a} tar fart, hur mycket driver det {b}?",
  "skala": ["Ingen påverkan", "Svag, indirekt eller fördröjd", "Medelstark", "Stark eller direkt"],
  "hjalp": "Tänk bara i en riktning: från den första trenden till den andra. Den omvända riktningen kommer som en egen fråga."
 },
 "matris": {
  "rubrik": "Vilka trender driver utvecklingen?",
  "text": "Aktiv summa visar hur mycket en trend driver de andra. Passiv summa visar hur mycket den påverkas av dem. Tillsammans visar de vilken roll varje trend spelar i systemet.",
  "kategorier": {
   "drivande": { "namn": "Drivande", "text": "{trend} driver de andra men påverkas lite av dem. Den är en hävstång i systemet och passar som axel i era scenarier." },
   "kritisk": { "namn": "Kritisk", "text": "{trend} både driver och påverkas starkt. Den är instabil: små förändringar kan förstärkas åt båda hållen. Följ den noga." },
   "paverkad": { "namn": "Påverkad", "text": "{trend} påverkas mycket av de andra men driver lite själv. Den är mer en följd än en orsak och visar hur utvecklingen slår igenom." },
   "buffrande": { "namn": "Buffrande", "text": "{trend} hänger löst ihop med de andra. Den styr inte systemet, men kan ändå vara viktig för er." }
  }
 },

 "axlar": {
  "rubrik": "Välj två axlar för scenarierna",
  "text": "Två kritiska osäkerheter bildar axlarna i ett scenariokors, och kombinationerna ger fyra framtider. Verktyget föreslår de två mest drivande osäkra trenderna. Det är ert val.",
  "motivering": "Varför valde ni andra axlar än förslaget?",
  "varningSaker": "{trend} bedömdes som säker. En säker trend skiljer inte framtiderna åt, eftersom den ingår i alla scenarier. Överväg en annan.",
  "varningBeroende": "{a} driver {b} starkt (svar 3 i påverkansmatrisen). När axlarna hänger ihop blir två av de fyra framtiderna svåra att tro på. Överväg en annan kombination.",
  "andpunkterRubrik": "Vad betyder ändpunkterna?",
  "andpunkterText": "Beskriv kort hur det ser ut om trenden går svagt respektive starkt. Det gör scenarierna begripliga och avslöjar tidigt om en axel inte fungerar.",
  "svag": "Svag utveckling",
  "stark": "Stark utveckling"
 },
 "scenarier": {
  "rubrik": "Fyra framtider",
  "text": "Ge varje framtid ett namn och en kort berättelse om hur det ser ut där. Använd byggstenarna: de förutbestämda elementen finns i alla fyra, och de övriga trenderna kan färga berättelserna.",
  "byggstenar": "Byggstenar",
  "namn": "Namn",
  "berattelse": "Kort berättelse",
  "andrade": "Axlarna har ändrats sedan ni namngav framtiderna. Kontrollera att namnen och berättelserna fortfarande stämmer med kombinationerna."
 },
 "varden": {
  "rubrik": "Vad bär er verksamhet i dag?",
  "text": "Markera de delar som är viktigast för att er verksamhet ska fungera och lyckas. Skriv kort vad det är hos er, och vilket bärande antagande det vilar på: vad måste vara sant för att den här delen ska fortsätta bära?",
  "hosOss": "Hos oss",
  "antagande": "Bärande antagande",
  "minText": "Markera minst tre bärande delar.",
  "lista": [
   { "id": "erbjudande", "namn": "Erbjudande och kundvärde", "text": "Det ni levererar och varför kunderna väljer er.", "exempel": "Kunderna betalar för det vi levererar i dag" },
   { "id": "kunder", "namn": "Kunder och marknad", "text": "Vilka ni skapar värde för.", "exempel": "Våra kunder finns kvar och har samma behov" },
   { "id": "relationer", "namn": "Relationer och kanaler", "text": "Hur ni når och behåller kunder.", "exempel": "Långa relationer väger tyngre än pris" },
   { "id": "kompetens", "namn": "Kompetens och medarbetare", "text": "Det ni kan och de som kan det.", "exempel": "Vi kan rekrytera den kompetens vi behöver" },
   { "id": "processer", "namn": "Processer och produktion", "text": "Hur ni arbetar och levererar.", "exempel": "Våra arbetssätt är tillräckligt effektiva" },
   { "id": "partners", "namn": "Partners och leverantörer", "text": "De ni är beroende av.", "exempel": "Material och tjänster finns att köpa när vi behöver dem" },
   { "id": "data", "namn": "Data och digital infrastruktur", "text": "Information, system och verktyg.", "exempel": "Vår data räcker för att fatta bra beslut" },
   { "id": "ekonomi", "namn": "Ekonomi och finansiering", "text": "Intäkter, kostnader och kapital.", "exempel": "Finansiering går att få till rimliga villkor" },
   { "id": "fortroende", "namn": "Förtroende och varumärke", "text": "Hur andra ser på er.", "exempel": "Vårt namn står för kvalitet" },
   { "id": "hallbarhet", "namn": "Hållbarhet och regelefterlevnad", "text": "Krav ni lever upp till.", "exempel": "Vi klarar kraven utan stora förändringar" }
  ]
 },
 "vind": {
  "rubrik": "Vindtunnel",
  "text": "Pröva de bärande delarna mot framtiden. Allt står sig tills ni säger något annat. Markera det som försvagas eller stärks, och skriv kort varför.",
  "lagen": ["Försvagas", "Står sig", "Stärks"],
  "orsak": "Varför?",
  "utvecklingFraga": "Hur står sig verksamheten som helhet i den här framtiden?",
  "utveckling": ["Försämras", "Står sig", "Förbättras"],
  "atgarder": "Möjliga åtgärder för att minska riskerna eller stärka verksamheten i den här framtiden"
 },
 "syntes": {
  "rubrik": "Vad återkommer oavsett framtid?",
  "text": "Målet är inte att förutsäga, utan att se vad som gäller i flera framtider. Det som försvagas i flera scenarier är en sårbarhet oavsett hur det blir.",
  "sarbarheter": "Försvagas i flera framtider",
  "styrkor": "Stärks i flera framtider",
  "inga": "Ingen bärande del försvagas i mer än en framtid.",
  "monster": "Gemensamma mönster: återkommande drivkrafter, risker och möjligheter",
  "robusta": "Robusta åtgärder: sådant som är klokt i flera framtider (en per rad)",
  "signalerRubrik": "Signaler att bevaka",
  "signalerText": "Vilka tecken skulle visa att utvecklingen går mot respektive framtid?",
  "samlad": "Samlad bedömning: hur står sig verksamheten på längre sikt?",
  "osakert": "Det här är vi fortfarande osäkra på"
 },
 "karta": {
  "rubrik": "Collision Map",
  "text": "En framtidskollision är där omvärldens tryck möter ett antagande som verksamheten vilar på. Välj en till tre kollisioner att ta vidare. Verktyget föreslår utifrån de bärande delar som försvagas.",
  "forslag": "Förslag",
  "laggTill": "Ta med",
  "egen": "Lägg till egen kollision",
  "namn": "Kollisionen i några ord",
  "antagande": "Antagandet som utmanas",
  "tryck": "Tryck: hur starkt påverkar den er verksamhet?",
  "tryckSkala": ["Knappt", "Lite", "Märkbart", "Starkt", "Hotar kärnan"],
  "tempo": "Tempo: när slår den igenom, jämfört med hur långt fram ni planerar?",
  "tempoSkala": ["Redan nu", "Inom 1 till 3 år", "Inom 3 till 10 år", "Bortom 10 år"],
  "synlighet": "Synlighet: hur mycket uppmärksammas den hos er i dag?",
  "synlighetSkala": ["Ingen talar om den", "Någon enstaka", "Diskuteras ibland", "Diskuteras ofta", "På ledningens agenda"],
  "doldNot": "Låg synlighet och högt tryck: en dold kollision. Den förtjänar extra uppmärksamhet.",
  "scenarioRubrik": "Vilken framtid tar ni med till See?",
  "scenarioText": "I See bedömer ni hur redo ni är för en bestämd framtid. Välj den som prövar verksamheten hårdast, inte den mest troliga. Scenarier är inga prognoser.",
  "scenarioMotivering": "Varför valde ni en annan framtid än förslaget?",
  "max": "Högst tre kollisioner."
 },
 "forarbete": {
  "rubrik": "Förarbete på egen hand",
  "text": "Som alternativ till att samla signaler tillsammans kan varje deltagare göra skede 0 och 1 själv före workshopen och spara en fil. Facilitatorn läser sedan in allas filer i skede 1.",
  "sparaRubrik": "Klart med ert förarbete?",
  "sparaText": "Spara filen och skicka den till facilitatorn. Ni behöver inte gå vidare härifrån.",
  "hamtaRubrik": "Deltagarnas förarbete",
  "hamtaText": "Läs in de filer deltagarna har sparat. Deras trender läggs till här, och dubbletter hoppas över.",
  "hamtaKnapp": "Läs in förarbete",
  "resultat": "{n} trender från {d} lades till. {dubbletter} dubbletter hoppades över.",
  "fran": "Från"
 },
 "omOvningen": {
  "bedomning": { "begrepp": "Kritisk osäkerhet", "text": "Här skiljs två slags trender åt. Kritiska osäkerheter har stor påverkan men osäker utveckling och bygger scenarierna. Förutbestämda element är förändringar som redan är i rörelse och finns med i alla framtider." },
  "urval": { "begrepp": "Påverkansmatris", "text": "En påverkansmatris visar hur trenderna driver varandra. Ni svarar på en fråga i taget, och verktyget räknar ut vilka trender som driver utvecklingen och vilka som mest påverkas." },
  "axlar": { "begrepp": "Axel (i scenariokorset)", "text": "Ett scenariokors bygger på två kritiska osäkerheter. Varje axel går från svag till stark utveckling, och de fyra kombinationerna blir fyra möjliga framtider. Scenarier är inga prognoser utan ett sätt att pröva antaganden." },
  "varden": { "begrepp": "Bärande del", "text": "Bärande delar är det verksamheten vilar på, hämtade ur affärsmodellens byggstenar. Varje del vilar på ett bärande antagande: det som måste vara sant för att den ska fortsätta bära." },
  "vind": { "begrepp": "Vindtunnel", "text": "I vindtunneln prövas de bärande delarna mot varje framtid, en framtid i taget, precis som en modell prövas i en vindtunnel." },
  "karta": { "begrepp": "Collision Map", "text": "Collision Map samlar de framtidskollisioner ni tar vidare. Tryck, tempo och synlighet visar var lärandet behöver börja. Den blir underlaget för See." }
 },
 "parkering": {
  "rubrik": "Parkering",
  "text": "Tankar att hantera senare. Kommer med i rapporten."
 },
 "rapport": {
  "rubrik": "Rapport",
  "sammanfattning": {
   "rubrik": "Sammanfattning",
   "inledning": "{org} har undersökt frågan ”{fraga}” med blicken {horisont} år framåt.",
   "grund": "Arbetet utgick från {n} trender. Två av dem är både osäkra och drivande, och de bildar axlarna i fyra möjliga framtider: axel A, ”{a}”, och axel B, ”{b}”.", "grundEget": "Arbetet utgick från {n} trender. Gruppen valde två av dem som axlar i fyra möjliga framtider: axel A, ”{a}”, och axel B, ”{b}”.",
   "forutbestamda": "Oavsett vilken framtid som blir verklighet räknar organisationen med att {lista} fortsätter.",
   "framtiderRubrik": "Fyra framtider och vad de betyder för {org}",
   "utveckling": { "-1": "försämras verksamhetens ställning", "0": "står verksamheten sig", "1": "förbättras verksamhetens ställning" },
   "utvecklingSaknas": "är verksamhetens ställning inte bedömd",
   "framtid": "I ”{namn}” (A {a}, B {b}) {utv}.",
   "forsvagas": "Bär sämre: {lista}.",
   "starks": "Bär bättre: {lista}.",
   "sarbar": "Det som bär sämre i flera framtider, och därför är en sårbarhet oavsett hur det blir, är {lista}.",
   "ingenSarbar": "Ingen av verksamhetens bärande delar försvagas i mer än en framtid. Det kan tyda på en robust position, men också på att bedömningen behöver prövas igen.",
   "styrka": "Det som bär bättre i flera framtider är {lista}.",
   "kollisioner": "Den viktigaste slutsatsen är var framtiden krockar med verksamhetens antaganden. Gruppen har pekat ut {antal}:",
   "vidare": "Framtiden ”{scen}” tas vidare till See, där organisationen bedömer hur redo den är att ta emot den.",
   "slutsatserRubrik": "De viktigaste slutsatserna",
   "kollision": "Utmanar antagandet ”{ant}”.",
   "kollisionMatt": "Tryck: {tryck}. Slår igenom {tempo}.",
   "dold": "Den uppmärksammas knappt i dag, vilket gör den till en dold kollision.",
   "robustaTitel": "Robusta åtgärder",
   "robustaText": "Klokt i flera framtider: {lista}."
  },
  "nastaRubrik": "Nästa steg: See",
  "nastaText": "I See bedömer ni hur redo organisationen är att ta emot den framtid ni valt: förmåga, mandat och vilja. Scenariot och kollisionerna följer med.",
  "tillSee": "Gå vidare till See",
  "tillampningText": "Vill ni använda framtiderna för en särskild fråga, till exempel värdet på en fastighet, finns Utvalda tillämpningar. Resultatet följer med till See.",
  "tillTillampning": "Utvalda tillämpningar"
 }
};
