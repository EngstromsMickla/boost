# Learning Curve Approach: verktygen på boost.mickla.se

Arbetsbeskrivning för den som utvecklar verktygen vidare, människa eller Claude.

## Sammanhang

- Verktygen stödjer The Learning Curve Approach (Sense, See, Shift) i projektet Smart Built Boost (Smart Built Environment).
- Upphov: Dan Engström, Engströms Mickla AB. Dan äger allt innehåll; Claude föreslår, Dan beslutar.
- Tjänsten heter **Dialogverktyg — Learning Curve Approach** (Dans namnval, även i rubriker; det långa tankstrecket i namnet är ett uttryckligt undantag från regeln om tankstreck). Modulerna heter Sense, See och Shift.
- **See** (självskattning av mottagningsförmåga och agency, tidigare kallad Dialogverktyget) ligger i `see/`.
- Micklas logotyp (`img/mickla.png`, ormen) visas diskret i sidfoten på alla sidor och i PDF-rapportens sidfot.
- Landningssidan ligger i roten och länkar till modulerna. Byggordning: See (klar), landningssida (klar), Sense (publicerad), Shift (version 0.1), slutsida (version 0.1).
- Modulerna ska kunna köras i valfri ordning och var för sig, och ge en egen rapport. Körs alla tre i rätt ordning ger slutsidan en samlad analys med slutrekommendationer.

## Fasta principer

- Allt på svenska. Inga tankstreck (varken — eller – som skiljetecken) i texter som skrivs nya.
- Ingen data lämnar besökarens webbläsare: ingen server, ingen statistik, inga cookies, inga externa typsnitt eller CDN. Bibliotek läggs i `vendor/`.
- Statisk sida på GitHub Pages (arkivet EngstromsMickla/boost i organisationen EngstromsMickla, gren `main`, domänen boost.mickla.se via filen `CNAME`). Alla repon för mickla.se ligger i organisationen, aldrig på personliga konton.
- Allt innehåll ligger i en innehållsfil (`js/content.js`), inte i koden, så att Dan kan redigera texter själv.
- Upphovsrad: "© Engströms Mickla AB 2026". Raden om Smart Built Environment och Formas läggs till först när finansieringen är beslutad.
- Verktygen är dialogverktyg, inte mätinstrument. Inga psykometriska anspråk.
- Publicera aldrig till `main` utan att Dan har sagt "publicera". Förslag läggs i en egen gren.
- Versionsnummer (`version` i varje innehållsfil) räknas upp vid varje publicering och syns i sidfoten och i rapporterna. Sedan 2026-10-10 heter alla moduler och hela verktyget "prototyp v0.1" (första testrundan med användare). "prototyp v0.2" publicerades 2026-10-24 efter granskningen av regler och källor (stegprincipen, skalstegsprincipen, förmågepåståenden i See). "prototyp v0.3" lade till sidan Spårbarhet. "prototyp v0.4" (2026-10-24): See granskad mot forskningen, egna källor per förmåga, 42 texter ändrade. "prototyp v0.5" (2026-10-29): ny grafisk profil och ny introduktionsfilm. "prototyp v0.6" (publicerad 2026-10-31): spelet Förmågefällan i Shift och introduktion till varje skede.
- Kommunikation om forskningsgrunden (Dans beslut 2026-10-24): skriv att verktygen är forskningsbaserade, aldrig att allt eller varje del kommer från forskningen. Där forskningen inte matchar exakt är rekommendationerna omdömen som är utformade och avvägda utifrån forskningen.

## Grundperspektiv: absorptionsförmåga, inte implementering

LCA v2 bygger på Mats Freds forskning (Fred & Mukhtar-Landgren 2022): när externt finansierade projekt möter ordinarie verksamhet är problemet sällan resultaten, utan att mottagaren saknar förmåga, mandat och vilja att absorbera dem. Kunskap överförs inte från A till B; den översätts, tolkas, anpassas och integreras. Därför bedöms mottagaren, inte projektet.

- **Sense** beskriver *vad* som ska tas emot: framtidskollisioner och scenario.
- **See** bedömer *förmågan att ta emot det*: förmåga, mandat och vilja.
- **Shift** riktar små tester mot den svagaste axeln i See och bygger momentum.
- **Slutrapporten** svarar på vad som behöver hända i den mottagande organisationen.
- Rohrbeck & Kum (2018) ger stöd för kedjan: *perceiving* och *prospecting* (Sense), *probing* (Shift). Framtidsberedskap är ett relativt mått: behov (Sense) mot förmåga (See). Den räknas fram i slutrapporten och skattas inte separat.

## Beslut om modulerna (2026-10-10)

### Sense (Collision Compass, generaliserad)
- Skrivs om för en verksamhet i allmänhet, inte en fastighet. Strukturen med övningarna behålls.
- Nytt skede 0, *Välj fokus*: en krysslista med vanliga utmaningar, grundad i litteratur och branschagendor. Valen styr vilka områden som föreslås i skede 1.
- Skede 1 och 2 (signaler och trender; påverkan mot sannolikhet) behålls.
- Skede 3 (påverkansmatrisen, Vester/MICMAC) förenklas: verktyget föreslår fem trender utifrån skede 2 (högst påverkan och osäkerhet), gruppen kan byta. Därefter en fråga i taget ("Om A tar fart, hur mycket driver det B?", 0 till 3), 20 frågor. Verktyget räknar aktiv och passiv summa, ritar fyra fält (drivande, kritiska, påverkade, buffrande) och skriver en regelstyrd förklaring. Inget AI-stöd.
- Övningarna om värden (5 till 7) skrivs om till verksamhetens värden.
- Sista skedet är **Collision Map**: 1 till 3 prioriterade kollisioner, var och en med *tryck*, *tempo* (mot beslutshorisonten), *synlighet* (hur mycket den redan uppmärksammas) och *utmanat antagande* (Dewar, assumption-based planning). Elasticitet tas bort, eftersom inre förmåga bedöms i See.
- Hela processen ingår. Används i grupp med Dan som facilitator, gärna i Teams med delad skärm.
- Version 0.1 byggd i `sense/` (2026-10-10). Skede 2 sorterar trender i kritiska osäkerheter och förutbestämda element (Wack; Burt & Wright 2006). Skede 4: verktyget föreslår två axlar (mest drivande osäkra trender), gruppen väljer och motiverar vid byte; varningar för säker trend och för beroende axlar (svar 3 i matrisen). Fyra scenarier i ett 2×2-kors. Skede 5 bygger på affärsmodellens byggstenar med ett bärande antagande per del (Dewar). Skede 6 och 7 i förlagan är sammanslagna till vindtunneln (van der Heijden). Scenariot till See föreslås som det där kollisionerna är störst.
- Individuellt förarbete finns som alternativ (grupparbete är huvudspåret): deltagare gör skede 0 och 1 själva och sparar en fil; facilitatorn läser in filerna i skede 1, trender läggs till och dubbletter hoppas över. Deltagarnas fokusval slås inte ihop.
- Rapporten börjar, som i See, med en sammanfattning: fokusfråga, axlar, förutbestämda element, de fyra framtiderna och vad de betyder för verksamhetens värden, sårbarheter och styrkor, samt de viktigaste slutsatserna (kollisionerna och robusta åtgärder). Texterna ligger i `rapport.sammanfattning` i `sense/content.js`.
- Begrepp (Dans beslut): skede 5 heter *Det som bär verksamheten*; affärsmodellens byggstenar kallas **bärande delar**, var och en med ett **bärande antagande** (Dewar: load-bearing assumptions). Ordet "värden" används inte, eftersom det förväxlas med värderingar eller pengar. I vindtunneln bedöms *verksamhetens ställning* (försämras, står sig, förbättras).
- "Lärande och förnyelse" är struken ur skede 5 eftersom det är en förmåga som bedöms i See. Tio bärande delar.
- Version 0.2 (gren `sense-v0.2`): tre exempel per område (ett läggs in, fler hämtas som förslag), förklaring av siffrorna under diagrammen, och under Nästa visas vad som saknas för att gå vidare.
- Senare versioner: femtrendsvariant med max och min som tillval.

### See
- Ligger i `see/`. Tolv förmågor (elva blev tolv när agency lades till).
- Målgrupp (Dans beslut 2026-10-24): primärt samhällsbyggnad. Åtgärdstexterna får tala om projekt, beställare och bransch. Senare vidareutvecklas See för andra projektbaserade verksamheter.
- Den separata självskattningen av framtidsberedskap från v1.0 utgår.

### Shift (process, inte frågebatteri)
- Tre steg: *riktning* (Learning Direction Canvas), *första test* (testkort), *återkoppling* (lärkort). Körningen sparas och öppnas igen vid varje cykel.
- Testtyp föreslås från svagaste axeln i See (COM-B): svag förmåga ger tester som bygger kunskap, svagt mandat tester som ändrar förutsättningar och tillåtelse, svag vilja tester som gör nyttan synlig.
- Testkortet: koppling till lärandefrågan, om-då-hypotes med när och var (Gollwitzer & Sheeran 2006), förutsägelse före testet, få och enkla mått för förbättring, inte redovisning (Solberg m.fl. 1997; Reed & Card 2016).
- Lärkortet: vad hände, jämfört med förutsägelsen, beslut (fortsätt, justera, skala, avbryt) och obligatoriskt *nästa lilla test* (Weick 1984; Amabile & Kramer 2011).
- Tid: första testet startas inom en vecka (IHI). Lärperiod om fyra veckor med 2 till 3 cykler om 1 till 2 veckor, avslutas med gemensam återkoppling där Learning Direction Canvas uppdateras.
- Grund för korten: test card och learning card (Bland & Osterwalder 2019), Trim Tab Canvas.

### Shift, version 0.1 (byggd 2026-10-10)
- Namn (Dans beslut att byta från strategyzers test card och learning card): **trimförsök** (planen) och **kursavläsning** (uppföljningen), i linje med trimroder-bilden.
- Filen hålls av en kontaktperson, eller av facilitatorn om gruppen har gemensamma avstämningar.
- Ett försök per lärandefråga från start, högst tre lärandefrågor.
- Efter varje försök skattas den axel som försöket riktades mot igen. Med underlag från See sker det med ett påstående per axel på samma instämmandeskala som i See (`avlasning.rorelsePastaende`, `instamSkala`); utan See med gruppens egen skala från underlaget. Rapporten skiljer på att alla, några eller inga lärandefrågor har rört sig uppåt. Det ger rörelsen i mottagningsförmågan till slutrapporten.
- Perspektiv i kursavläsningen, grundade i litteraturen om lärandekurvor: effekt i vardagen (tid, kvalitet, energi, trivsel, intäkter, från Trim Tab Canvas), **lärdomens väg** (stannar hos oss, delad med kollegor, införd i rutin eller beslut; Zollo & Winter 2002: erfarenhet, artikulering, kodifiering), förutsägelse mot utfall, beslut och nästa lilla försök. Organisationer med samma erfarenhet lär i olika takt beroende på reflektion och delning (Pisano, Bohmer & Edmondson 2001; Edmondson m.fl. 2001). "Lärande" läggs därför inte till som ett sjätte effektvärde.
- Översikten visar försöken som kedjor per lärandefråga, **er lärandekurva** (kumulativt antal lärdomar, delade och införda) och rörelsen per axel.
- Steg: underlag (sparfil från See, eller två korta frågor om See och Sense saknas), Learning Direction Canvas (tryck och beredskap förifyllda, förslag på lärandefrågor ur kollision × förmåga × svagaste axel), kommunikationsram och stöd (inklusive vilket hinder ledningen tar bort; Edmondson 1999), första trimförsöket per fråga, översikt, kursavläsning, lärperiodens slut (pröva frågorna: behåll, justera, byt; Argyris & Schön 1978).

### Förmågefällan, spel i Shift (version 0.6, Dans beslut 2026-10-31)
- Frivilligt steg 0 i Shift (`spel`, efter underlaget och före Learning Direction Canvas), en blandning av spel och simulering. Knappen Nästa heter Hoppa över spelet tills spelet har startats. Kan spelas senare från översikten. När Shift öppnas igen för nästa cykel hoppar man över det.
- Grund: Repenning & Sterman 2001; 2002 (jobba hårdare eller smartare, förmågan syns sent, sämre före bättre), Sterman 1989 (simulator för ledare), vid sidan av efter Augsdorfer 2005, Mainemelis 2010 och Criscuolo, Salter & Ter Wal 2014, eftersamtal efter Crookall 2010 och Sitzmann 2011.
- Åtta veckor (Dans beslut, i stället för tolv). Samma händelser för alla utom vecka 6, som beror på axeln. Spelas med företagets svagaste axel (Dans beslut), föreslagen ur See eller underlaget; gruppen kan byta. Axeln styr villkoren och vilka handlingskort som finns.
- Beslut per vecka: förbättringstid (0, 4, 8, 12 timmar), genvägar, **vid sidan av** och högst ett kort. Ingen övertid (Dans beslut: många företag har inte övertid men desto fler skunk works). Vid sidan av förklaras "på engelska ofta kallat skunk works" (Dans beslut).
- Modellen ligger i `shift/spel.js` (rena funktioner, konstanterna i `M`), texter, händelser och kort i `C.spel` i `shift/content.js`. Talen visas aldrig; leveransen och energin i ord, förmågan med två veckors fördröjning och i förhållande till startläget. Efter vecka 8 kurvor utan tal mot två referensvägar (leverans först, skyddad tid), mönster, hypotes och eftersamtal.
- Hypotesen förs in i ramen (vilket hinder ledningen tar bort) och det första trimförsöket bara när gruppen trycker på knappen. Resultatet kommer med i rapporten, PDF:en, sparfilen (`data.spel`, `lamnar.spel`) och slutsidans analys.
- Regler SHI-8 till SHI-11 i Spårbarhet. Ändras modellen ska reglerna ändras i samma omgång.

## Om skedet (version 0.6, Dans beslut 2026-10-31)
- Varje skede i Sense, See, Shift, Utvalda tillämpningar och slutsidan har en kort introduktion direkt under rubriken: vad gör vi, varför är det viktigt, hur gör vi det, vem gör det och vad leder det till. Den är stängd från början, öppnas på plats och stängs med Stäng och fortsätt, så att användaren är kvar där hen var.
- Texterna ligger i `skedeIntro` i respektive innehållsfil (i See under `boost.skedeIntro`; i tillämpningarna med `{ord}` och `{objekt}` som fylls från fallet). Rubrikerna och mekaniken ligger i `LCA.INTRO`, `LCA.skedeIntro` och `LCA.withIntro` i `js/lca.js`.

## Slutsidan, version 0.1 (byggd 2026-10-10)
- `slut/` visas bara när Sense, See och Shift är gjorda i följd (Shift-filen bär kedjan). Annars förklarar sidan vad som saknas; modulrapporterna räcker när en eller två faser är gjorda.
- Nås från Shift-rapporten (knapp när kedjan är hel), från startsidan och genom att öppna en Shift-sparfil. Senaste slutsida sparas i `lca.slut.v1`.
- **Framtidsberedskap** (Rohrbeck & Kum 2018, relativt mått): tryck från Sense (starkaste kollisionen; högt = tryck minst 4 och tempo högst 1 till 3 år; måttligt = tryck minst 4, eller minst 3 med tempo högst 3 till 10 år) mot förmåga från See (stegprincipen: lärandeindex under 2 låg, under 3 måttlig, annars hög). Lägen: mer förberedd än trycket kräver, vaksam, sårbar, i fara. Mer förberedd motsvarar neurotic hos Rohrbeck & Kum och beskrivs inte som en styrka.
- **Lärandekurvan** värderas med fyra tecken från Shift (0, 1 eller 2 vardera): uppföljda försök, rörelse i axlarna, lärdomarnas fäste (delade, införda), prövad riktning. Tecknen räknas inte samman (Dans beslut 2026-10-24). Omdömen: för tidigt att säga (inga kursavläsningar), ni har börjat, ni är på väg uppför (minst två tecken uppfyllda), ni har tagit er uppför (alla fyra uppfyllda). Summan används bara för positionen på kurvan. Positionen visas på en S-kurva från oro via insikt och rörelse till fäste.
- Följer den fasta rapportmallen; slutrapporten laddas ner som PDF.

## Utvalda tillämpningar (byggd 2026-10-11)
- `tillampningar/` innehåller fördjupningar som använder de fyra framtiderna från Sense för en särskild fråga. De ligger vid sidan av huvudspåret (Dans namnval: "Utvalda tillämpningar").
- En gemensam motor (`tillampningar/app.js`) för alla fall. Varje fall är ett objekt i listan `fall` i `tillampningar/content.js`: faktorer, bedömningsord, rubriker och rapporttexter. Ett nytt fall kräver ingen ny kod, bara ett nytt objekt och en rad i `tillampningar` i `js/content.js` (startsidan).
- Adress per fall: `tillampningar/?fall=<id>`. Lagring: `lca.tillampning.<id>.v1`. Sparfilens `modul` är `tillampning` och `data.fall` anger fallet.
- Steg: uppgifter (inklusive vilket objekt det gäller), framtiderna (från Sense-filen, eller fyra inskrivna om Sense saknas), faktorer, bedömning per framtid (försvagas, opåverkad, stärks; trolig utveckling, orsaker, åtgärder), syntes (sårbarheter och styrkor räknas fram, mönster, robusta åtgärder, samlad bedömning, hur säkra man är, det som är osäkert), rapport enligt den fasta mallen.
- Resultatet följer med (Dans beslut): `kedja.tillampningar.<id>` (se `LCA.chainFrom`). See läser en tillämpningsfil som en Sense-fil, Shift visar robusta åtgärder i underlaget, slutsidan tar med samlad bedömning, sårbarheter och robusta åtgärder i analys, förslag och detaljer.
- **Fastighetens värdeutveckling** (`fastighet`), från övningarna 5 till 8 i arbetsbladen (Worksheets Chalmers 2025). Tolv värdefaktorer: "Innovations- och lärandeförmåga" är struken (Dans beslut; bedöms i See), "Klimatrisker på platsen" är tillagd som egen faktor (Bernstein m.fl. 2019). Litteraturstöd i Teoriplattformen (Rosen 1974; Sirmans m.fl. 2005; Debrezion m.fl. 2007; Baum 1991; Geltner & de Neufville 2018; Langston m.fl. 2008; Eichholtz m.fl. 2010; Fuerst & McAllister 2011; Carmona 2019; Ahlfeldt & Maennig 2010). 
- Sense-rapporten länkar till Utvalda tillämpningar under Nästa steg.
- Varje tillämpning får en egen utmaning i skede 0 i Sense (Dans beslut), med `fragaMall` (egen fokusfråga), `standard` och `forstaExempel` (vilket exempel per område som läggs in först). Fastigheten: utmaningen "Fastigheters värde och användning" och fyra nya exempel (kontorsefterfrågan, byggnadsdirektivets energikrav, ränte- och riskkänslighet, uppkoppling). Hjälptext under fokusfrågan och på tillämpningens startsida säger att Sense bör göras med objektet i fokus.
- **Nuläge och fällor** (valfritt per fall, `nulage` i fallets innehåll): gruppen anger hur stark varje del är i dag (svag, medel, stark). Delar som är starka i dag men försvagas i minst två framtider pekas ut i syntes, analys, förslag, tabell och sparfil (`fallor`, `fallorNamn`). Kunskapsföretaget kallar dem framgångsfällor (Christensen 1997; Leonard-Barton 1992; Sydow m.fl. 2009), fastigheten inkuransrisker (Baum 1991). Påslaget i båda fallen (Dans beslut, fastigheten på Claudes råd).
- **Kunskapsföretag bortom timmen** (`kunskapsforetag`, Dans namnval, byggd 2026-10-11): timdebiterande, lönetunga kunskapsföretag (konsulter, arkitekter, ingenjörer, jurister, revisorer, byråer). Tretton bärande delar med ett bärande antagande var, bland dem styrning och incitament (Leonard-Barton 1992: styrsystem som kärnstelhet). Innovationskraft är inte en egen del (Dans beslut); den bedöms i See, och inlåsningen fångas av framgångsfällorna. Litteratur: Maister 1993; von Nordenflycht 2010; Dell'Acqua m.fl. 2023; Susskind & Susskind 2015; Christensen m.fl. 2013; Nissen 2018; Flynn & Kowalkiewicz 2018; Tafti 2024; Tafti m.fl. 2022 och 2024; Hinterhuber 2008; Vargo & Lusch 2004; Brynjolfsson m.fl. 2025 (två); Beane 2019; Muench m.fl. 2022. Sense-utmaningen "Kunskapsföretagets affärsmodell" med fem nya exempel.
- Digital infrastruktur: uppkopplingen har stöd (Ahlfeldt, Koutroumpis & Valletti 2017); digitala tjänster (lås, bokning, sensorer) är nyare, underlaget mest branschrapporter, och faktorn är starkt scenarioberoende.

## Fast rapportmall (alla moduler och slutrapporten)
- Varje rapport börjar med **Sammanfattning**, **Analys** och **Förslag**, därefter rubriken **Detaljer**. Mallen finns i `LCA.reportBlock` och `LCA.reportPDF` i `js/lca.js`.

## Gränser i verktygen
- Avsnittet Gränser och skalsteg i Teoriplattformen (`js/info.js`) beskriver principerna: steg mellan nivåer, ett helt skalsteg, skalans etiketter, fler än en framtid (Lempert m.fl. 2003) och att tecken inte räknas samman. Rena designval utan källa (urvalet av fem trender, framtid till See, styrkans villkor) är uppräknade där. Nya gränser ska följa en av principerna eller läggas till som designval.
- Granskningen hösten 2026: guide och arbetsbok (LCA granskningsguide.docx, LCA granskning arbetsbok.xlsx) i Dans mapp för LCA v2.0.

## Spårbarhet (byggd 2026-10-24)
- `sparbarhet/` visar reglerna, alla texter som verktygen kan visa (med när de visas och källa) och litteraturen med vad den bär, med nedladdning som CSV, samt en ändringslogg. Länkas från Om metoden och Teoriplattformen.
- Texterna och litteraturen byggs i webbläsaren direkt ur innehållsfilerna (`js/sparbarhet.js`; sidan läser in varje content.js och sparar undan `window.CONTENT`). Mönstren som anger Visas när och källa per text ligger i `MAP` i `js/sparbarhet.js`.
- Reglerna, vad källorna bär och ändringsloggen ligger för hand i `js/sparbarhet-data.js`. **När en regel i koden ändras ska motsvarande regel där ändras i samma omgång, och varje publicering får en rad i ändringsloggen.**
- Om metoden har avsnittet Hur verktygen är gjorda med Dans formuleringar (ordagrant): "Verktygen är utvecklade av Dan Engström, och digitaliserade med stöd av Claude Opus 5.5." och "Granskat av upphovsmannen. Ytterligare detaljgranskning pågår." Den andra raden ändras när Dans detaljgranskning är klar.

## Begrepp, Om metoden och Teoriplattform
- `teori/` (Teoriplattform) innehåller resonemanget om metodens vetenskapliga grund och hela litteraturlistan, i `js/info.js` under `teori`. Den nås från Om metoden, Begrepp och startsidan.
- Rapporterna listar inga källor; de hänvisar till Teoriplattformen (`LCA.teoriHTML`, `LCA.TEORI`). Nya källor läggs i `js/info.js`.
- `begrepp/` är en sökbar begreppslista; `om/` beskriver bakgrund, upplägg, mål, upphovsman och kontakt (dan@mickla.se, 0709 60 70 76). Innehållet ligger i `js/info.js`.
- Länkarna Begrepp och Om metoden finns i sidhuvudet på alla sidor och öppnas i en ny flik så att körningen inte avbryts.
- Första gången ett begrepp eller en canvas dyker upp i en modul visas en kort beskrivning med länk till begreppslistan.

## Introduktionsfilm
- `video/intro.mp4` (95 sekunder, 1280×720, H.264, text men inget ljud, gjord om i den grafiska profilen 2026-10-29) och `video/intro-poster.jpg` (filmens startbild med titeln) visas på startsidan, mellan de två inledande styckena, med en nedladdningslänk. Texterna i `js/content.js` under `film`.
- Filmen är byggd av skärmbilder från verktygen med Engströms Mickla AB som exempelföretag (påhittade svar) och textskyltar på mörk scen, bland annat om att förändring inte börjar i ledningsrummet och om varje medarbetare som ett trimroder. Den ska göras om när verktygen ändras märkbart. Byggs med Playwright: exempeldata körs genom Sense, See, Shift och slutsidan, skärmbilderna panoreras i en ram, skyltarna är HTML i profilens typsnitt, 25 bilder per sekund med korta övertoningar.

## Navigering och sparande
- Länken Hem finns i sidhuvudet på alla sidor utom startsidan. Körningen sparas löpande i webbläsaren, och varje modul minns senaste steg (`state.steg`), så Fortsätt tar användaren tillbaka exakt dit hen var.
- Knappen Spara sparfil finns på varje steg i alla moduler, eftersom webbläsarens lagring kan tömmas (privat läge, rensning, annan dator).
- Shift kan ladda ner en kalenderfil (.ics) med datum för start, kursavläsning och lärperiodens slut.

## Struktur för flera moduler

- Landningssidan ligger i roten: `index.html`, `js/app.js`, `js/content.js`.
- Modulerna ligger i egna mappar: `sense/`, `see/`, `shift/`, med egen `index.html`, `app.js` och `content.js`. Slutsidan läggs i `slut/`, Utvalda tillämpningar i `tillampningar/`.
- Gemensamt: `css/style.css`, `vendor/` och `js/lca.js` (sparformatet).
- Alla moduler ligger på samma domän och delar webbläsarens lokala lagring. Nycklar: Sense `lca.sense.v1`, See `dialogverktyget.v1`, Shift `lca.shift.v1`, överlämning mellan sidor `lca.overlamning`.

## Gemensamt sparformat (`js/lca.js`)

```
{
  "lca": 1,
  "modul": "sense" | "see" | "shift",
  "version": "…", "skapad": "…", "andrad": "…",
  "organisation": { "namn": "", "typ": "grupp|individ", "deltagare": "" },
  "data":   { … },   // modulens egen körning
  "lamnar": { … },   // det modulen lämnar vidare, fast format
  "kedja":  { "sense": {…}, "tillampningar": { "<id>": {…} }, "see": {…} }   // tidigare modulers lamnar
}
```

- **Sense lämnar:** `scenario {namn, text}`, `kollisioner [{namn, tryck, tempo, synlighet, antagande}]`, `fokus []`, `robustaAtgarder []`.
- **See lämnar:** `scenario`, `index`, `form`, `omdome`, `valda [{id, namn, niva, axlar {formaga, mandat, vilja, tilltro}, svagastAxel [], beslut, atgard}]`, `styrka`, `egnaAtgarder`.
- **Shift lämnar:** `riktning [lärandefrågor]`, `tester [{testkort, larkort}]`, `spel {spelat, axel, monster, text, hypotes}`.
- **En tillämpning lämnar:** `id`, `namn`, `objekt`, `samlad`, `samladIndex`, `sakerhet`, `sarbara []`, `styrkor []`, `robustaAtgarder []`, `scenarier [{namn, utveckling}]`, `monster`, `osakert`.
- Varje modul läser vilken tidigare fil som helst. Saknas underlag frågar modulen kort efter det, och rapporten anger vad som saknats.
- Gamla sparfiler från See (`app: "dialogverktyget"`, utan kuvert) läses fortfarande.
- Slutsidan behöver bara den sista filen i kedjan, eftersom `kedja` bär med sig allt tidigare.

## Formgivning

- Grafisk profil (beslutad och publicerad 2026-10-29): knyter an till mickla.se. Svart sidhuvud med ormen, vit arbetsyta på ljusgrå botten (`#f3f3f1`), raka hörn (`--r` 3px), inga mjuka skuggor.
- Färg bär betydelse, inget annat: svart (`#141414`) är ni och era val, rödorange `--weak` (`#d1431d`) är svaghet och risk, blått `--strong` (`#1e5fcc`) är styrka och möjlighet. Samma färger i diagram (hårdkodade i varje `app.js`) och PDF.
- Typsnitt, självhostade i `vendor/fonts` (SIL Open Font License): Poppins 600/700 i rubriker och knappar (som mickla.se), IBM Plex Sans i brödtext, IBM Plex Mono i etiketter, siffror och skalvärden. PDF-rapporten använder fortfarande Helvetica.
- Landningssidans scen: mörkt band med lärandekurvan som ett penseldrag (`curveSVG` i `js/app.js`), tre punkter Sense, See, Shift.
- Ett steg per skärm, tydlig Nästa och Tillbaka, fungerar på telefon.
- PDF-rapport skapas med jsPDF och svg2pdf i `vendor/`.

## See i korthet

- Tolv förmågor i fyra fält: Upptäcka, Välja, Pröva, Förändra (`boost.kvadranter`). Skala 0 till 4 med halvsteg.
- **Stegprincipen** (Dans beslut 2026-10-24): skalan har fem nivåer och texterna (omdöme, Internt, Ta hjälp med att, åtgärd per beslut) gäller de fyra stegen mellan dem. Ett värde hör till steget från den nivå man har nått: 0 till 0,5 steg 1, 1 till 1,5 steg 2, 2 till 2,5 steg 3, 3 till 4 steg 4 (`gransvarden` 1 / 2 / 3). Värdet avrundas till en decimal före jämförelsen, som det visas. Stöd: Pöppelbuß & Röglinger 2011.
- **Skalstegsprincipen** (Dans beslut 2026-10-24): en skillnad räknas när den är minst ett helt skalsteg (`skalsteg` 1): svagaste axel, mandatglapp, tilltroglapp, spridning mellan deltagare i facilitatorläget och profilens form (1 och 2 steg). Stöd: Norman, Sloan & Wyrwich 2003.
- Beslutsvarningarna följer skalans etiketter: vilja under Stämmer delvis (högst 2,5) är låg, från Stämmer ganska bra (minst 4) hög.
- De 3 lägst skattade förmågorna föreslås (fler vid lika värden); gruppen kan byta med motivering. En tydlig styrka lyfts fram om den ligger minst 1,0 över medianen och är minst lika stor som dippen.
- För valda förmågor: förmåga (K1, K2), mandat (formellt F1, F2 och upplevt U1, U2), vilja (V1, V2) och tilltro (T1), alla som påståenden på samma skala 1 till 5. Förmågeaxeln var tidigare nivån + 1; äldre körningar utan K1 och K2 räknas fortfarande så tills påståendena är besvarade. Den svagaste axeln styr riktningen för Shift. Tilltro motsvarar change efficacy (Weiner 2009).
- Beslut per förmåga: Ja, Fortsätt, Utred, Vänta, Nej. Vänta och Nej får automatiska tillägg.
- Granskning 2026-10-24 (Dans beslut): lärandeindex (Dawes 1979; OECD & JRC 2008), nivåskalan (Becker m.fl. 2009; Pöppelbuß & Röglinger 2011) och varje förmåga har egna källor, se `formagaKallor` i `js/sparbarhet-data.js` och See-stycket i Teoriplattformen. MatchUp är historik, inte längre en typ av grund. Alla 400 texter prövades; 42 ändrades (underlag: LCA See texter granskning.xlsx i Dans mapp för LCA v2.0). Nya texter ska följa stegprincipen (texten leder från nivån till nästa), skilja sig mellan besluten och vara handlingsbara.
- Forskningsunderlag: se historiken i chatterna i projektet "Learning Curve Approach"; viktigast är Fred & Mukhtar-Landgren 2022, Weiner 2009, Michie m.fl. 2011 (COM-B), Blumberg & Pringle 1982, Zahra & George 2002, Teece 2007, Eriksson 2013 och Jacobsson & Linderoth 2026.

## Test

Kör hela flödet i en webbläsare (Playwright med Chromium finns i molnmiljön) innan något föreslås för publicering, både i datorstorlek och telefonstorlek, och kontrollera PDF-rapporten.
