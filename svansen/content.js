/* Svansen: ett litet spel om att huvudet lär sig och kroppen ska hänga med.
   Alla texter ligger här, per språk. Nytt språk: kopiera blocket "sv", översätt och lägg till under "sprak".
   Språkväljaren visas automatiskt när det finns fler än ett språk. */
window.SVANSEN = {
  version: "Svansen v0.6",
  standardSprak: "sv",
  sprak: {
    sv: {
      sprakNamn: "Svenska",
      titel: "Svansen",
      sidtitel: "Svansen · Dialogverktyg — Learning Curve Approach",
      upphov: "© Engströms Mickla AB 2026",

      start: {
        rubrik: "Svansen",
        ingress: "Väx. Lär dig nya knep. Få hela kroppen att hänga med.",
        hur: [
          "Styr huvudet med fingret, musen eller piltangenterna.",
          "Ät de grå prickarna för att växa.",
          "Blå idéer lär huvudet något. De dyker upp då och då och försvinner om ingen tar dem. Sedan ska kunskapen ut i hela kroppen.",
          "Se upp för de röda pelarna."
        ],
        knapp: "Spela",
        tid: "60 sekunder"
      },

      borta: "Borta!",

      hud: { tid: "Tid", langd: "Längd", ideer: "Idéer", ljudPa: "Ljud på", ljudAv: "Ljud av" },

      /* Repliker när en del av svansen slits loss. Tre av dem är förmåga, mandat och vilja i förklädnad. */
      oj: ["Oj!", "Hoppsan!", "Vänta på mig!", "Hur gör man?", "Vem bestämde det?", "Varför då?", "Det har vi aldrig gjort!", "Ingen sa något!"],
      framme: ["Svansen hänger med!", "Hela kroppen kan!", "Nu sitter det!"],

      slut: {
        rubrik: "Det där var er lärandekurva",
        diagramHuvud: "Huvudet",
        diagramKropp: "Kroppen",
        diagramX: "tid",
        diagramY: "kunnande",
        monster: {
          ingaIdeer: "Huvudet åt inga idéer, så det fanns inget för kroppen att lära. Spela igen och jaga de blå.",
          iTakt: "Ni växte och lärde i samma takt. Kroppen hängde med huvudet nästan hela vägen. Det är ovanligt.",
          paVag: "Huvudet lärde sig snabbt. Kroppen kom efter, men den kom.",
          vaxteIfran: "Huvudet lärde sig snabbt. Kroppen hann inte med, särskilt de nya delarna som aldrig var med när idéerna kom. Och de delar ni tappade på vägen tog aldrig emot något alls."
        },
        lardeAttLara: "Och kroppen lärde sig att lära: den sista idén spred sig {x} gånger snabbare per led än den första.",
        statLangd: "Längd",
        statIdeer: "Idéer",
        ideerAv: "{x} av {n}",
        /* Profilen efter rundan (v0.6, Dans texter). Varje profil är strategins egen självbild; mönstertexten under visar priset. */
        profil: {
          axlar: ["Växa", "Lära", "Behålla"],
          figurEtikett: "Er profil: hur ni vägde att växa, lära och behålla",
          text: {
            tillvaxt: "Er strategi är Tillväxt: här är större och bättre samma sak - Störst kommer först!",
            innovation: "Er strategi är Innovation: här är risken hög men kan uppvägas av möjligheterna - Carpe diem!",
            smaSteg: "Er strategi är små steg: här är tålamod sin egen belöning - alla ska med! Men det syns sällan utifrån: tillväxt och innovationskraft brukar räknas som de viktiga tecknen på framgång.",
            balans: "Er strategi är balans: här måste man bolla flera perspektiv samtidigt - smartast vinner!",
            balansLiten: "Er strategi är balans: här måste man bolla flera perspektiv samtidigt - smartast vinner! Frågan är om man kan vinna om man inte är bäst på något."
          }
        },
        statTappade: "Tappade delar",
        poang: "Så fungerar organisationer också: det räcker inte att några lär sig. Det som avgör är om resten kan ta emot det.",
        cta: "Har er organisation en utmaning? The Learning Curve Approach är gjord för er. Pröva här!",
        ctaKnapp: "Till The Learning Curve Approach",
        ctaLank: "../",
        /* Besökare som kommer från en annan sida via ?fran=<id> får en knapp tillbaka dit i stället. */
        fran: {
          sbb: { knapp: "Tillbaka till Smart Built Boost", lank: "https://www.mickla.se/smart-built-boost/" }
        },
        igen: "Spela igen",
        hem: "Till startsidan",
        grundRubrik: "Vad bygger spelet på?",
        grund: [
          "Kroppens förmåga att ta emot det huvudet har lärt sig kallas absorptionsförmåga. Den beror på vad man redan kan: delar som har lärt sig förut tar emot nästa sak snabbare (Cohen & Levinthal 1990).",
          "Kunskap flyttas inte bara från en del till en annan. Den måste tas emot, och mottagaren behöver förmåga, mandat och vilja (Fred & Mukhtar-Landgren 2022).",
          "Snabb tillväxt späder ut kunnandet om de nya inte får lära sig (jämför Argote 2013 om att organisationer kan glömma och tappa lärande när personal byts).",
          "Känslan i styrningen bygger på Swink 2009 om game feel. Talen i spelet är designval, inte mätningar."
        ]
      }
    }
  }
};
