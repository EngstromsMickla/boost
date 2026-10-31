// Innehållsfil för slutsidan. Texter kan redigeras här utan att röra koden.
// Slutsidan visas när Sense, See och Shift är gjorda i följd. Den läser sparfilen från Shift, som bär med sig hela kedjan.
window.CONTENT = {
 "version": "prototyp v0.7",
 "titel": "Slutsida",
 "verktyg": "Dialogverktyg — Learning Curve Approach",
 "upphov": "© Engströms Mickla AB 2026",
 "undertitel": "Huvuddragen av arbetet med Sense, See och Shift",
 "integritet": "Allt ni skriver sparas bara i er webbläsare och i de filer ni själva laddar ner. Ingenting skickas till oss eller någon annan.",

 "skedeIntro": { "namn": "Slutsidan", "vad": "Ni ser de tre faserna vägas samman: trycket från Sense, förmågan från See och rörelsen från Shift, med framtidsberedskap, lärandekurvan och slutrekommendationer.", "varfor": "Var för sig visar modulerna en del av bilden. Tillsammans svarar de på vad som behöver hända i er organisation för att det nya ska tas emot.", "hur": "Läs sammanfattning, analys och förslag. Jämför läget för framtidsberedskap med var ni står på lärandekurvan. Ladda ner slutrapporten som PDF.", "vem": "Ledningsgruppen, gärna tillsammans med dem som har gjort försöken i Shift.", "leder": "En ny lärperiod i Shift, och efter en tid en ny runda med Sense och See för att se om läget har förändrats." },

 "start": {
  "text": "Slutsidan väger samman de tre faserna: vad som förändras (Sense), hur redo organisationen är att ta emot det (See) och vilken rörelse som har kommit igång (Shift). Den bygger på sparfilen från Shift, som bär med sig resultaten från Sense och See.",
  "oppna": "Öppna sparfil från Shift",
  "senaste": "Visa senaste slutsida",
  "saknasRubrik": "Kedjan är inte hel",
  "saknasText": "Slutsidan förutsätter att Sense, See och Shift är gjorda i följd, så att resultaten hänger ihop. Den här filen saknar {lista}. Modulrapporterna räcker när en eller två faser är gjorda.",
  "saknas": { "sense": "resultaten från Sense", "see": "resultaten från See", "shift": "en Shift-körning" },
  "fel": "Slutsidan behöver en sparfil från Shift. Öppna Shift, gör klart arbetet och gå vidare till slutsidan därifrån, eller spara Shift-filen och öppna den här."
 },

 "kedjaRubrik": "Kedjan",
 "faser": {
  "sense": { "namn": "Sense", "fraga": "Vad förändras?" },
  "see": { "namn": "See", "fraga": "Hur redo är vi?" },
  "shift": { "namn": "Shift", "fraga": "Vad har vi gjort?" }
 },

 "beredskap": {
  "rubrik": "Framtidsberedskap",
  "om": "Framtidsberedskap är ett relativt mått: förmågan att ta emot förändring i förhållande till hur stort trycket är. Företag vars beredskap motsvarar trycket har visat sig klara sig bättre över tid (Rohrbeck & Kum 2018). Här jämförs trycket från Sense med lärandeindex från See.",
  "behovNamn": ["Lågt", "Måttligt", "Högt"],
  "formagaNamn": ["Låg", "Måttlig", "Hög"],
  "behovAxel": "Tryck från omvärlden (Sense)",
  "formagaAxel": "Förmåga att ta emot (See)",
  "lagen": {
   "over": { "namn": "Mer förberedd än trycket kräver", "text": "Förmågan att ta emot förändring är högre än det tryck ni har identifierat. Det är inte en styrka i sig: i forskningen klarade sig företag i det här läget inte bättre än de vars beredskap motsvarade trycket, eftersom kraften lätt läggs på fel saker (Rohrbeck & Kum 2018). Pröva om trycket är underskattat, och rikta förmågan mot de kollisioner som faktiskt finns." },
   "vaksam": { "namn": "Vaksam", "text": "Förmågan att ta emot förändring motsvarar trycket. Håll den vaksam: följ signalerna från Sense och pröva igen när de ändras." },
   "sarbar": { "namn": "Sårbar", "text": "Trycket är något större än förmågan att ta emot det. Det är där fortsatta trimförsök gör mest nytta." },
   "fara": { "namn": "I fara", "text": "Trycket är betydligt större än förmågan att ta emot det. Prioritera det som håller tillbaka och ge försöken tydligt mandat och stöd från ledningen." }
  },
  "grund": "Trycket bedöms som {behov} eftersom den starkaste kollisionen, ”{kollision}”, har tryck {tryck} av 5 och slår igenom {tempo}. Förmågan bedöms som {formaga} utifrån lärandeindex {index} av 4."
 },

 "kurva": {
  "rubrik": "Har ni kommit upp på er lärandekurva?",
  "om": "Organisationer med samma erfarenhet lär sig i olika takt. Det som avgör är om försöken följs upp, om lärdomarna delas och förs in i arbetssätt, och om riktningen prövas (Pisano, Bohmer & Edmondson 2001; Zollo & Winter 2002). Värderingen bygger på fyra tecken från Shift. De räknas inte samman till ett tal: omdömet visar hur många av dem som är uppfyllda, och uppför kurvan förutsätter alla fyra.",
  "faser": ["Oro", "Insikt", "Rörelse", "Fäste"],
  "kriterier": [
   { "id": "avlast", "namn": "Försöken har genomförts och följts upp", "uppfyllt": "{n} kursavläsningar.", "delvis": "En kursavläsning hittills.", "ej": "Inga kursavläsningar än." },
   { "id": "rorelse", "namn": "Mottagningsförmågan har rört sig", "uppfyllt": "Axeln har stärkts för {upp} av {n} lärandefrågor, minst hälften.", "delvis": "Axeln har stärkts för {upp} av {n} lärandefrågor, färre än hälften.", "ej": "Ingen axel har stärkts än." },
   { "id": "faste", "namn": "Lärdomarna har fått fäste", "uppfyllt": "Lärdomar har förts in i arbetssätt (antal: {inforda}).", "delvis": "Lärdomar har delats (antal: {delade}), men ingen har förts in i arbetssätt än.", "ej": "Lärdomarna stannar hos dem som gjorde försöken." },
   { "id": "riktning", "namn": "Riktningen har prövats", "uppfyllt": "Lärperioden är avslutad och lärandefrågorna har prövats.", "delvis": "", "ej": "Lärperioden är inte avslutad än." }
  ],
  "status": { "2": "Uppfyllt", "1": "Delvis", "0": "Inte än" },
  "omdomen": {
   "tidigt": { "namn": "För tidigt att säga", "text": "Inga försök har följts upp än. Gör kursavläsningarna, så går det att se om ni har börjat ta er uppför kurvan." },
   "borjat": { "namn": "Ni har börjat", "text": "Försöken är igång, men lärandet har inte fått fäste än. Det viktigaste nu är att dela lärdomarna och föra in dem i arbetssätt, så att de stannar i organisationen." },
   "pavag": { "namn": "Ni är på väg uppför", "text": "Det finns tydliga tecken på rörelse: försöken följs upp och något har börjat förändras. Fortsätt med nästa lilla försök och se till att lärdomarna förs in i rutiner." },
   "uppfor": { "namn": "Ni har tagit er uppför lärandekurvan", "text": "Försöken följs upp, mottagningsförmågan har stärkts, lärdomar har förts in i arbetssätt och riktningen har prövats. Organisationen lär på det sätt som forskningen förknippar med snabbare lärandekurvor." }
  }
 },

 "rapport": {
  "spelTitel": "Förmågefällan",
  "spelHypotes": "Hypotesen från spelet: {hypotes}",
  "sammanfattning": "{org} har arbetat igenom de tre faserna i Learning Curve Approach.",
  "sense": "I Sense undersöktes frågan ”{fraga}”. Arbetet ledde till {n} och framtiden ”{framtid}”.",
  "see": "I See bedömdes mottagningsförmågan inför den framtiden till lärandeindex {index} av 4 ({omdome}). De förmågor som mest behövde stärkas var {valda}.",
  "shift": "I Shift formulerades {nf} och genomfördes {nfo}, varav {na} har följts upp.",
  "kopplingTitel": "Från kollision till rörelse",
  "koppling": "{fraga} Riktad mot {axel}{behov}: {rorelse}",
  "rorelseUpp": "har stärkts från {fore} till {efter}.",
  "rorelseNed": "har inte stärkts ({fore} till {efter}).",
  "rorelseIngen": "har ännu inte följts upp.",
  "effekter": "De effekter som oftast märktes i vardagen var {lista}.",
  "slutsats": "Framtidsberedskapen bedöms som {lage}. {kurva}.",
  "kurvaTitel": "Lärandekurvan",
  "forslagAxel": "Rikta nästa lärperiod",
  "forslagAxelText": "Fortsätt rikta försöken mot {axel} för {formaga}, där mottagningsförmågan fortfarande är svagast.",
  "forslagNasta": "Nästa lilla försök",
  "forslagNastaFler": "Nästa små försök",
  "forslagHinder": "Ledningens bidrag",
  "forslagRobust": "Robusta åtgärder från Sense",
  "forslagNyRunda": "Nästa varv",
  "forslagNyRundaText": "Gör om See om sex till tolv månader och jämför profilen med den här; See kan visa två körningar ovanpå varandra. Gör om Sense när de signaler ni bevakar ändras. Varje varv är ett nytt steg uppför lärandekurvan.",
  "tillampningTitel": "{namn}",
  "tillampningText": "{objekt}Samlad bedömning: {samlad}.{sarbara}",
  "tillampningSarbara": " Sårbart i flera framtider: {lista}.",
  "tillampningFallor": " {namn}: {lista}.",
  "tillampningRobust": "Robusta åtgärder: {namn}",
  "tillampningRubrik": "Utvalda tillämpningar",
  "forslagFaste": "Ge lärdomarna fäste",
  "forslagFasteText": "Avsätt tid för gemensam reflektion efter varje försök och bestäm var lärdomarna ska skrivas in: en rutin, en mall eller ett beslut."
 },
 "knappar": { "pdf": "Ladda ner slutrapport (PDF)", "ny": "Öppna en annan sparfil", "shift": "Tillbaka till Shift" }
};
