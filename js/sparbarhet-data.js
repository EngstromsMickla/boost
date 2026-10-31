// Data för sidan Spårbarhet: reglerna, vad källorna bär och ändringsloggen. Uppdateras när reglerna i koden ändras (se CLAUDE.md).
window.SPAR = {
 "rubrik": "Spårbarhet",
 "ingress": "Här kan vem som helst kontrollera hur verktygen tar fram sina rekommendationer: vilka regler som avgör vad som visas, alla texter som kan visas och när, och vilka källor de bygger på. Texterna och litteraturen byggs direkt ur samma innehållsfiler som verktygen använder, så de stämmer alltid med den publicerade versionen. Reglerna är beskrivna för hand utifrån koden och uppdateras när koden ändras.",
 "upphov": "Verktygen är utvecklade av Dan Engström, och digitaliserade med stöd av Claude Opus 5.5.",
 "granskning": "Granskat av upphovsmannen. Ytterligare detaljgranskning pågår.",
 "typer": {
  "Forskning": "En källa i litteraturlistan stöder regeln eller den princip som gränsen följer.",
  "Princip i Teoriplattformen": "Gränsen följer skalans etiketter.",
  "Designval": "Ett omdöme som är satt för verktyget, utan någon direkt källa. Gruppen kan alltid välja annorlunda."
 },
 "kodbas": "https://github.com/EngstromsMickla/boost/blob/main/",
 "regler": [
  {
   "id": "SEE-1",
   "modul": "See",
   "steg": "Profil",
   "regel": "Lärandeindex = medelvärdet av de tolv skattningarna (skala 0 till 4 i halvsteg).",
   "param": "Medelvärde, ingen viktning",
   "grund": "Dawes 1979; OECD & JRC 2008 (lika vikter när det saknas belägg för andra)",
   "typ": "Forskning",
   "kod": "see/app.js: profile()"
  },
  {
   "id": "SEE-2",
   "modul": "See",
   "steg": "Profil",
   "regel": "Omdöme om hela organisationen följer stegprincipen: indexet (avrundat till en decimal, som det visas) under 1 Omedveten, under 2 Konceptuell, under 3 Definierad, annars Integrerad.",
   "param": "1 / 2 / 3",
   "grund": "Pöppelbuß & Röglinger 2011 (steg mellan nivåer)",
   "typ": "Forskning",
   "kod": "see/app.js: band(), profile()"
  },
  {
   "id": "SEE-3",
   "modul": "See",
   "steg": "Profil",
   "regel": "Profilens form: skillnaden mellan högsta och lägsta skattning under 1 ger jämn, under 2 ojämn, annars taggig.",
   "param": "1 / 2",
   "grund": "Norman, Sloan & Wyrwich 2003 (ett helt skalsteg)",
   "typ": "Forskning",
   "kod": "see/app.js: profile()"
  },
  {
   "id": "SEE-4",
   "modul": "See",
   "steg": "Välj förmågor",
   "regel": "Verktyget föreslår de tre lägst skattade förmågorna. Vid lika värden visas alla som delar tredje platsen. Gruppen kan byta.",
   "param": "3 förmågor",
   "grund": "Ingen källa; resonemanget om svagaste länk i valtext",
   "typ": "Designval",
   "kod": "see/app.js: proposal()"
  },
  {
   "id": "SEE-5",
   "modul": "See",
   "steg": "Styrka",
   "regel": "Högsta förmåga som inte är vald lyfts fram som styrka om den ligger minst 1,0 över medianen och avståndet är minst lika stort som de valdas avstånd under medianen.",
   "param": "1,0 över medianen",
   "grund": "Ett helt skalsteg (Norman m.fl. 2003); villkoret i övrigt är ett designval",
   "typ": "Designval",
   "kod": "see/app.js: strength()"
  },
  {
   "id": "SEE-6",
   "modul": "See",
   "steg": "Agency",
   "regel": "Alla axlar skattas med påståenden på en instämmandeskala 1 till 5: Förmåga = medel av K1, K2. Mandat = medel av formellt (F1, F2) och upplevt (U1, U2). Vilja = medel av V1, V2. Tilltro = T1. Äldre körningar utan K1 och K2 använder nivån + 1 tills påståendena är besvarade.",
   "param": "",
   "grund": "Blumberg & Pringle 1982; Michie m.fl. 2011; Kanter 1977; Spreitzer 1995; Emirbayer & Mische 1998",
   "typ": "Forskning",
   "kod": "see/app.js: axes()"
  },
  {
   "id": "SEE-7",
   "modul": "See",
   "steg": "Diagnos",
   "regel": "Svagaste axel = lägst av förmåga, mandat och vilja. Är skillnaden mellan högsta och lägsta under ett helt skalsteg blir resultatet jämn. Ligger de två lägsta under ett skalsteg från varandra pekas båda ut.",
   "param": "1 skalsteg",
   "grund": "Michie m.fl. 2011 (COM-B); Marín-García & Martínez Tomás 2016; Norman m.fl. 2003",
   "typ": "Forskning",
   "kod": "see/app.js: diagnosis()"
  },
  {
   "id": "SEE-8",
   "modul": "See",
   "steg": "Diagnos",
   "regel": "Mandatglapp: formellt minus upplevt minst 1 ger Mandatet finns på papperet; upplevt minus formellt minst 1 ger Eldsjälar utan formellt stöd.",
   "param": "1,0",
   "grund": "Kanter 1977; Spreitzer 1995; Norman m.fl. 2003 (ett helt skalsteg)",
   "typ": "Forskning",
   "kod": "see/app.js: diagnosis()"
  },
  {
   "id": "SEE-9",
   "modul": "See",
   "steg": "Diagnos",
   "regel": "Tilltroglapp: förmåga minus tilltro minst ett skalsteg ger låg tilltro; tilltro minus förmåga minst ett skalsteg ger risk för överskattning.",
   "param": "1 skalsteg",
   "grund": "Weiner 2009 (change efficacy); Norman m.fl. 2003",
   "typ": "Forskning",
   "kod": "see/app.js: diagnosis()"
  },
  {
   "id": "SEE-10",
   "modul": "See",
   "steg": "Beslut",
   "regel": "Varning om beslutet Ja tas när viljan ligger under Stämmer delvis (högst 2,5), och om Vänta eller Nej väljs när viljan är minst Stämmer ganska bra (4).",
   "param": "2,5 / 4",
   "grund": "Skalans etiketter",
   "typ": "Princip i Teoriplattformen",
   "kod": "see/app.js: diagnosis()"
  },
  {
   "id": "SEE-11",
   "modul": "See",
   "steg": "Åtgärder",
   "regel": "Åtgärdstexten väljs efter beslut och förmågans nivå enligt stegprincipen: 0 till 0,5 steg 1, 1 till 1,5 steg 2, 2 till 2,5 steg 3, 3 till 4 steg 4. Internt och Ta hjälp med att väljs på samma sätt.",
   "param": "1 / 2 / 3",
   "grund": "Pöppelbuß & Röglinger 2011; texterna prövade mot källorna för varje förmåga (se Teoriplattformen)",
   "typ": "Forskning",
   "kod": "see/app.js: diagnosis(), band()"
  },
  {
   "id": "SEE-12",
   "modul": "See",
   "steg": "Rapport",
   "regel": "Om samma axel är svagast i minst två valda förmågor skriver rapporten att hindret är gemensamt och föreslår den axelns första steg. Annars att hindren ser olika ut.",
   "param": "Minst 2 förmågor",
   "grund": "Ingen källa",
   "typ": "Designval",
   "kod": "see/app.js: summary()"
  },
  {
   "id": "SEE-13",
   "modul": "See",
   "steg": "Rapport",
   "regel": "Förslag i sammanfattningen: för varje vald förmåga åtgärdstexten plus första steget för svagaste axeln. Är förslagen färre än tre och en styrka finns läggs styrkeförslaget till. Högst tre, därefter Nästa steg: Shift.",
   "param": "Högst 3 förslag",
   "grund": "Fast rapportmall",
   "typ": "Designval",
   "kod": "see/app.js: summary()"
  },
  {
   "id": "SEN-1",
   "modul": "Sense",
   "steg": "Skede 0",
   "regel": "Fokusfrågan föreslås ur valda utmaningar (högst tre i listan) och tidshorisont. En utmaning kopplad till en tillämpning har en egen frågemall.",
   "param": "Högst 3 utmaningar i frågan",
   "grund": "Ramírez & Wilkinson 2016 (fokusfråga)",
   "typ": "Forskning",
   "kod": "sense/app.js: forslagFraga()"
  },
  {
   "id": "SEN-2",
   "modul": "Sense",
   "steg": "Skede 0 till 1",
   "regel": "Varje utmaning pekar ut områden (16 utmaningar mot 13 områden). Det första exemplet i varje utpekat område läggs in som signal och trend.",
   "param": "Mappningen i content.js",
   "grund": "Litteratur och branschagendor enligt CLAUDE.md, men ingen källa är angiven per utmaning",
   "typ": "Designval",
   "kod": "sense/app.js: fokusOmraden(), seedTrender()"
  },
  {
   "id": "SEN-3",
   "modul": "Sense",
   "steg": "Skede 2",
   "regel": "Trendklass: påverkan Stor eller Omvälvande och säkerhet Ingen vet, Osäker eller Kanske ger kritisk osäkerhet; samma påverkan och säkerhet Trolig eller Helt säker ger förutbestämt element; påverkan Märkbar ger bevaka; lägre ger lägg åt sidan.",
   "param": "Påverkan minst 3, säkerhet högst 2 (skala 0 till 4)",
   "grund": "Wack 1985; Burt & Wright 2006; skalans etiketter",
   "typ": "Forskning",
   "kod": "sense/app.js: klass()"
  },
  {
   "id": "SEN-4",
   "modul": "Sense",
   "steg": "Skede 3",
   "regel": "Fem trender föreslås till påverkansmatrisen: kritiska först, sedan bevaka, sedan förutbestämda; inom klass högst påverkan och lägst säkerhet.",
   "param": "5 trender",
   "grund": "Vester 2007 (förenklad)",
   "typ": "Designval",
   "kod": "sense/app.js: urvalForslag()"
  },
  {
   "id": "SEN-5",
   "modul": "Sense",
   "steg": "Skede 3",
   "regel": "Påverkansmatris: 20 frågor (0 till 3). Aktiv och passiv summa jämförs med medelvärdet: hög aktiv och låg passiv = drivande, båda höga = kritisk, låg aktiv och hög passiv = påverkad, båda låga = buffrande.",
   "param": "Medelvärdet som gräns",
   "grund": "Vester 2007; Godet 1994 (MICMAC)",
   "typ": "Forskning",
   "kod": "sense/app.js: sums()"
  },
  {
   "id": "SEN-6",
   "modul": "Sense",
   "steg": "Skede 4",
   "regel": "Två axlar föreslås: osäkra trender (säkerhet högst 2) först, sedan högst aktiv summa, sedan högst påverkan.",
   "param": "2 axlar",
   "grund": "Wright, Bradfield & Cairns 2013 (intuitive logics); Vester 2007",
   "typ": "Forskning",
   "kod": "sense/app.js: axelForslag()"
  },
  {
   "id": "SEN-7",
   "modul": "Sense",
   "steg": "Skede 4",
   "regel": "Varning om en vald axel har säkerhet minst 3, och om den ena axeln driver den andra med 3 i matrisen.",
   "param": "Säkerhet 3; matrisvärde 3",
   "grund": "Intuitive logics: axlarna ska vara osäkra och oberoende (Wright m.fl. 2013)",
   "typ": "Forskning",
   "kod": "sense/app.js: axelVarningar()"
  },
  {
   "id": "SEN-8",
   "modul": "Sense",
   "steg": "Skede 5 till 6",
   "regel": "Vindtunnel: varje vald bärande del bedöms i varje framtid som försvagas, står sig eller stärks, och verksamhetens ställning bedöms per framtid.",
   "param": "Tio bärande delar",
   "grund": "van der Heijden 2005; Osterwalder & Pigneur 2010; Dewar 2002",
   "typ": "Forskning",
   "kod": "sense/app.js: vardeStat()"
  },
  {
   "id": "SEN-9",
   "modul": "Sense",
   "steg": "Skede 7",
   "regel": "En bärande del räknas som sårbar om den försvagas i minst två av fyra framtider, och som styrka om den stärks i minst två.",
   "param": "Minst 2 av 4",
   "grund": "Lempert, Popper & Bankes 2003 (robusthet)",
   "typ": "Forskning",
   "kod": "sense/app.js: sammanfattning()"
  },
  {
   "id": "SEN-10",
   "modul": "Sense",
   "steg": "Skede 8",
   "regel": "Kollisioner föreslås ur bärande delar som försvagas i minst en framtid, flest först, med namnet X under tryck.",
   "param": "Minst 1 framtid",
   "grund": "Dewar 2002",
   "typ": "Forskning",
   "kod": "sense/app.js: kollForslag()"
  },
  {
   "id": "SEN-11",
   "modul": "Sense",
   "steg": "Skede 8",
   "regel": "Synlighet 1 eller 2 (Ingen talar om den, Någon enstaka) ger texten om dold kollision; med tryck minst 4 visas dessutom en varning.",
   "param": "Synlighet högst 2",
   "grund": "Ingen källa",
   "typ": "Designval",
   "kod": "sense/app.js: sammanfattning(), renderKarta()"
  },
  {
   "id": "SEN-12",
   "modul": "Sense",
   "steg": "Skede 8",
   "regel": "Framtiden som föreslås till See: flest försvagade kollisionsdelar (10 poäng vardera), plus 5 om verksamhetens ställning försämras och 2 om den står sig.",
   "param": "10 / 5 / 2",
   "grund": "Ingen källa",
   "typ": "Designval",
   "kod": "sense/app.js: seeForslag()"
  },
  {
   "id": "SEN-13",
   "modul": "Sense",
   "steg": "Rapport",
   "regel": "Sammanfattningen skriver att axlarna är osäkra och drivande bara när gruppen följde förslaget utan varningar; annars att gruppen valde dem.",
   "param": "",
   "grund": "",
   "typ": "Designval",
   "kod": "sense/app.js: sammanfattning()"
  },
  {
   "id": "SHI-1",
   "modul": "Shift",
   "steg": "Underlag",
   "regel": "Behoven hämtas från See: varje vald förmåga med sin svagaste axel. Är axlarna jämna används den lägsta. Utan See anger gruppen behov, axel och nivå 1 till 5.",
   "param": "",
   "grund": "Fred & Mukhtar-Landgren 2022; Michie m.fl. 2011",
   "typ": "Forskning",
   "kod": "shift/app.js: behovLista()"
  },
  {
   "id": "SHI-2",
   "modul": "Shift",
   "steg": "Riktning",
   "regel": "Förslag på lärandefrågor: de högst tre kollisionerna (efter tryck) gånger de högst tre behoven, med en mall per axel. Högst sex förslag och högst tre frågor.",
   "param": "3 x 3, högst 6",
   "grund": "Gioia & Chittipeddi 1991 (sensegiving); Michie m.fl. 2011",
   "typ": "Forskning",
   "kod": "shift/app.js: forslagFragor()"
  },
  {
   "id": "SHI-3",
   "modul": "Shift",
   "steg": "Trimförsök",
   "regel": "Försökstyp följer frågans axel: förmåga ger Bygga förmåga, mandat ger Ändra förutsättningar, vilja ger Göra nyttan synlig. Tre exempel per typ.",
   "param": "",
   "grund": "Michie m.fl. 2011 (COM-B och Behaviour Change Wheel)",
   "typ": "Forskning",
   "kod": "shift/app.js: newForsok()"
  },
  {
   "id": "SHI-4",
   "modul": "Shift",
   "steg": "Trimförsök",
   "regel": "Försöket kräver namn, om-då-hypotes, startdatum (förslag tre dagar fram) och förutsägelse. Avläsning efter 7, 14 eller 30 dagar.",
   "param": "3 dagar; 7/14/30 dagar",
   "grund": "Gollwitzer & Sheeran 2006; Reed & Card 2016; Institute for Healthcare Improvement",
   "typ": "Forskning",
   "kod": "shift/app.js: newForsok(), forsokKlar()"
  },
  {
   "id": "SHI-5",
   "modul": "Shift",
   "steg": "Kursavläsning",
   "regel": "Avläsningen kräver vad som hände, jämförelse med förutsägelsen, lärdomens väg (stannar, delad, införd), axelns värde nu (1 till 5), beslut och nästa lilla försök.",
   "param": "",
   "grund": "Zollo & Winter 2002; Weick 1984; Amabile & Kramer 2011",
   "typ": "Forskning",
   "kod": "shift/app.js: avKlar()"
  },
  {
   "id": "SHI-6",
   "modul": "Shift",
   "steg": "Rörelse",
   "regel": "Rörelsen = axelns värde vid senaste avläsningen jämfört med värdet från See. Med underlag från See skattas axeln med ett påstående på samma instämmandeskala; utan See med gruppens egen skala.",
   "param": "",
   "grund": "Zahra & George 2002 (potentiell till realiserad förmåga)",
   "typ": "Forskning",
   "kod": "shift/app.js: rorelse()"
  },
  {
   "id": "SHI-7",
   "modul": "Shift",
   "steg": "Rapport",
   "regel": "Lärdomens väg som tidigare. Rapporten skiljer på att alla, några eller inga uppföljda lärandefrågor har rört sig uppåt.",
   "param": "Minst 1 upp",
   "grund": "Zollo & Winter 2002",
   "typ": "Designval",
   "kod": "shift/app.js: rapportBlock()"
  },
  {
   "id": "SHI-8",
   "modul": "Shift",
   "steg": "Spel (Förmågefällan)",
   "regel": "Spelet är frivilligt och kommer före Learning Direction Canvas. Det spelas med den axel som oftast är svagast bland behoven från See eller underlaget (vid lika den som gäller det första behovet); gruppen kan byta. Åtta veckor med samma händelser för alla, utom vecka 6 som beror på axeln.",
   "param": "8 veckor; 0, 4, 8 eller 12 timmar förbättringstid; högst ett kort per vecka",
   "grund": "Repenning & Sterman 2001; 2002; Sterman 1989; Michie m.fl. 2011",
   "typ": "Forskning",
   "kod": "shift/app.js: spelAxelForslag(); shift/spel.js: simulate()"
  },
  {
   "id": "SHI-9",
   "modul": "Shift",
   "steg": "Spel (Förmågefällan)",
   "regel": "Modellen: förbättringstid tas från leveransen och stärker förmågan veckan efter. Förmågan förfaller lite varje vecka och mer med genvägar, som ger mer gjort just nu men dubbelt så många fel som kommer tillbaka. Svagt mandat: halva förbättringstiden tas tillbaka efter en vecka med eftersläpning tills ledningen skyddar tiden. Svag vilja: bara hälften av tiden används till förbättring tills nyttan görs synlig. Svag förmåga: förbättringstiden ger hälften tills kunskap tas in. Vid sidan av (skunk works) ger förmåga utan leveranstid men kostar energi och bleknar tills det lyfts fram. Talen är valda så att mönstren syns inom åtta veckor och är inte mått på någon verksamhet.",
   "param": "Se konstanterna i shift/spel.js (M)",
   "grund": "Repenning & Sterman 2002 (förmågefällan, sämre före bättre); Augsdorfer 2005; Criscuolo, Salter & Ter Wal 2014; Mainemelis 2010 (vid sidan av); Amabile & Kramer 2011 (framsteg ger energi)",
   "typ": "Forskning",
   "kod": "shift/spel.js: simulate()"
  },
  {
   "id": "SHI-10",
   "modul": "Shift",
   "steg": "Spel (Förmågefällan)",
   "regel": "Under spelet visas leveransen och energin i ord. Förmågan visas med två veckors fördröjning och bara som svagare, som vid start eller starkare (mer än 5 enheter från startläget). Efter vecka 8 visas kurvorna utan tal, mot två referensvägar genom samma veckor: leverans först (ingen förbättringstid, genvägar när det släpar) och skyddad tid (8 timmar och axelns första kort).",
   "param": "Fördröjning 2 veckor; gräns ±5",
   "grund": "Repenning & Sterman 2001 (förmågan syns sent); Sterman 1989",
   "typ": "Designval",
   "kod": "shift/app.js: renderSpelVecka(), spelSerier()"
  },
  {
   "id": "SHI-11",
   "modul": "Shift",
   "steg": "Spel (Förmågefällan)",
   "regel": "Mönster: fällan när förmågan har sjunkit minst 3 (i modellens enheter); uppför när den har stigit minst 8; annars mellanläge. Dessutom genvägar (minst 3 veckor), vid sidan av (minst 2 veckor, lyft fram eller inte), svacka med 8 timmar eller mer som hölls eller släpptes (minst 4 timmar de tre sista veckorna) och tiden tagen tillbaka. Hypotesen följer axeln och snittet av förbättringstiden avrundat till 4, 8 eller 12 timmar. Den läggs in i ramen och första trimförsöket bara när gruppen väljer det.",
   "param": "-3 / +8; 3 veckor; 2 veckor; 4 timmar",
   "grund": "Crookall 2010; Sitzmann 2011 (spel lär genom eftersamtal och som del av ett större lärande)",
   "typ": "Designval",
   "kod": "shift/spel.js: monster(); shift/app.js: spelHypotes()"
  },
  {
   "id": "SLU-1",
   "modul": "Slutsidan",
   "steg": "Villkor",
   "regel": "Slutsidan visas bara när Sense, See och Shift finns i kedjan i sparfilen från Shift.",
   "param": "",
   "grund": "",
   "typ": "Designval",
   "kod": "slut/app.js: delar()"
  },
  {
   "id": "SLU-2",
   "modul": "Slutsidan",
   "steg": "Framtidsberedskap",
   "regel": "Tryck (behov) från den starkaste kollisionen: högt om tryck minst 4 och tempo Redan nu eller 1 till 3 år; måttligt om tryck minst 4 senare, eller tryck 3 med tempo högst 3 till 10 år; annars lågt. Okänt tempo räknas som 3 till 10 år.",
   "param": "Tryck 4 / 3; tempo index 1 / 2",
   "grund": "Rohrbeck & Kum 2018 (operationaliseringen är ett designval)",
   "typ": "Designval",
   "kod": "slut/app.js: beredskap(), tempoIndex()"
  },
  {
   "id": "SLU-3",
   "modul": "Slutsidan",
   "steg": "Framtidsberedskap",
   "regel": "Förmåga från lärandeindex enligt stegprincipen, avrundat som det visas: under 2 låg, under 3 måttlig, annars hög.",
   "param": "2 / 3",
   "grund": "Pöppelbuß & Röglinger 2011; Rohrbeck & Kum 2018",
   "typ": "Forskning",
   "kod": "slut/app.js: beredskap()"
  },
  {
   "id": "SLU-4",
   "modul": "Slutsidan",
   "steg": "Framtidsberedskap",
   "regel": "Läge = förmåga minus tryck: över 0 ger Mer förberedd än trycket kräver, 0 Vaksam, minus 1 Sårbar, minus 2 I fara.",
   "param": "",
   "grund": "Rohrbeck & Kum 2018: vigilant, neurotic, vulnerable, in danger",
   "typ": "Forskning",
   "kod": "slut/app.js: beredskap()"
  },
  {
   "id": "SLU-5",
   "modul": "Slutsidan",
   "steg": "Lärandekurvan",
   "regel": "Fyra tecken, 0 till 2 poäng vardera, som tidigare. Tecknen räknas inte samman: inga avläsningar ger För tidigt att säga; alla fyra uppfyllda Uppför; minst två uppfyllda På väg; annars Ni har börjat. Summan används bara för positionen på kurvan.",
   "param": "Antal uppfyllda tecken",
   "grund": "Pisano m.fl. 2001; Zollo & Winter 2002; Argyris & Schön 1978; Marín-García & Martínez Tomás 2016",
   "typ": "Forskning",
   "kod": "slut/app.js: kurva()"
  },
  {
   "id": "SLU-6",
   "modul": "Slutsidan",
   "steg": "Förslag",
   "regel": "Är läget sårbart eller i fara och finns en fråga utan rörelse föreslås att rikta nästa period dit. Fäste under 2 ger förslaget att ge lärdomarna fäste. Därefter nästa försök, ledningens bidrag, högst tre robusta åtgärder och Nästa varv.",
   "param": "",
   "grund": "",
   "typ": "Designval",
   "kod": "slut/app.js: block()"
  },
  {
   "id": "TIL-1",
   "modul": "Tillämpningar",
   "steg": "Syntes",
   "regel": "Varje faktor bedöms i varje framtid som försvagas, opåverkad eller stärks. Sårbar = försvagas i minst två framtider; styrka = stärks i minst två.",
   "param": "Minst 2 av 4",
   "grund": "van der Heijden 2005; Lempert, Popper & Bankes 2003",
   "typ": "Forskning",
   "kod": "tillampningar/app.js: stat()"
  },
  {
   "id": "TIL-2",
   "modul": "Tillämpningar",
   "steg": "Syntes",
   "regel": "Fälla (framgångsfälla eller inkuransrisk) = faktor som är stark i dag och försvagas i minst två framtider.",
   "param": "Stark i dag; minst 2 av 4",
   "grund": "Christensen 1997; Leonard-Barton 1992; Sydow, Schreyögg & Koch 2009; Baum 1991",
   "typ": "Forskning",
   "kod": "tillampningar/app.js: fallor()"
  },
  {
   "id": "TIL-3",
   "modul": "Tillämpningar",
   "steg": "Syntes",
   "regel": "Samlad bedömning och säkerhet väljs av gruppen och räknas inte fram.",
   "param": "",
   "grund": "",
   "typ": "Designval",
   "kod": "tillampningar/app.js"
  }
 ],
 "anvandning": {
  "Repenning": "Förmågefällan, modellen och mönstren (SHI-8 till SHI-10)",
  "Sterman, J. D. (1989)": "Spel som simulator för ledare (SHI-8, SHI-10)",
  "Augsdorfer": "Vid sidan av i spelet (SHI-9)",
  "Criscuolo": "Vid sidan av i spelet (SHI-9)",
  "Mainemelis": "Vid sidan av i spelet (SHI-9)",
  "Sitzmann": "Spelet som del av ett större lärande (SHI-11)",
  "Crookall": "Eftersamtalet efter spelet (SHI-11)",
  "Fred": "Grundperspektivet; startsidan, Om metoden",
  "Cohen": "Absorptionsförmåga (begrepp)",
  "Zahra": "Potentiell och realiserad förmåga; slutrapporten",
  "Teece": "Kedjan sensing, seizing, transforming",
  "Rohrbeck": "Framtidsberedskap på slutsidan (SLU-2 till SLU-4)",
  "Michie": "COM-B: axlarna och försökstyperna (SEE-6, SEE-7, SHI-3)",
  "Blumberg": "Förmåga, möjlighet, vilja (SEE-6)",
  "Weiner": "Beredskap för en bestämd förändring; tilltro som change efficacy (SEE-9). Kontrollerad 2026-10-24.",
  "Emirbayer": "Agency (begrepp)",
  "Kanter": "Formellt mandat (SEE-8)",
  "Spreitzer": "Upplevt mandat (SEE-8)",
  "Marín-García": "Axlar och tecken räknas inte samman (SEE-7, SLU-5)",
  "Wack": "Förutbestämda element (SEN-3)",
  "Burt": "Förutbestämda element (SEN-3)",
  "Vester": "Påverkansmatris (SEN-4 till SEN-6)",
  "Godet": "Påverkansmatris (SEN-5)",
  "Dewar": "Bärande antagande, kollisioner (SEN-8, SEN-10)",
  "van der Heijden": "Vindtunnel (SEN-8, TIL-1)",
  "Lempert": "Robusta åtgärder; fler än en framtid (SEN-9, TIL-1)",
  "Wright": "Intuitive logics, axlar (SEN-3, SEN-6, SEN-7)",
  "Gollwitzer": "Om-då-planer (SHI-4)",
  "Reed": "Förutsägelse (SHI-4)",
  "Institute for Healthcare": "Små test, lärperiod (SHI-4)",
  "Zollo": "Lärdomens väg (SHI-5, SHI-7, SLU-5)",
  "Pisano": "Lärandekurvor (SLU-5)",
  "Argyris": "Dubbelkretslärande, lärperiodens slut (SLU-5)",
  "Gioia": "Sensegiving, Learning Direction Canvas (SHI-2)",
  "Lawson": "De tolv förmågorna",
  "ISO 56002": "De tolv förmågorna",
  "Jansen": "De tolv förmågorna",
  "Osterwalder": "Bärande delar (SEN-8)",
  "Hiltunen": "Signal (begrepp)",
  "Ramírez": "Fokusfråga (SEN-1)",
  "Voros": "Framsynsprocessen",
  "Weick": "Små vinster (SHI-5)",
  "Amabile": "Upplevda framsteg (SHI-5)",
  "Solberg": "Mått för lärande (SHI-4)",
  "Argote": "Lärandekurvor",
  "Edmondson": "Psykologisk trygghet, ledningens hinder",
  "Eriksson": "Projektbaserade organisationer (See)",
  "Jacobsson": "Digital ambidexteritet (See)",
  "Rafferty": "Skevheter i självskattning",
  "Pöppelbuß": "Förbättringsåtgärder per nivå, stöd för stegprincipen (SEE-2, SEE-11, SLU-3); kritik mot mognadsmodeller. Kontrollerad 2026-10-24 (DP 3.1).",
  "Holt": "Förändringsberedskap",
  "Appelbaum": "Förmåga, möjlighet, vilja (AMO)",
  "Norman": "Tumregeln om en halv standardavvikelse; ett helt skalsteg är försiktigare (SEE-3, SEE-5, SEE-7 till SEE-9). Kontrollerad 2026-10-24.",
  "Armenakis": "Förmågan förändringsledning (See)",
  "Becker": "Den femgradiga nivåskalan i See",
  "Brynjolfsson, E. & McElheran": "Förmågan datadriven innovation (See)",
  "Cooper": "Förmågan innovationsprocess: stegvis prövning (See)",
  "Dahlander": "Förmågan samverkan över gränser (See)",
  "Dawes": "Lärandeindex som ovägt medelvärde (SEE-1)",
  "Hansen": "Förmågan innovationsprocess (See)",
  "Henderson": "Förmågan system- och teknologiförståelse (See)",
  "Herscovitch": "Förmågorna förankring och förändringsledning (See)",
  "Katz": "Förmågan omvärldsbevakning: motstånd mot kunskap utifrån (See)",
  "Lepak": "Förmågan kompetensförsörjning (See)",
  "Levitt": "Kompetensfällan (See, ambidexteritet)",
  "March, J. G.": "Förmågan strategisk ambidexteritet (See)",
  "OECD": "Lärandeindex som ovägt medelvärde (SEE-1)",
  "O'Reilly": "Förmågan strategisk ambidexteritet (See)",
  "Teece, D. J. (2010)": "Förmågan affärsmodellsutforskning (See)",
  "Thomke": "Förmågan test- och lärförmåga (See)",
  "Vera": "Förmågan strategiskt ledarskap för förnyelse (See)"
 },
 "logg": [
  {
   "version": "prototyp v0.6",
   "datum": "2026-10-31",
   "text": [
    "Nytt frivilligt första steg i Shift: spelet Förmågefällan, åtta veckor om att hinna förbättra när leveransen trycker på. Spelet följer organisationens svagaste axel, har ett val för det som görs vid sidan av (skunk works) och ger en hypotes som kan föras in i Learning Direction Canvas och det första trimförsöket. Resultatet kommer med i rapporten, sparfilen och slutsidan.",
    "Varje skede i Sense, See, Shift, Utvalda tillämpningar och slutsidan har en kort introduktion under rubriken: vad vi gör, varför, hur, vem och vad det leder till. Den öppnas och stängs på plats.",
    "Fyra nya regler (SHI-8 till SHI-11) och åtta nya källor i litteraturlistan."
   ]
  },
  {
   "version": "prototyp v0.5",
   "datum": "2026-10-29",
   "text": [
    "Ny grafisk profil i linje med mickla.se: svart sidhuvud med Micklas logotyp, nya typsnitt och färger som bär betydelse (rödorange för svaghet, blått för styrka). Inga regler eller texter ändrades.",
    "Introduktionsfilmen är gjord om i den nya profilen."
   ]
  },
  {
   "version": "prototyp v0.4",
   "datum": "2026-10-24",
   "text": [
    "Självskattningen i See granskades mot forskningen: lärandeindex, nivåskalan och var och en av de tolv förmågorna fick egna källor, och MatchUp-verktyget är inte längre en egen typ av grund.",
    "42 av 400 texter i See ändrades: tydligare handling, försiktigare påståenden, mer olika beslut, bättre koppling till nästa nivå och rättat språk.",
    "18 nya källor i litteraturlistan."
   ]
  },
  {
   "version": "prototyp v0.3",
   "datum": "2026-10-24",
   "text": [
    "Sidan Spårbarhet: reglerna, alla texter som verktygen kan visa och litteraturen, med nedladdning som CSV.",
    "Om metoden beskriver hur verktygen är gjorda och granskade."
   ]
  },
  {
   "version": "prototyp v0.2",
   "datum": "2026-10-24",
   "text": [
    "Regler och källor granskades. Rekommendationerna i See gäller nu stegen mellan nivåerna i stället för gränsvärdena 1,8, 2,6 och 3,2.",
    "En skillnad räknas när den är minst ett helt skalsteg: svagaste axel, glapp, spridning och profilens form.",
    "Förmåga skattas med två påståenden i See, på samma skala som mandat och vilja, och Shift skattar om på samma sätt.",
    "Slutsidan beskriver läget Mer förberedd än trycket kräver enligt Rohrbeck och Kum, och lärandekurvans tecken räknas inte längre samman.",
    "Teoriplattformen fick avsnittet Gränser och skalsteg, och formuleringarna om forskningsgrunden förtydligades."
   ]
  },
  {
   "version": "prototyp v0.1",
   "datum": "2026-10-10",
   "text": [
    "Första versionen av Sense, See, Shift och slutsidan, för den första testrundan med användare."
   ]
  }
 ],
 "formagaKallor": {
  "1": "March 1991; O'Reilly & Tushman 2013; Eriksson 2013",
  "2": "Dahlander & Gann 2010; Edmondson 1999; Eriksson 2013",
  "3": "Vera & Crossan 2004; Teece 2007; Gioia & Chittipeddi 1991",
  "4": "Herscovitch & Meyer 2002; Spreitzer 1995",
  "5": "Brynjolfsson & McElheran 2016",
  "6": "Thomke 2003; Edmondson 1999; Reed & Card 2016",
  "7": "Hansen & Birkinshaw 2007; Cooper 1990",
  "8": "Teece 2010; Osterwalder & Pigneur 2010",
  "9": "Lepak & Snell 1999; Cohen & Levinthal 1990",
  "10": "Armenakis & Bedeian 1999; Weiner 2009; Herscovitch & Meyer 2002",
  "11": "Henderson & Clark 1990",
  "12": "Cohen & Levinthal 1990; Katz & Allen 1982; Rohrbeck & Kum 2018"
 }
};
