// Innehållsfil för Dialogverktyget. Texter kan redigeras här utan att röra koden.
// MatchUp-delen är hämtad ur Självskattning mottagningsförmåga MatchUp v1.0 (rättad referens för Strategiskt ledarskap, Nej).
window.CONTENT = {
 "boost": {
  "version": "prototyp v0.7",
  "vag": { "etapper": [{ "namn": "Uppgifter" }, { "namn": "Skatta förmågorna" }, { "namn": "Er profil" }, { "namn": "Valda förmågor" }, { "namn": "Egna åtgärder" }, { "namn": "Rapport" }], "nasta": "Nästa", "nastaFormaga": "Nästa förmåga", "agency": "Förmåga, mandat, vilja och tilltro", "diagnos": "Diagnos och beslut", "styrka": "En tydlig styrka" },
  "skedeIntro": {
   "formagor": { "namn": "Skatta förmågorna", "vad": "Ni skattar tolv förmågor som tillsammans beskriver organisationens förmåga att ta emot förändring: att upptäcka, välja, pröva och förändra.", "varfor": "Det är sällan resultaten som fattas när något nytt ska tas emot. Det är mottagarens förmåga, mandat och vilja. Skattningen visar var förmågan är starkast och svagast.", "hur": "Läs beskrivningen av varje nivå och välj den som stämmer bäst i dag, inte den ni önskar. Halvsteg går bra. Det finns inga rätta svar; skillnader mellan er är bra att samtala om.", "vem": "En grupp som tillsammans känner verksamheten, eller var och en för sig följt av ett gemensamt samtal i facilitatorläget.", "leder": "Er profil, där de förmågor som behöver stärkas mest föreslås." },
   "profil": { "namn": "Er profil", "vad": "Ni ser profilens form och väljer två till tre förmågor att arbeta vidare med.", "varfor": "Formen säger mer än medelvärdet. En dipp i en enda förmåga kan hålla tillbaka allt annat, och en tydlig styrka kan bära förändring.", "hur": "Verktyget föreslår de lägst skattade förmågorna. Ni kan byta, men skriv då varför. Ta också ställning till om en tydlig styrka har betydelse.", "vem": "Hela gruppen.", "leder": "För de valda förmågorna bedömer ni förmåga, mandat, vilja och tilltro." },
   "agency": { "namn": "Förmåga, mandat, vilja och tilltro", "vad": "Ni tar ställning till korta påståenden om varje vald förmåga: kan vi, får vi, vill vi och tror vi att det går?", "varfor": "Det som håller tillbaka är olika saker i olika organisationer. Svagast axel avgör vilket slags åtgärd och vilket slags försök som hjälper.", "hur": "Svara på samma skala för alla påståenden, så som det är i dag. Om formellt och upplevt mandat skiljer sig är det värt att stanna upp.", "vem": "Hela gruppen, gärna med både ledning och medarbetare.", "leder": "En diagnos och ett beslut för förmågan." },
   "diagnos": { "namn": "Diagnos och beslut", "vad": "Ni ser vad som håller tillbaka mest för förmågan och fattar ett beslut: ja, fortsätt, utred, vänta eller nej.", "varfor": "Ett uttalat beslut gör det tydligt vad som ska hända och vem som ansvarar. Även att vänta eller säga nej är ett beslut som går att följa upp.", "hur": "Läs diagnosen och åtgärdsförslaget. Välj beslut och läs vad det innebär.", "vem": "Ledningen, tillsammans med gruppen.", "leder": "Besluten och den svagaste axeln blir underlaget för Shift." },
   "styrka": { "namn": "En tydlig styrka", "vad": "Ni samtalar om en förmåga som sticker ut i profilen.", "varfor": "En styrka kan bära förändring, men den kan också göra organisationen för säker på det som fungerat hittills.", "hur": "Svara kort på frågorna om hur styrkan kan användas och var den kan bli en fälla.", "vem": "Hela gruppen.", "leder": "Era egna förslag på åtgärder." },
   "egna": { "namn": "Egna förslag på åtgärder", "vad": "Ni skriver ner vad ni tar med er härifrån.", "varfor": "Det som skrivs ner med vem och när blir oftare av.", "hur": "Skriv gärna vem som gör vad och när. Det kommer med i rapporten.", "vem": "Hela gruppen.", "leder": "Rapporten." },
   "rapport": { "namn": "Rapport", "vad": "Ni får en sammanfattning av profilen, de valda förmågorna, vad som håller tillbaka och era beslut.", "varfor": "Rapporten gör bedömningen möjlig att dela och följa upp.", "hur": "Läs sammanfattning, analys och förslag. Ladda ner rapporten som PDF och spara sparfilen.", "vem": "Den som håller i arbetet.", "leder": "I Shift riktar ni små trimförsök mot den svagaste axeln." }
  },
  "lca": {
   "kollisionerRubrik": "Framtidskollisioner från Sense",
   "nastaRubrik": "Nästa steg i The Learning Curve Approach",
   "nastaText": "Gå vidare till Shift, eller spara sparfilen och läs in den där senare. De förmågor ni valt, den svagaste axeln och era beslut blir utgångspunkten för de första små trimförsöken. Har ni gjort Sense finns det med i filen, så att slutrapporten kan väga samman alla tre faserna.",
   "tillLanding": "Till The Learning Curve Approach",
   "felModul": "Det här är en sparfil från {modul}. Öppna den i {modul}.",
   "nastaForslagTitel": "Nästa steg: Shift",
   "nastaForslag": "Ta med sparfilen till Shift. Där blir den svagaste axeln utgångspunkten för de första små trimförsöken, riktade mot det som håller tillbaka.",
   "tillShift": "Gå vidare till Shift"
  },
  "sammanfattning": {
   "rubrik": "Sammanfattning",
   "inledning": "{org} har bedömt hur redo organisationen är att hantera scenariot ”{scenario}”.",
   "inledningUtanScenario": "{org} har bedömt hur redo organisationen är att hantera kommande förändringar.",
   "niva": [
    "Bedömningen visar att organisationen befinner sig i ett tidigt skede: förnyelse sker mest när enskilda eldsjälar driver den.",
    "Bedömningen visar att organisationen har börjat röra sig: insikten finns, men gemensamma arbetssätt och tydligt ansvar saknas ännu.",
    "Bedömningen visar att organisationen har etablerade arbetssätt för förnyelse inom flera områden, men ännu inte överallt.",
    "Bedömningen visar att förnyelse är en naturlig del av hur organisationen arbetar."
   ],
   "form": {
    "jämn": "Förmågorna ligger på ungefär samma nivå.",
    "ojämn": "Förmågorna är något ojämnt utvecklade.",
    "taggig": "Förmågorna är mycket ojämnt utvecklade. Några är starka och andra svaga, och det är de svaga som sätter gränsen för helheten."
   },
   "valda": "De områden som mest behöver stärkas är {lista}.",
   "hinder": {
    "formaga": "det som främst saknas är kunskap och beprövade arbetssätt",
    "mandat": "det som främst saknas är beslutsrätt, tid och resurser",
    "vilja": "det som främst saknas är att frågan upplevs som tillräckligt angelägen"
   },
   "hinderGemensamt": "I flera av dem är hindret detsamma: {hinder}. Det pekar på något i organisationen som helhet, och där bör arbetet börja.",
   "hinderEtt": "Där är hindret främst detta: {hinder}.",
   "hinderOlika": "Hindren ser olika ut för de olika områdena, så det första steget blir olika för vart och ett.",
   "styrka": "Organisationen är särskilt stark på {styrka}, och den styrkan kan användas för att lyfta de svagare områdena.",
   "recRubrik": "De viktigaste rekommendationerna",
   "recStyrka": "Använd {styrka} som hävstång för att stärka {svag}. Fråga er samtidigt om styrkan gör er för säkra på nuvarande arbetssätt.",
   "nyckeltalRubrik": "Nyckeltal",
   "nyckeltalHanvisning": "Begreppen förklaras under Så läser du rapporten, sist i rapporten.",
   "monster": "För {n} av {m} valda förmågor är {axel} den svagaste axeln.",
   "lasRubrik": "Så läser du rapporten",
   "las": [
    {
     "term": "Förmågor och nivåer",
     "text": "Organisationen har skattat tolv förmågor på en skala från 0 (omedveten) till 4 (transformerad). Ett halvsteg, till exempel 1,5, betyder att man landat mellan två nivåer."
    },
    {
     "term": "Lärandeindex",
     "text": "Medelvärdet av de tolv skattningarna, från 0 till 4. Det säger hur långt organisationen har kommit i stort, men inte var de svaga punkterna finns. Läs det därför alltid tillsammans med profilens form."
    },
    {
     "term": "Profilens form",
     "text": "Skillnaden mellan den högsta och den lägsta skattningen. Jämn betyder mindre än ett steg: förmågorna ligger nära varandra och indexet ger en rättvisande bild. Ojämn betyder ett till två steg. Taggig betyder två steg eller mer: några förmågor är klart svagare än andra, och eftersom förmågor samverkar begränsar de svaga helheten mer än indexet visar."
    },
    {
     "term": "Spindeldiagrammet",
     "text": "Varje eker är en förmåga, och ju längre ut desto högre nivå. Den streckade cirkeln är lärandeindexet. Punkter innanför cirkeln ligger under genomsnittet, punkter utanför över. De valda förmågorna är markerade i rött och en eventuell styrka i guld."
    },
    {
     "term": "De fyra fälten",
     "text": "Förmågorna är ordnade i fyra fält som följer förnyelsens förlopp, medurs från klockan tolv: Upptäcka (att se och förstå vad som händer), Välja (att sätta riktning), Pröva (att testa och lära) och Förändra (att genomföra tillsammans med andra). En profil som är svag i ett helt fält visar var i förloppet förnyelsen brukar stanna."
    },
    {
     "term": "Axlarna",
     "text": "För de valda förmågorna visas fyra axlar på en gemensam skala från 1 till 5, där varje axel bygger på påståenden som ni har tagit ställning till. Förmåga är om ni har kunskap och arbetssätt för att stärka förmågan. Mandat är om man har rätt och möjlighet att agera, uppdelat på formellt mandat (beslutsrätt, tid och resurser) och upplevt mandat (om man känner sig fri att agera och att det ger effekt). Vilja är hur angeläget det är och om man är beredd att prioritera. Tilltro är om man tror att man klarar det."
    },
    {
     "term": "Svagaste axeln",
     "text": "Den axel som ligger lägst visar vilken sorts hinder som är störst, och därmed vilken sorts första steg som passar. Saknas förmåga behövs lärande, saknas mandat behövs beslut och resurser, och saknas vilja behövs mening och angelägenhet."
    },
    {
     "term": "Reflektion",
     "text": "När rekommendationerna talar om reflektion avses en kort, strukturerad genomgång efter ett försök eller ett skede: Vad hade vi tänkt? Vad hände? Varför blev det så? Vad gör vi annorlunda nästa gång? Sådana genomgångar förbättrar mätbart hur väl en grupp presterar."
    },
    {
     "term": "Pilotprojekt",
     "text": "En pilot ger bara effekt om ni i förväg bestämmer vem som tar resultatet vidare och till vilket nästa projekt. Annars stannar lärdomen i piloten, vilket är det vanligaste sättet som lärande går förlorat i projektbaserade organisationer."
    }
   ]
  },
  "titel": "See",
  "verktyg": "Dialogverktyg — Learning Curve Approach",
  "undertitel": "Självskattning av mottagningsförmåga och agency inför förändring",
  "upphov": "© Engströms Mickla AB 2026",
  "integritet": "Dina svar sparas bara i din webbläsare och i de filer du själv laddar ner. Ingenting skickas till oss eller någon annan.",
  "gransvarden": [
   1,
   2,
   3
  ],
  "skalsteg": 1,
  "form": {
   "jamn": 1.0,
   "taggig": 2.0,
   "texter": {
    "jämn": "Profilen är jämn. Förmågorna ligger nära varandra, och indexet ger en rättvisande bild av helheten.",
    "ojämn": "Profilen är ojämn. Några förmågor sticker ut åt något håll; läs indexet tillsammans med formen.",
    "taggig": "Profilen är taggig. De svaga punkterna begränsar sannolikt mer än genomsnittet antyder."
   }
  },
  "indexnot": "Ett genomsnitt säger mindre än era svagaste punkter. Läs indexet tillsammans med diagrammets form.",
  "valtext": "Förmågor samverkar. En organisation blir sällan starkare än sin svagaste länk, och starka förmågor kompenserar sällan för svaga. Därför föreslår vi att ni fortsätter med era lägst skattade förmågor. Om någon av dem saknar betydelse för ert scenario kan ni byta ut den. Skriv i så fall kort varför.",
  "styrka": {
   "overMedian": 1.0,
   "fraga": "Er starkaste förmåga är {styrka}. Den sticker ut tydligt i profilen. Har den betydelse för ert scenario?",
   "dialog": [
    "Hur kan {styrka} användas för att stärka {svag}?",
    "Finns det en risk att {styrka} gör er för säkra på nuvarande arbetssätt?"
   ]
  },
  "skala": [
   "Stämmer inte alls",
   "Stämmer dåligt",
   "Stämmer delvis",
   "Stämmer ganska bra",
   "Stämmer helt"
  ],
  "pastaenden": [
   {
    "id": "K1",
    "axel": "formaga",
    "text": "Vi har den kunskap och de arbetssätt som behövs för att stärka {förmåga}."
   },
   {
    "id": "K2",
    "axel": "formaga",
    "text": "Vi har gjort liknande förändringar förut och vet hur vi ska gå till väga."
   },
   {
    "id": "F1",
    "axel": "formellt",
    "text": "Vi har beslutsrätt att förändra hur vi arbetar med {förmåga} utan att först gå vidare uppåt."
   },
   {
    "id": "F2",
    "axel": "formellt",
    "text": "Det finns avsatt tid och resurser för att stärka {förmåga} under det kommande året."
   },
   {
    "id": "U1",
    "axel": "upplevt",
    "text": "Vi känner oss fria att själva avgöra hur vi ska stärka {förmåga}."
   },
   {
    "id": "U2",
    "axel": "upplevt",
    "text": "Det vi gör för att stärka {förmåga} får märkbar effekt i organisationen."
   },
   {
    "id": "V1",
    "axel": "vilja",
    "text": "Att stärka {förmåga} är viktigt för oss med tanke på scenariot."
   },
   {
    "id": "V2",
    "axel": "vilja",
    "text": "Vi är beredda att prioritera ner annat för att stärka {förmåga}."
   },
   {
    "id": "T1",
    "axel": "tilltro",
    "text": "Vi är övertygade om att vi tillsammans kan stärka {förmåga}, även när det blir motigt."
   }
  ],
  "axlar": {
   "formaga": "Förmåga",
   "mandat": "Mandat",
   "vilja": "Vilja",
   "tilltro": "Tilltro"
  },
  "svagastAxel": {
   "formaga": {
    "rubrik": "Förmågan är den svagaste axeln",
    "text": "Ni har mandat och vilja, men saknar ännu arbetssätt eller kunskap. Mer beslut eller mer engagemang löser inte det.",
    "shift": "Ett passande första steg är ett avgränsat lärexperiment: pröva en metod i ett projekt, lär av någon som redan gör det, eller ta in stöd för ett första försök."
   },
   "mandat": {
    "rubrik": "Mandatet är den svagaste axeln",
    "text": "Viljan och kunskapen finns, men förutsättningarna saknas. Mer utbildning eller entusiasm hjälper inte.",
    "shift": "Ett passande första steg är att skapa förutsättningen: ett avgränsat beslut, en tidsbudget, eller en pilot som får eget mandat."
   },
   "vilja": {
    "rubrik": "Viljan är den svagaste axeln",
    "text": "Förutsättningarna finns, men frågan känns inte angelägen, eller inte angelägen nog att prioritera.",
    "shift": "Ett passande första steg handlar om mening: gå tillbaka till scenariot, gör konsekvensen av att inte agera konkret, och låt ett litet test visa nyttan."
   },
   "jamn": {
    "rubrik": "Axlarna ligger i nivå med varandra",
    "text": "Ingen axel sticker ut som tydligt svagast. Diskutera vilken av dem som skulle ge mest effekt att stärka just nu.",
    "shift": "Välj ett första steg som är litet nog att vara möjligt och stort nog att vara meningsfullt, och följ upp vad det lär er."
   }
  },
  "glapp": {
   "grans": 1.0,
   "formelltStorre": {
    "rubrik": "Mandatet finns på papperet men används inte",
    "text": "Det formella mandatet är tydligt större än det upplevda. Det beror ofta på otydlighet om vad som faktiskt är tillåtet, tidigare erfarenheter av att initiativ har stoppats, eller en kultur där man väntar in ledningen. Ett passande första steg är att använda mandatet synligt i en liten fråga, så att det bekräftas i praktiken."
   },
   "upplevtStorre": {
    "rubrik": "Engagemanget bärs av eldsjälar utan formellt stöd",
    "text": "Det upplevda mandatet är tydligt större än det formella. Det fungerar en tid men riskerar att bli ett sidoprojekt som självdör. Ett passande första steg är att formalisera något av det som redan pågår: ett beslut, en tidspost eller ett utpekat ansvar."
   }
  },
  "tilltroGlapp": {
   "grans": 1,
   "lagTilltro": "Förmågan skattas högre än tilltron. Kunskapen finns, men den syns inte för er själva. Synliggör vad ni redan har lyckats med.",
   "hogTilltro": "Tilltron är högre än den skattade förmågan. Det finns en risk för överskattning. Testa i liten skala innan ni lovar något större."
  },
  "beslut": {
   "fraga": "Vad bestämmer ni er för när det gäller {förmåga}?",
   "alternativ": {
    "Ja": "Ja, vi satsar på att stärka den nu",
    "Fortsätt": "Fortsätt, vi bygger vidare på det vi redan gör",
    "Utred": "Utred, vi behöver förstå mer först",
    "Vänta": "Vänta, inte nu men senare",
    "Nej": "Nej, vi avstår medvetet"
   },
   "lagViljaJa": "Ni har bestämt er för att gå vidare, men skattade viljan lågt. Det är värt att stanna vid: vad har ändrats under samtalet, eller vad krävs för att beslutet ska hålla?",
   "hogViljaNej": "Ni skattade viljan högt men väljer att vänta eller avstå. Vad är det som håller emot? Det kan peka på mandatet snarare än viljan.",
   "tillagg": {
    "Vänta": "Bestäm vem som tar upp frågan igen, och vid vilket datum eller vilken händelse.",
    "Nej": "Att avstå är ett legitimt strategiskt val när det är medvetet. Ange vad som skulle få er att ompröva beslutet."
   }
  },
  "kvadranter": [
   {
    "namn": "Upptäcka",
    "text": "De tre första förmågorna handlar om att upptäcka: att se vad som händer i omvärlden och ha kunskap att förstå det.",
    "formagor": [
     12,
     11,
     9
    ]
   },
   {
    "namn": "Välja",
    "text": "De tre följande förmågorna handlar om att välja: att sätta riktning och avgöra vad som är värt att satsa på.",
    "formagor": [
     3,
     1,
     8
    ]
   },
   {
    "namn": "Pröva",
    "text": "De tre följande förmågorna handlar om att pröva: att ta idéer vidare, testa dem och lära av resultaten.",
    "formagor": [
     7,
     6,
     5
    ]
   },
   {
    "namn": "Förändra",
    "text": "De tre sista förmågorna handlar om att förändra: att få med människor och partner och genomföra förändringen.",
    "formagor": [
     4,
     2,
     10
    ]
   }
  ]
 },
 "matchup": {
  "intro": [
   "Målet med detta verktyg är att ge användarna ökad insikt om organisationens förmåga att värdera och integrera innovationer – på ett sätt som balanserar affärsmässig effektivitet på kort sikt med strategisk förnyelse och hållbar utveckling på längre sikt. Det kan också användas av innovatörer för att förstå vilka krav som ställs på deras kunder – inte för att bedöma, utan för att bättre anpassa samarbete, stöd och leverans till kunden.",
   "Verktyget är inte primärt till för att mäta prestation utan för att skapa gemensam förståelse, riktning och lärande – ett stöd för reflektion, samverkan och medveten rörelse framåt."
  ],
  "formagor": [
   {
    "id": 1,
    "namn": "Strategisk ambidexteritet",
    "vad": "Förmågan att styra både det etablerade och det utforskande",
    "syfte": "För att kunna balansera kortsiktig effektivitet med långsiktig innovation och konkurrenskraft",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Allt mäts utifrån samma logik"
     },
     {
      "namn": "Konceptuell",
      "text": "Vi har börjat skilja på utforskande och genomförande"
     },
     {
      "namn": "Definierad",
      "text": "Vi har olika mål, indikatorer och processer för drift och sökande"
     },
     {
      "namn": "Integrerad",
      "text": "Processer är anpassade efter typ av arbete"
     },
     {
      "namn": "Transformerad",
      "text": "Organisationen växlar sömlöst mellan utforskande och genomförande"
     }
    ],
    "intern": [
     "Kartlägg hur resurser, mål och mätetal fördelas idag mellan drift och utveckling för att skapa gemensam förståelse.",
     "Testa enkla styrmodeller där små resurser avsätts till utveckling utan att störa drift, och följ upp lärdomarna.",
     "Bygg en återkommande rutin för att följa upp både driftmål och utvecklingsmål i ledningsgruppen och reflektera över balansen.",
     "Utmana er egen modell: låt nya medarbetare eller en extern part granska var arbetssättet har stelnat, och dela erfarenheter i nätverk."
    ],
    "extern": [
     "Anlita facilitator för att visualisera skillnader mellan drift och utveckling och skapa gemensam förståelse.",
     "Ta in stöd för att bygga en balanserad styrmodell och reflektera över lärande från den.",
     "Låt extern part göra en benchmark och föreslå hur dubbel logik kan förbättras.",
     "Bjud in forskare eller en annan organisation att granska er modell, och bidra med era erfarenheter i branschens utvecklingsprojekt."
    ],
    "atgard": {
     "Ja": [
      "Låt ledningsgruppen följa upp utvecklingsmål på samma möten och med samma allvar som driftmål. Börja med ett eller två mål.",
      "Testa dubbel styrning i ett projekt: separata mål för leverans och för utveckling, och en namngiven person som äger utvecklingsdelen. Bestäm i förväg vem som tar lärdomarna vidare till nästa projekt.",
      "Ge de personer som redan driver utveckling i projekten tid, mandat och ett forum där deras erfarenheter tas om hand. Det är där balansen mellan drift och utveckling faktiskt skapas i projektbaserad verksamhet.",
      "Hjälp partner i era projekt att utveckla samma balans. I en projektbaserad bransch begränsas er förmåga av den svagaste aktören i projektet."
     ],
     "Fortsätt": [
      "Behåll rytmen och lägg till en fast punkt: vad har vi lärt oss om nya verktyg eller arbetssätt sedan sist, och i vilket projekt?",
      "Fortsätt med piloten, och ge namngivna personer tid och mandat för utvecklingen.",
      "Fortsätt med dubbel styrning och gör kvartalsvisa kontroller så att utvecklingsmål följs upp lika systematiskt som driftmål.",
      "Fortsätt och förvalta. Planera för att de personer som bär balansen kan byta projekt eller sluta, så att förmågan inte försvinner med dem."
     ],
     "Utred": [
      "Kartlägg hur beslut fattas idag och var drift och utveckling krockar. Identifiera exempel att diskutera.",
      "Analysera var utvecklingsidéer stoppas: i projektets kalkyl, i beställarens krav eller i er egen styrning. Föreslå en justering för den vanligaste spärren.",
      "Jämför var dubbel logik fungerar bäst i organisationen. Identifiera lärdomar att sprida till andra delar.",
      "Utvärdera hur modellen påverkar innovationsförmågan långsiktigt och hur den kan skalas till andra organisationer."
     ],
     "Vänta": [
      "Skriv ner vad som saknas just nu: tid, stöd eller mandat. Det avgör vad som måste finnas på plats innan ni går vidare.",
      "Avvakta med större förändringar men följ upp hur mycket innovationsarbete får plats i praktiken.",
      "Behåll nuvarande styrning, men notera varje gång en utvecklingsidé stoppas av driftskäl. Mönstret blir ert underlag.",
      "Ändra inget i strukturen, men använd nästa kritiska händelse i ett projekt som tillfälle att pröva om balansen håller."
     ],
     "Nej": [
      "Om ni medvetet satsar på drift, håll ändå koll på vad konkurrenter och beställare gör med ny teknik, så att ni inte blir överraskade.",
      "Avstå om nuvarande styrning redan ger utrymme för utveckling i projekten. Kontrollera det genom att fråga dem som driver utvecklingen.",
      "Om utvecklingsdelen pausas, säg det öppet till dem som drivit den och ge dem en väg att fortsätta i liten skala. Annars försvinner både engagemanget och kunnandet.",
      "Pröva om beslutet bygger på en verklig prioritering eller på att ni känner er färdiga. Det senare är en vanlig väg in i en kompetensfälla, där man blir allt bättre på det man redan gör och slutar söka nytt."
     ]
    }
   },
   {
    "id": 2,
    "namn": "Samverkan över gränser",
    "vad": "Förmågan att nyttja kompetens över gränser, mellan funktioner och med partner i projekten",
    "syfte": "För att lösa komplexa utmaningar som kräver flera perspektiv, inom organisationen och mellan de aktörer som tillsammans genomför projekten",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Silostrukturer dominerar, inom organisationen och mot partner"
     },
     {
      "namn": "Konceptuell",
      "text": "Det finns en vilja, men inte struktur eller forum"
     },
     {
      "namn": "Definierad",
      "text": "Samverkansforum och metoder finns, internt och i viktiga partnerskap"
     },
     {
      "namn": "Integrerad",
      "text": "Samverkan sker naturligt i alla utvecklingsinitiativ, även med beställare och partner"
     },
     {
      "namn": "Transformerad",
      "text": "Organisationen är byggd för att integrera olika perspektiv löpande, också över organisationsgränser"
     }
    ],
    "intern": [
     "Starta små arbetsgrupper med olika funktioner, och gärna en partner, kring ett utvalt initiativ, och låt dem testa nya arbetssätt.",
     "Skapa fasta forum där olika funktioner möts regelbundet för att utbyta insikter och gemensamt lösa problem.",
     "Koppla tvärfunktionella arbetssätt till projektmodeller och belöningssystem, och reflektera över vad som driver samarbete.",
     "Låt någon utifrån, gärna en partner i era projekt, granska var samverkan har blivit rutin utan innehåll, och utveckla arbetssättet tillsammans med partnerna."
    ],
    "extern": [
     "Anlita facilitator för första tvärfunktionella workshopen kring ett gemensamt mål.",
     "Ta in hjälp för att utforma verktyg och rutiner för lärande samverkan (t.ex. design thinking).",
     "Låt extern aktör utvärdera er samarbetskultur och ge återkoppling på förbättringsmöjligheter.",
     "Delta i forskningsprojekt om samverkan över organisationsgränser och låt forskarna pröva er modell kritiskt."
    ],
    "atgard": {
     "Ja": [
      "Samla funktionerna kring en konkret gemensam uppgift, till exempel ett problem i ett pågående projekt. Fokusera på att förstå varandras perspektiv och utmaningar.",
      "Etablera ett stående forum där olika funktioner möts regelbundet för att dela insikter och utveckla gemensamma mål. Se till att det är tryggt att ta upp problem och misstag.",
      "Integrera tvärfunktionell samverkan i projektmodeller och planering. Låt personer som arbetat tvärfunktionellt ta med sig arbetssättet till nästa projekt.",
      "Driv samma arbetssätt tillsammans med partner i era projekt, så att samverkan inte stannar vid er egen organisations gräns."
     ],
     "Fortsätt": [
      "Fortsätt, och avsluta varje gemensamt möte med två frågor: vad hindrade oss, och vad tar vi med oss?",
      "Fortsätt med forumet, men låt varje möte sluta i ett beslut eller i en tydlig fråga till den som kan fatta det.",
      "Fortsätt, och följ upp en konkret effekt, till exempel färre fel i gränssnitten mellan skeden eller kortare tid till beslut.",
      "Fortsätt, och ge nya medarbetare en tidig tvärfunktionell uppgift tillsammans med erfarna kollegor. Kulturen lärs i arbetet, inte i introduktionen."
     ],
     "Utred": [
      "Kartlägg vilka funktioner och vilka externa parter som behöver samverka, och vilka hinder som finns i dagens struktur och avtal.",
      "Utred vilka forum eller metoder som fungerar bäst för lärande mellan funktioner.",
      "Utred var samverkan fortfarande är beroende av personliga initiativ och föreslå lösningar.",
      "Utred vilka avtal och ersättningsformer i era projekt som gör samverkan med partner svårare, och vad som skulle behöva ändras."
     ],
     "Vänta": [
      "Vänta tills pågående initiativ har avslutats och använd erfarenheterna som startpunkt.",
      "Avvakta med att skapa nya forum, men följ upp hur mycket samverkan som sker spontant.",
      "Vänta tills pågående projekt har avslutats, men gör en kort lärandegenomgång i vart och ett om var samverkan mellan funktionerna brast.",
      "Vänta med bred spridning, men låt dem som kan arbetssättet bäst bemanna nya projekt."
     ],
     "Nej": [
      "Om ni avstår, utse ändå en person som ansvarar för överlämningar mellan funktioner i de största projekten. Där uppstår ofta kostsamma fel.",
      "Avstå bara om befintliga strukturer redan stödjer tvärfunktionellt lärande. Förklara beslutet öppet.",
      "Om samverkan minskas, bestäm hur erfarenheter ändå ska föras över mellan funktionerna, till exempel genom en gemensam genomgång när varje projekt avslutas.",
      "Om samverkan pausas, håll utkik efter tecken på att silorna växer tillbaka: fler fel i gränssnitten och fler frågor som måste lyftas uppåt."
     ]
    }
   },
   {
    "id": 3,
    "namn": "Strategiskt ledarskap för förnyelse",
    "vad": "Förmågan att visa riktning, prioritera långsiktigt och ge legitimitet åt förnyelse",
    "syfte": "För att säkerställa att innovation är förankrad i ledningen och blir en del av organisationens strategiska agenda",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Innovation ses som operativt eller perifert"
     },
     {
      "namn": "Konceptuell",
      "text": "Ledningen uttrycker stöd för innovation men är inte aktivt involverad"
     },
     {
      "namn": "Definierad",
      "text": "Utveckling och förnyelse har formell förankring i ledningsarbetet"
     },
     {
      "namn": "Integrerad",
      "text": "Ledningen följer upp och tar beslut om innovationsarbete löpande"
     },
     {
      "namn": "Transformerad",
      "text": "Ledning och styrelse tar ett systematiskt, långsiktigt ansvar för strategisk förnyelse"
     }
    ],
    "intern": [
     "Skapa en stående punkt om innovationsklimat och framtidsperspektiv på ledningsmöten.",
     "Identifiera och kommunicera hur strategiska utmaningar kopplar till behov av förnyelse och lärande.",
     "Etablera innovationsnyckeltal eller utse ambassadörer i ledningsgruppen för att hålla lärande och riktning levande.",
     "Låt styrelsen eller en extern part utmana ledningens bild av framtiden, och pröva strategin mot scenarier där er nuvarande styrka blir mindre värd."
    ],
    "extern": [
     "Ta in stöd för att leda en workshop i ledningsgruppen om osäkerheten i omvärlden och vad den kräver av ert strategiska lärande.",
     "Anlita coach för scenarioplanering och reflekterande strategiarbete.",
     "Låt extern facilitator utvärdera ledningsgruppens arbete kring förnyelse.",
     "Bidra i branschens framsyn och i forskningsforum, och använd dem för att få era egna antaganden ifrågasatta."
    ],
    "atgard": {
     "Ja": [
      "Avsätt tid i ledningsgruppen för att diskutera framtiden utifrån konkreta scenarier, och vad de betyder för era prioriteringar i dag.",
      "Identifiera hur utveckling bidrar till affärsmål och kommunicera kopplingen till organisationen.",
      "Etablera tydliga roller, mål och forum för att följa upp innovationsarbete i ledningen.",
      "Låt ledningsgruppen pröva sina strategiska antaganden mot nya scenarier varje år, och engagera er i branschens gemensamma framsyn."
     ],
     "Fortsätt": [
      "Fortsätt, och ägna en ledningsgruppsträff per kvartal helt åt framtiden, utan driftfrågor på agendan.",
      "Fortsätt, och fråga regelbundet några medarbetare om de kan beskriva den långsiktiga riktningen. Svaren visar om strategin når fram.",
      "Fortsätt, och avsluta varje strategiskt initiativ med en lärandegenomgång i ledningsgruppen innan nästa startas.",
      "Fortsätt, och ge någon i ledningsgruppen i uppdrag att ifrågasätta etablerade sanningar. Framgång gör det lätt att bli överens för snabbt."
     ],
     "Utred": [
      "Kartlägg hur ledningen idag arbetar med utveckling och var frågor om framtid hanteras.",
      "Utred vilka delar av strategiarbetet som främjar respektive hindrar innovation.",
      "Utred hur ledningsgruppen kan stärka sin förmåga att prioritera långsiktigt mitt i vardagsbeslut.",
      "Utred hur väl ledningens bild av framtiden delas längre ner i organisationen, och var den skiljer sig."
     ],
     "Vänta": [
      "Vänta tills pågående strategiprocesser är avslutade, men notera behov av längre perspektiv.",
      "Avvakta tills pågående omorganisation eller planperiod är färdig, men samla lärdomar.",
      "Vänta tills planerade strategiska förändringar har stabiliserats, men håll en punkt om omvärlden kvar på ledningsgruppens agenda.",
      "Vänta med att bredda arbetet, men se till att förnyelsefrågan har en tydlig ägare i ledningsgruppen under tiden."
     ],
     "Nej": [
      "Om ni avstår, bestäm hur ledningen ändå får signaler om förändringar i omvärlden, till exempel genom en återkommande omvärldsrapport.",
      "Om fokus ligger på drift, bestäm ändå en gång per år då ledningsgruppen prövar om driftfokuset fortfarande är rätt.",
      "Om ni avstår, se till att de som driver utveckling längre ner i organisationen vet om det, så att de inte väntar på stöd som inte kommer.",
      "Om ni pausar, bestäm vilken signal i omvärlden som ska få er att agera. Det är lätt att pausa för tidigt när det går bra."
     ]
    }
   },
   {
    "id": 4,
    "namn": "Förankringsförmåga",
    "vad": "Förmågan att skapa engagemang och mandat hos medarbetare",
    "syfte": "För att innovationer ska få genomslag i hela organisationen och inte fastna som sidoprojekt",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Innovation är något några få arbetar med vid sidan av"
     },
     {
      "namn": "Konceptuell",
      "text": "Det finns en ambition, men den är inte kopplad till mandat eller tid"
     },
     {
      "namn": "Definierad",
      "text": "Roller, ansvar och resurser är delvis fördelade"
     },
     {
      "namn": "Integrerad",
      "text": "Drivkrafter, mål och mandat är tydligt integrerade i styrning och HR"
     },
     {
      "namn": "Transformerad",
      "text": "Innovation är en del av uppdraget för alla medarbetare"
     }
    ],
    "intern": [
     "Identifiera hinder och möjligheter för medarbetares engagemang i utvecklingsarbete.",
     "Genomför dialogmöten där medarbetare kan dela idéer och förslag, och samla lärdomar.",
     "Utse interna ambassadörer för innovationsarbete och följ upp hur deras initiativ påverkar lärandet i organisationen.",
     "Pröva om delaktigheten fortfarande är verklig eller har blivit en ritual: låt medarbetare utan särskilt uppdrag beskriva hur mycket de faktiskt kan påverka."
    ],
    "extern": [
     "Ta in processledning för att utforska kultur och engagemang i förändring.",
     "Anlita facilitator för workshops om motivation, delaktighet och ägarskap.",
     "Ta stöd för att bygga strukturer för lärande och delaktighet i styrning och HR.",
     "Bjud in forskare att följa hur engagemanget utvecklas över tid, så att ni ser om det håller i sig när de första eldsjälarna har gått vidare."
    ],
    "atgard": {
     "Ja": [
      "Skapa dialog med medarbetare om vad förnyelse betyder i deras vardag. Lyssna efter hinder och drivkrafter.",
      "Anordna en workshop där medarbetare kan bidra med idéer kring hur ni stärker ägarskap i förändring. Återkoppla synligt vad som händer med varje idé, även de som inte genomförs.",
      "Ge de medarbetare som redan driver förändring informellt ett erkänt uppdrag med tid, mandat och ett forum att dela erfarenheter i.",
      "Låt medarbetare vara med och forma nya mål, inte bara genomföra dem. Låt era förebilder också stötta partner i gemensamma projekt."
     ],
     "Fortsätt": [
      "Fortsätt, men byt en del av informationen mot samtal: fråga medarbetarna vad som hindrar dem, och svara på det.",
      "Fortsätt samla idéer, och redovisa öppet vad som hände med dem. Idéer som aldrig får svar slutar komma.",
      "Fortsätt, och se till att ambassadörerna har avsatt tid och att deras chefer stödjer uppdraget. Utan det tröttnar de.",
      "Fortsätt förvalta kulturen av delaktighet; stöd nya medarbetare att förstå dess värde."
     ],
     "Utred": [
      "Kartlägg vilka faktorer som påverkar motivation och delaktighet i utvecklingsarbete.",
      "Utred hur mandat, ansvar och tid påverkar engagemang i förnyelsearbete.",
      "Utred hur ledarskapet kan stötta engagemang i vardagen utan nya roller.",
      "Utred om engagemanget är lika starkt i alla delar av organisationen, eller om det bärs av några få enheter."
     ],
     "Vänta": [
      "Vänta tills andra förändringsinitiativ har landat, men håll frågan levande i samtal.",
      "Avvakta med nya initiativ, men observera hur befintliga forum fungerar.",
      "Vänta tills pågående initiativ är utvärderade, men notera vad som stärker engagemang.",
      "Vänta med att bredda spridningen, men låt dem som redan engagerar sig behålla sin tid och sitt mandat."
     ],
     "Nej": [
      "Om ni avstår, säg det öppet till medarbetarna. Ett tydligt nej skadar förtroendet mindre än ett tyst.",
      "Om ni väljer bort förankring, säg det öppet och berätta vilka beslut medarbetarna ändå kan påverka.",
      "Om initiativet pausas, tacka dem som drivit det och berätta vad deras arbete ledde till.",
      "Om ni minskar medarbetarinflytandet, följ upp engagemanget över tid. Förlorat förtroende tar lång tid att bygga upp igen."
     ]
    }
   },
   {
    "id": 5,
    "namn": "Datadriven innovation",
    "vad": "Förmågan att fatta beslut grundade i fakta och insikter",
    "syfte": "För att innovationer ska prioriteras och implementeras baserat på verkliga behov och mätbara effekter",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Data används reaktivt eller inte alls"
     },
     {
      "namn": "Konceptuell",
      "text": "Det finns en ambition, men få verktyg eller metoder"
     },
     {
      "namn": "Definierad",
      "text": "Strukturerad datainsamling sker inom vissa områden"
     },
     {
      "namn": "Integrerad",
      "text": "Data används proaktivt för beslut och prioriteringar"
     },
     {
      "namn": "Transformerad",
      "text": "Data är en strategisk tillgång som driver lärande och innovation"
     }
    ],
    "intern": [
     "Identifiera vilka datamängder som redan finns tillgängliga och vilka som saknas för lärande.",
     "Skapa rutiner för att samla och strukturera data i prioriterade områden, och pröva hur de kan ge insikt.",
     "Använd data proaktivt i beslutsfattande och diskutera hur de påverkar era val och prioriteringar.",
     "Låt en extern part granska om era data och mått fortfarande styr mot det viktiga, och om nya verktyg som AI förändrar vad som är möjligt."
    ],
    "extern": [
     "Anlita stöd för att sätta upp enkla verktyg för datainsamling och reflektion.",
     "Ta hjälp för att bygga datadrivna insiktsmodeller för lärande och beslut.",
     "Engagera extern analysresurs eller AI-expert för fördjupad mönsteranalys.",
     "Delta i branschens arbete med gemensamma datastandarder. I byggsektorn påverkar de hur mycket av er egen data som går att använda tillsammans med andras."
    ],
    "atgard": {
     "Ja": [
      "Välj ett återkommande beslut och pröva att fatta det med stöd av data som ni redan har. Diskutera vad som blev annorlunda.",
      "Utgå från ett konkret beslut som ska fattas och samla den data som behövs för just det. Diskutera vad ni lär er.",
      "Etablera processer för att använda data aktivt i analys, prioritering och reflektion kring resultat.",
      "Dela data och insikter med partner i era projekt. I en projektbaserad bransch blir data mest värdefull när den följer med mellan skeden och aktörer."
     ],
     "Fortsätt": [
      "Fortsätt, och sluta samla data som inte används i något beslut. Det frigör tid för det som gör nytta.",
      "Fortsätt i mindre projekt, och låt dem som arbetat med data ta med sig arbetssättet till nästa projekt.",
      "Fortsätt, och ge varje viktigt dataflöde en ägare som ansvarar för kvaliteten och för att insikterna når dem som fattar beslut.",
      "Fortsätt, och pröva regelbundet om era mått fortfarande mäter det viktiga, eller bara det som är lätt att mäta."
     ],
     "Utred": [
      "Kartlägg hur data används idag och vilka beslut som saknar faktabaserat underlag.",
      "Utred var data kan göra störst skillnad för att förbättra beslutsfattande och lärande.",
      "Utred vilka hinder som finns för att använda data i tvärfunktionellt lärande.",
      "Utred vilka beslut som fortfarande fattas utan underlag, trots att data finns, och varför."
     ],
     "Vänta": [
      "Vänta tills ni har en tydligare bild av vilka frågor som kan stärkas med data.",
      "Avvakta med nya datainitiativ tills grundstrukturen för insamling är på plats, men låt ett pågående beslut visa om den data ni har räcker.",
      "Vänta tills pilotprojekt har utvärderats, men följ upp vilka beslut som byggde på fakta.",
      "Vänta med bred spridning, men se till att nyckelpersonerna inom data stannar kvar i arbetet."
     ],
     "Nej": [
      "Om ni avstår, välj ut de två eller tre viktigaste besluten och se till att de ändå får ett faktaunderlag.",
      "Om datainsamlingen pausas, spara det som redan finns i ett format som går att använda senare. Data som går förlorad kan inte samlas in i efterhand.",
      "Om datadrivet arbete pausas, behåll åtminstone den kompetens ni har byggt upp, till exempel genom att låta den stötta projekten vid behov.",
      "Om utvecklingen pausas, var uppmärksamma på att beställare och konkurrenter kan gå förbi er snabbt på det här området."
     ]
    }
   },
   {
    "id": 6,
    "namn": "Test- och lärförmåga",
    "vad": "Förmågan att snabbt pröva och lära i liten skala",
    "syfte": "För att minska risker, undvika felinvesteringar och bygga en kultur av lärande och kontinuerlig förbättring",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Utveckling sker som engångsinsatser och lanseringar"
     },
     {
      "namn": "Konceptuell",
      "text": "Vi talar om att pröva i liten skala men gör det sällan i praktiken"
     },
     {
      "namn": "Definierad",
      "text": "Det finns metoder för tester men de används sällan"
     },
     {
      "namn": "Integrerad",
      "text": "Kundtester och iterativa arbetssätt är standard"
     },
     {
      "namn": "Transformerad",
      "text": "Kultur och struktur stöder hypotesdrivet arbetssätt i hela organisationen"
     }
    ],
    "intern": [
     "Välj en idé och gör ett enkelt test med användare för att se vad ni lär er, inte bara om den fungerar.",
     "Skapa en rutin för att alltid testa nya idéer i liten skala innan större beslut.",
     "Gör lärandet till en tillgång, inte ett minne: låt dem som genomfört tester berätta om dem för andra team, och låt gärna personer flytta mellan projekt så att erfarenheterna följer med.",
     "Låt någon utifrån granska om era tester fortfarande prövar verkliga osäkerheter, eller mest bekräftar beslut som redan är fattade."
    ],
    "extern": [
     "Be en extern partner leda en workshop där ni övar på att utforma och genomföra små experiment.",
     "Ta in stöd för att utveckla metoder för prototypande och feedback.",
     "Anlita aktör som hjälper er att mäta lärande och nytta i tidiga tester.",
     "Låt innovationspartners eller forskare utvärdera er testkultur och föreslå nästa steg."
    ],
    "atgard": {
     "Ja": [
      "Välj en fråga ni är osäkra på och pröva den i liten skala inom två veckor. Skriv ner i förväg vad ni tror ska hända.",
      "Inför rutin att varje utvecklingsidé testas i liten skala innan beslut. Samla lärdomar i gemensamt format.",
      "Gör hypotesdrivet arbete till rutin: bestäm före varje test vad som räknas som ett lärande resultat, och låt ledningen bemöta misslyckade tester som information, inte som fel.",
      "Testa tillsammans med beställare och partner i gemensamma projekt, och låt dem dela både risken och lärandet."
     ],
     "Fortsätt": [
      "Fortsätt nuvarande arbete men lägg in kort reflektion efter varje försök: vad lärde vi oss?",
      "Fortsätt testa i projekt, och bestäm före varje test vem som ska få veta resultatet.",
      "Fortsätt använda testmetoderna men skapa forum för att dela erfarenheter och misstag.",
      "Fortsätt, och pröva då och då en idé som går emot det ni tror på. Annars testar ni bara det ni redan vet."
     ],
     "Utred": [
      "Kartlägg hur nya idéer idag prövas, vem som gör det och vad som händer med resultaten.",
      "Utred hur testresultat används i beslutsprocessen och vilka som tar del av dem.",
      "Utred vilka hinder som finns för att sprida test- och lärsätt till fler funktioner.",
      "Utred hur erfarenheterna kan skalas till partners eller andra delar av organisationen."
     ],
     "Vänta": [
      "Vänta tills ni har tydliggjort syftet med testandet, men dokumentera vilka frågor som behöver prövas.",
      "Avvakta med fler tester tills pågående pilotprojekt är analyserade, men samla reflektioner.",
      "Vänta tills större förändringar är stabila men håll testmetodiken aktiv i mindre skala.",
      "Vänta med bred spridning, men låt dem som kan testmetodiken bemanna nya projekt."
     ],
     "Nej": [
      "Om ni avstår, fatta åtminstone större beslut om nya arbetssätt med en tydlig plan för att utvärdera dem efteråt.",
      "Om testandet pausas, var medvetna om att nya idéer då införs i full skala utan att ha prövats. Det blir dyrare när de misslyckas.",
      "Om testandet inte prioriteras just nu, behåll åtminstone en kort genomgång efter varje större förändring: vad hade vi tänkt, och vad hände?",
      "Om ni pausar, behåll åtminstone genomgångarna efter avslutade projekt. De kostar lite i förhållande till vad de ger."
     ]
    }
   },
   {
    "id": 7,
    "namn": "Innovationsprocess",
    "vad": "Förmågan att ta idéer från förslag via beslut till införande",
    "syfte": "För att goda idéer ska prövas, prioriteras och genomföras i stället för att fastna eller försvinna",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Idéer hanteras slumpvis och beror på vem som råkar höra dem"
     },
     {
      "namn": "Konceptuell",
      "text": "Det finns en vilja att ta tillvara idéer, men ingen tydlig väg från förslag till beslut"
     },
     {
      "namn": "Definierad",
      "text": "Det finns en process för att samla, värdera och besluta om idéer"
     },
     {
      "namn": "Integrerad",
      "text": "Idéer prövas i steg, med olika krav i olika skeden, och beslut fattas i tid"
     },
     {
      "namn": "Transformerad",
      "text": "Processen är snabb och lärande, och organisationen styr en portfölj av initiativ med olika risknivå"
     }
    ],
    "intern": [
     "Följ några idéer från de senaste åren: var kom de ifrån, vem fattade beslut, och varför blev de av eller inte?",
     "Inför en enkel väg för idéer: var de lämnas, vem som värderar dem och när beslut fattas.",
     "Pröva idéer i steg med olika krav: tidiga steg bedöms på vad ni lär er, senare steg på affärsnytta.",
     "Granska er portfölj av initiativ: är fördelningen mellan säkra förbättringar och osäkra satsningar den ni vill ha?"
    ],
    "extern": [
     "Ta hjälp att kartlägga hur idéer i dag tar sig fram eller fastnar i organisationen.",
     "Anlita stöd för att utforma en enkel idé- och beslutsprocess som passar er storlek.",
     "Ta in stöd för att införa stegvis prövning och portföljstyrning av utvecklingsinitiativ.",
     "Låt en extern part jämföra er innovationsprocess med andra organisationers och pröva om den har blivit för tung."
    ],
    "atgard": {
     "Ja": [
      "Välj en idé som ligger och väntar och ta den hela vägen till ett beslut: genomför, testa eller avstå. Lär av det som tog tid.",
      "Bestäm var idéer ska lämnas, vem som värderar dem och hur snabbt den som lämnat en idé ska få svar.",
      "Inför stegvis prövning där kraven ökar för varje steg, och där tidiga steg bedöms på vad ni har lärt er snarare än på kalkylen.",
      "Utveckla processen tillsammans med partner i era projekt, så att idéer som kräver flera aktörer också har en väg till beslut."
     ],
     "Fortsätt": [
      "Fortsätt, och för en enkel lista över idéer och vad som hände med dem. Bara det gör processen synligare.",
      "Fortsätt, och mät hur lång tid det tar från idé till beslut. Långa ledtider gör att idéer tappar fart.",
      "Fortsätt, och våga också besluta att avsluta initiativ som inte håller. Det frigör resurser för de bästa.",
      "Fortsätt, och rensa regelbundet i processen. Processer tenderar att bli tyngre med tiden om ingen tar bort steg."
     ],
     "Utred": [
      "Kartlägg hur idéer i dag tar sig fram och var de fastnar.",
      "Utred vem som har mandat att fatta beslut om idéer på olika nivåer, och om det är tydligt för medarbetarna.",
      "Utred hur er portfölj fördelar sig mellan små förbättringar och större satsningar, och om det stämmer med er strategi.",
      "Utred hur processen kan förenklas utan att ni tappar kontrollen över risk och resurser."
     ],
     "Vänta": [
      "Vänta med en formell process, men se till att varje idé som lämnas får ett svar.",
      "Avvakta med att bygga ut processen, men följ upp vilka idéer som fastnar och varför.",
      "Vänta tills pågående initiativ har utvärderats, men avsluta inget utan en kort lärandegenomgång.",
      "Vänta med förändringar i processen, men behåll de delar som redan fungerar."
     ],
     "Nej": [
      "Om ni avstår, låt åtminstone ledningen gå igenom inkomna idéer en gång per halvår.",
      "Om ni avstår, var medvetna om att idéer då når genomförande genom eldsjälar snarare än genom beslut. Det fungerar ibland, men är sårbart.",
      "Om ni avstår från vidareutveckling, följ upp hur många idéer som aldrig får något svar. Det visar priset för beslutet.",
      "Om ni pausar, var uppmärksamma på att en process som inte förnyas blir långsammare med tiden."
     ]
    }
   },
   {
    "id": 8,
    "namn": "Affärsmodellsutforskning",
    "vad": "Förmågan att hitta nya sätt att skapa, fånga och erbjuda värde",
    "syfte": "För att organisationen ska kunna anpassa sig till nya marknader och hitta hållbara intäktsströmmar",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Vi ser vår affärsmodell som statisk och självklar"
     },
     {
      "namn": "Konceptuell",
      "text": "Vi överväger andra affärsmodeller men saknar metodik"
     },
     {
      "namn": "Definierad",
      "text": "Vi har verktyg för att utveckla och testa alternativa modeller"
     },
     {
      "namn": "Integrerad",
      "text": "Prototypande och experiment kopplat till affärsmodell sker löpande"
     },
     {
      "namn": "Transformerad",
      "text": "Sökande efter nya modeller är en del av innovationsstrategin"
     }
    ],
    "intern": [
     "Gör en nulägesanalys av nuvarande affärsmodell och reflektera över dess antaganden.",
     "Identifiera alternativa intäktslogiker och testa dem i liten skala tillsammans med kunder.",
     "Genomför återkommande experiment med nya erbjudanden och analysera vad ni lär av varje försök.",
     "Pröva er nuvarande affärsmodell mot ett scenario där den slutar fungera, och låt en extern part utmana era antaganden."
    ],
    "extern": [
     "Låt facilitator leda workshop om nya affärsmodeller i er bransch.",
     "Ta hjälp att testa idéer med kunder genom intervjuer eller mock-ups.",
     "Låt extern part stödja strukturerade experiment (Lean Startup m.fl.).",
     "Delta i forskning eller branschinitiativ om nya affärsmodeller och låt dem utmana era antaganden."
    ],
    "atgard": {
     "Ja": [
      "Gör en enkel kartläggning av hur ni skapar, levererar och fångar värde idag. Diskutera antagandena bakom modellen.",
      "Välj ett erbjudande och testa en alternativ värde- eller intäktslogik i liten skala, gärna tillsammans med en beställare eller kund som är villig att pröva.",
      "Gör försök med affärsmodellen till en löpande del av utvecklingsarbetet: ha alltid minst ett pågående försök med en ny värde- eller intäktslogik, och låt ledningsgruppen följa upp vad det lär er.",
      "Utforska affärsmodeller tillsammans med beställare och partner, där nya intäktslogiker kräver att flera aktörer ändrar sig samtidigt."
     ],
     "Fortsätt": [
      "Fortsätt med befintlig modell, och fråga en gång per år: vad skulle få vår affärsmodell att sluta fungera?",
      "Fortsätt utveckla testet och följ upp vilka lärdomar ni får om kundbehov och värde.",
      "Fortsätt experimentera med nya erbjudanden och följ upp lärandet i organisationen.",
      "Fortsätt utveckla era modeller men håll fast vid reflektion kring värdeskapande, inte bara tillväxt."
     ],
     "Utred": [
      "Kartlägg vilka yttre faktorer (kundbeteende, teknik, regelverk) som kan påverka er affärslogik.",
      "Utred vilka delar av affärsmodellen som är mest känsliga för förändring.",
      "Utred hur nya affärsmodeller kan integreras i styrning och målstruktur.",
      "Utred vilka av era bärande antaganden från Sense som skulle behöva ändras för att en ny affärsmodell ska fungera."
     ],
     "Vänta": [
      "Vänta tills ni vet mer om marknaden, men bestäm vilken information ni behöver och vem som tar fram den.",
      "Avvakta tills nuvarande satsningar utvärderats men samla idéer från kunder eller partners.",
      "Vänta tills pilotprojekt är avslutade men analysera resultaten tillsammans med teamen.",
      "Vänta tills resurser finns att bredda arbetet men håll reflektionen levande i ledningen."
     ],
     "Nej": [
      "Om ni avstår, håll ändå koll på hur beställarnas krav och upphandlingsformer förändras. Där syns förändringar först.",
      "Om ni väljer bort utforskning, ge någon i uppdrag att följa hur kunder och beställare förändrar sina krav.",
      "Om ni pausar, skriv ner vilka möjligheter ni avstår från. Listan blir användbar när förutsättningarna ändras.",
      "Om ni slutar utforska, var uppmärksamma på att en framgångsrik affärsmodell är som svårast att ifrågasätta."
     ]
    }
   },
   {
    "id": 9,
    "namn": "Kompetensförsörjning",
    "vad": "Förmågan att säkra rätt förmåga även utanför egna nätverk",
    "syfte": "För att organisationen ska kunna växa och utvecklas i takt med nya krav och teknologier",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Kompetens ses som en HR-fråga"
     },
     {
      "namn": "Konceptuell",
      "text": "Kompetensbehov identifieras men inte systematiskt"
     },
     {
      "namn": "Definierad",
      "text": "Kompetenskartläggning görs regelbundet"
     },
     {
      "namn": "Integrerad",
      "text": "Kompetensförsörjning är strategisk del av utveckling"
     },
     {
      "namn": "Transformerad",
      "text": "Organisationen söker aktivt nya partners och lärandemiljöer utanför sitt nätverk"
     }
    ],
    "intern": [
     "Kartlägg vilken kompetens som är kritisk för utveckling och var den finns idag.",
     "Utveckla en plan för intern kompetensutveckling och lärande mellan team.",
     "Etablera samarbeten med externa aktörer som kompletterar era kompetensbehov.",
     "Pröva om era partnerskap fortfarande tillför något nytt, eller om de har blivit bekväma. Sök medvetet partner som tänker annorlunda än ni."
    ],
    "extern": [
     "Ta hjälp att analysera framtida kompetensbehov och lärandegap.",
     "Anlita stöd för att identifiera nya kompetensspår och samarbeten.",
     "Be extern part hjälpa till att bygga partnerskap för långsiktig kompetens.",
     "Delta i nätverk utanför er egen bransch, där ni möter kompetens som ni inte redan har."
    ],
    "atgard": {
     "Ja": [
      "Välj de två eller tre kompetenser som scenariot kräver mest, och bedöm om ni ska bygga dem själva, rekrytera eller samarbeta för att få dem.",
      "Gör kompetenskartläggningen regelbunden, en gång per år och med en ansvarig, och koppla den till de förändringar ni ser i omvärlden. Skapa samtidigt vägar för kunskap att följa med människor, till exempel rotation mellan projekt eller mentorskap.",
      "Etablera partnerskap med externa aktörer för att stärka kompetens och innovation. Se till att någon internt äger samarbetet och har kunskap nog att ta emot det ni lär er.",
      "Utveckla kompetens tillsammans med partner i era projekt, till exempel genom gemensamma utbildningar eller utbyte av personer."
     ],
     "Fortsätt": [
      "Fortsätt, och fråga vid varje rekrytering: vilken kompetens behöver vi om fem år, inte bara i dag?",
      "Fortsätt med befintliga lärinsatser men följ upp hur de bidrar till verksamhetsmål.",
      "Fortsätt samarbetena, och se till att någon internt tar emot och sprider det ni lär er av partnerna.",
      "Fortsätt och förvalta partnerskapen; håll fokus på lärande och ömsesidigt värde."
     ],
     "Utred": [
      "Utred vilka kompetenser som saknas för att möta nya krav eller förändrad teknik.",
      "Utred hur lärande och kompetensutveckling kan integreras i vardagen snarare än ske vid sidan av.",
      "Utred hur samarbeten och interna program kan kopplas till strategi och styrning.",
      "Utred om ni har för mycket eller för lite av er kritiska kompetens i egen regi, jämfört med det ni får genom partner."
     ],
     "Vänta": [
      "Vänta tills pågående organisationsförändringar är klara men samla idéer om framtida behov.",
      "Avvakta tills nuvarande utbildningsinsatser är utvärderade men dokumentera lärdomarna.",
      "Vänta tills pågående samarbeten har utvärderats, men samla erfarenheter.",
      "Vänta tills resurser finns för bredare satsning men håll dialogen med nyckelaktörer levande."
     ],
     "Nej": [
      "Om ni avstår, identifiera åtminstone de personer vars kunskap ni inte har råd att förlora.",
      "Om ni väljer bort utvecklingsinsatser, bestäm hur ni ändå ska få tillgång till den kompetens som saknas, till exempel genom inhyrning eller samarbete.",
      "Dokumentera varför partnerskap pausas och hur ni hanterar kunskapsbehov under tiden.",
      "Om ni pausar, var uppmärksamma på att kompetens tar år att bygga men kan försvinna med några få personer."
     ]
    }
   },
   {
    "id": 10,
    "namn": "Förändringsledning",
    "vad": "Förmågan att leda människor och processer genom osäkerhet",
    "syfte": "För att skapa engagemang och trygghet i förändring och säkerställa att nödvändiga initiativ blir genomförda",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Förändring sker ad hoc, utan ledarskap eller process"
     },
     {
      "namn": "Konceptuell",
      "text": "Vi inser behovet men saknar gemensamma arbetssätt"
     },
     {
      "namn": "Definierad",
      "text": "Det finns definierade roller och processer för förändringsledning"
     },
     {
      "namn": "Integrerad",
      "text": "Förändringsledning är en naturlig del i alla utvecklingsinitiativ"
     },
     {
      "namn": "Transformerad",
      "text": "Kultur och struktur gör förändring till vardag"
     }
    ],
    "intern": [
     "Lista pågående förändringar och analysera varför de har lyckats eller misslyckats. Vad lär vi oss?",
     "Skapa ett gemensamt arbetssätt för små förändringsinitiativ (t.ex. checklista eller mall).",
     "Integrera förändringsledning i projektmodeller och utvecklingsprocesser och följ upp effekten.",
     "Låt de som berördes av era senaste förändringar, inte de som ledde dem, bedöma hur väl de genomfördes."
    ],
    "extern": [
     "Ta in processledare för att facilitera lärande av tidigare förändringscase.",
     "Låt coach träna chefer i reflekterande förändringsledning.",
     "Ta hjälp att utveckla indikatorer för förändringsklimat och engagemang.",
     "Bjud in externa experter för att stress-testa er förändringskultur mot framtiden."
    ],
    "atgard": {
     "Ja": [
      "Samla erfarenheter från tidigare förändringar och prata om vad ni lärde er, inte bara om vad som gick fel.",
      "Skapa en enkel metod för små förändringar med tydligt syfte och reflektion, och låt dem som berörs vara med och utforma förändringen.",
      "Integrera förändringsledning i projekt- och styrmodeller. Gör reflektion och lärande till en del av processen.",
      "Led förändringar tillsammans med partner i era projekt, där förändringen kräver att flera organisationer ändrar sig."
     ],
     "Fortsätt": [
      "Fortsätt pågående förändring men avsätt tid för korta reflektioner efter varje steg.",
      "Fortsätt använda er metod men följ upp hur den påverkar engagemang och tempo.",
      "Fortsätt arbetet men skapa forum där chefer och medarbetare delar erfarenheter av förändring.",
      "Fortsätt, och var uppmärksamma på förändringströtthet. Fler förändringar samtidigt är inte alltid mer förändring."
     ],
     "Utred": [
      "Kartlägg hur förändringar drivs idag och var kommunikationen eller engagemanget brister.",
      "Utred vilka delar av organisationen som saknar stöd i förändringsarbete och vad som krävs.",
      "Utred hur förändringsarbetet kan bli mer lärandeorienterat och mindre reaktivt.",
      "Utred hur beredskapen för förändring skiljer sig mellan olika delar av organisationen, och varför."
     ],
     "Vänta": [
      "Vänta tills nuvarande förändringar stabiliserats men dokumentera observationer.",
      "Avvakta tills pågående initiativ är avslutade men håll kvar fokus på lärande.",
      "Vänta tills ny modell testats i mindre skala men följ upp resultaten.",
      "Vänta tills resurser finns för spridning men behåll strukturen för reflektion i vardagen."
     ],
     "Nej": [
      "Om ni avstår, genomför ändå inga större förändringar utan att de berörda har fått vara med och påverka.",
      "Om ni väljer bort arbetet, gör ändå en kort genomgång efter varje större förändring tillsammans med några av dem som berördes.",
      "Om förändringsstödet pausas, säg det öppet och följ upp hur de som berörs av pågående förändringar har det och vad de behöver.",
      "Om ni pausar, använd tiden till att låta tidigare förändringar sätta sig. Det kan vara mer värt än en ny förändring."
     ]
    }
   },
   {
    "id": 11,
    "namn": "System- och teknologiförståelse",
    "vad": "Förmågan att se samband mellan teknik, processer och mål",
    "syfte": "För att kunna fatta kloka beslut om investeringar, interoperabilitet och resurseffektivitet",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Teknik ses som en isolerad fråga"
     },
     {
      "namn": "Konceptuell",
      "text": "Vi förstår kopplingen mellan verksamhet och teknik men analyserar den sällan"
     },
     {
      "namn": "Definierad",
      "text": "Vi har kompetens att analysera systemberoenden"
     },
     {
      "namn": "Integrerad",
      "text": "Systemtänkande präglar beslutsfattande"
     },
     {
      "namn": "Transformerad",
      "text": "Organisationen optimerar helheten och lär av sina beroenden"
     }
    ],
    "intern": [
     "Identifiera beroenden mellan teknik, process och mål i ett konkret projekt.",
     "Utbilda projektledare i grundläggande systemtänk och reflektion kring teknikens roll.",
     "Integrera teknologiska scenarier i strategisk planering och följ upp hur de påverkar arbetet.",
     "Låt en extern part granska om er systemhelhet fortfarande håller när nya verktyg, till exempel AI, kommer in."
    ],
    "extern": [
     "Ta hjälp att visualisera beroenden mellan teknik, process och mål.",
     "Anlita experter för risk- och beroendeanalyser ur systemperspektiv.",
     "Ta in stöd för att testa ny teknik i pilotskala och reflektera över utfall.",
     "Samarbeta i bransch- eller forskningsprojekt kring systemintegration och lärande."
    ],
    "atgard": {
     "Ja": [
      "Välj ett tekniskt beslut som ska fattas snart och gå igenom vilka processer och parter det påverkar innan ni bestämmer er.",
      "Utbilda team i hur tekniska beslut påverkar processer och mål. Använd ett konkret case som underlag.",
      "Utse i varje större projekt en aktör som äger den digitala helheten, med gemensamma digitala mål och en gemensam informationsstruktur för alla parter.",
      "Driv gemensamma digitala mål och informationsstrukturer tillsammans med beställare och partner, så att digital nytta mäts i projektets gemensamma effektivitet."
     ],
     "Fortsätt": [
      "Fortsätt, och fråga efter varje projekt: vilket system skapade dubbelarbete, och varför?",
      "Fortsätt, och låt användarna i produktionen vara med när tekniska val görs.",
      "Fortsätt utveckla systemförståelsen men lägg till regelbundna genomgångar av samband och risker.",
      "Fortsätt, och följ upp de digitala målen i projekten över hela projekttiden, inte bara vid start."
     ],
     "Utred": [
      "Kartlägg vilka tekniska system som används, av vem och hur de stöder eller hindrar helhetssyn, även i gränssnitten mot beställare, konsulter och underentreprenörer.",
      "Utred var det saknas kompetens för att förstå tekniska samband och vad som krävs för att stärka den.",
      "Utred hur samspel mellan teknik, människor och processer kan stärkas genom gemensamma rutiner.",
      "Utred var era system inte går att koppla ihop med beställares och partners system, och vad det kostar i dubbelarbete."
     ],
     "Vänta": [
      "Vänta tills nuvarande digitaliseringsinitiativ är avslutade men dokumentera insikter under tiden.",
      "Avvakta tills ni har översikt över pågående system, men samla input från användarna.",
      "Vänta tills nuvarande investeringar utvärderats men håll reflektionen levande i projekten.",
      "Vänta med bred spridning, men behåll ansvaret för den digitala helheten i de projekt där det redan finns."
     ],
     "Nej": [
      "Om ni avstår, se till att ingen ny teknik införs i ett projekt utan att någon har tänkt igenom hur den påverkar de andra parterna.",
      "Om ni väljer bort arbetet, säkra att någon ansvarar för tekniska beroenden i större projekt.",
      "Om ni avstår, var uppmärksamma på att digitala initiativ utan gemensam riktning tenderar att bli öar som inte går att koppla ihop.",
      "Om ni pausar, behåll ändå en person som har överblick över era system och deras beroenden."
     ]
    }
   },
   {
    "id": 12,
    "namn": "Omvärldsbevakning och kunskapsinhämtning",
    "vad": "Förmågan att upptäcka, värdera och ta in kunskap, teknik och idéer utifrån",
    "syfte": "För att tidigt uppfatta förändringar och kunna dra nytta av forskning, ny teknik och andras erfarenheter i stället för att uppfinna allt själva",
    "nivaer": [
     {
      "namn": "Omedveten",
      "text": "Ny kunskap kommer in av en slump, om alls"
     },
     {
      "namn": "Konceptuell",
      "text": "Enskilda medarbetare håller sig uppdaterade, men det de hittar når sällan andra"
     },
     {
      "namn": "Definierad",
      "text": "Det finns ansvar och forum för att bevaka omvärlden och värdera det som hittas"
     },
     {
      "namn": "Integrerad",
      "text": "Externa insikter tas regelbundet in i strategi, projekt och beslut"
     },
     {
      "namn": "Transformerad",
      "text": "Organisationen söker aktivt och brett, samarbetar med forskning och tar till sig nytt snabbare än andra"
     }
    ],
    "intern": [
     "Kartlägg var ny kunskap kommer in i dag: vem läser, vem går på konferenser, vem har kontakt med forskning, och vad händer med det de hittar?",
     "Utse personer som bevakar var sitt område och ge dem en stående punkt där de berättar vad de har hittat.",
     "Koppla bevakningen till era beslut: låt varje större strategiskt eller tekniskt beslut föregås av frågan vad andra redan vet.",
     "Pröva om ni söker tillräckligt brett. Organisationer som bara bevakar sin egen bransch riskerar att se förändringar för sent."
    ],
    "extern": [
     "Ta hjälp av ett lärosäte eller en branschorganisation för att få en första överblick över vad som händer inom era viktigaste områden.",
     "Delta i ett innovationsprogram eller forskningsprojekt för att få tillgång till ny kunskap och till människor som arbetar med den.",
     "Bygg långsiktiga relationer med några forskargrupper, till exempel genom examensarbeten, adjungerade tjänster eller gemensamma projekt.",
     "Sök kunskap utanför er egen bransch, där lösningar på era problem ofta redan finns."
    ],
    "atgard": {
     "Ja": [
      "Börja med en fråga som är viktig för scenariot och ta reda på vad forskning och andra organisationer redan vet om den.",
      "Utse en eller två personer som ansvarar för bevakning inom ett avgränsat område, och ge dem tid och ett forum att berätta i.",
      "Skapa en rutin där det som hittas värderas: vad betyder det för oss, och vem tar det vidare? Bevakning utan värdering blir bara information.",
      "Sök medvetet utanför er egen bransch, och bjud in forskare och andra branscher att utmana era antaganden."
     ],
     "Fortsätt": [
      "Fortsätt, och be dem som redan håller sig uppdaterade att dela det viktigaste de har hittat med kollegorna en gång i månaden.",
      "Fortsätt, och följ upp hur mycket av det som hittas som leder till något: en diskussion, ett test eller ett beslut.",
      "Fortsätt, och bredda sökandet till områden som ligger utanför det ni redan är bra på.",
      "Fortsätt, och var uppmärksamma på att det som inte är uppfunnet hos er själva lätt värderas lägre än det borde."
     ],
     "Utred": [
      "Kartlägg vilka källor till ny kunskap ni har i dag och vilka viktiga områden som ingen bevakar.",
      "Utred varför det som enskilda hittar inte når andra: saknas forum, tid eller intresse?",
      "Utred hur väl er bevakning har förutsett förändringar de senaste åren. Vad såg ni i tid, och vad missade ni?",
      "Utred hur ni kan dela bevakningen med partner i era projekt, så att alla parter ser samma förändringar."
     ],
     "Vänta": [
      "Vänta med en organiserad bevakning, men be var och en i ledningsgruppen att ta med en extern insikt till varje möte.",
      "Avvakta med att formalisera ansvaret, men samla det som enskilda hittar på ett ställe där andra kan ta del av det.",
      "Vänta med att bygga ut bevakningen, men använd Sense-scenariot för att avgöra vilka områden som är viktigast att följa.",
      "Vänta med nya satsningar, men behåll relationerna med forskning och andra branscher. De tar lång tid att bygga upp igen."
     ],
     "Nej": [
      "Om ni avstår, se till att åtminstone stora beslut om teknik och arbetssätt föregås av en kontroll av vad andra redan vet.",
      "Om ni avstår, var medvetna om att ni då är beroende av att leverantörer och konsulter berättar om nyheter, utifrån sina egna intressen.",
      "Om ni avstår, behåll åtminstone kontakten med branschens innovationsprogram, där mycket av den nya kunskapen samlas.",
      "Om ni pausar, var uppmärksamma på att förändringar som ni inte ser ändå kommer, bara utan förvarning."
     ]
    }
   }
  ],
  "omdome": [
   {
    "namn": "Omedveten",
    "text": "Organisationen befinner sig i ett tidigt skede av lärandeutveckling. Förnyelse sker ad hoc och styrs ofta av eldsjälar snarare än av struktur. Fokus bör ligga på att skapa gemensam förståelse för vad lärande innebär i praktiken och att etablera grundläggande rutiner för reflektion, uppföljning och kunskapsdelning."
   },
   {
    "namn": "Konceptuell",
    "text": "Insikten om behovet av lärande finns, men arbetssätt och ansvar är ännu otydliga. Initiativ pågår, men de saknar ofta koppling till ledningens prioriteringar eller till organisationens mål. Nästa steg är att omsätta ambition till praktik genom att testa enkla former för lärande arbetssätt i liten skala."
   },
   {
    "namn": "Definierad",
    "text": "Lärande är etablerat som en del av utvecklingsarbetet, men sker fortfarande inom begränsade områden. Roller, metoder och forum finns, och nu handlar det om att öka tempo, systematik och tvärfunktionell spridning. Reflektion och mätning bör integreras i styrningen för att befästa lärandekulturen."
   },
   {
    "namn": "Integrerad",
    "text": "Organisationen präglas av reflektion, samverkan och kontinuerlig förbättring. Lärande sker naturligt i vardagen och genomsyrar beslutsfattande, ledarskap och innovation. Fokus framåt är att bevara dynamiken: att fortsätta utmana sig själv, dela erfarenheter externt och använda lärandet som strategisk konkurrensfördel."
   }
  ]
 }
};
