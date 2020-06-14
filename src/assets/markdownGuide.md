# En guide til Markdown
Rollespilsfabrikkens kalender og forum benytter *Markdown* som et værktøj til at formatere opslag og kommentarer. Det vil sige, at når du skal lave et opslag eller en kommentar, så skal du skrive Markdown.

Markdown er blot et opmærkningssprog, der formateres ved hjælp af ren tekst. Hvordan man bruger det, er hvad denne side vil belyse. På siden vil du se eksempler på Markdown-inputtet efterfulgt af hvordan det formateres.

Hvis du bruger Reddit, kender du sandsynligvis allerede til denne måde at formatere tekst.

---

## Tekststil

```
Tekst gøres kursiv ved at bruge enten *stjerner* eller _underscores_ rundt om den ønskede tekst.

For at formatere med fed tekst, skal du bruge **to stjerner** eller __to underscores__.

Du kan også vælge at kombinere **stjerner og _underscores_**, hvis du vil have både kursiv og fed tekst.

En streg igennem teksten kan opnås med to ~~tilder~~.
```

Tekst gøres kursiv ved at bruge enten *stjerner* eller _underscores_ rundt om den ønskede tekst.

For at formatere med fed tekst, skal du bruge **to stjerner** eller __to underscores__.

Du kan også vælge at kombinere **stjerner og _underscores_**, hvis du vil have både kursiv og fed tekst.

En streg igennem teksten kan opnås med to ~~tilder~~.

---

## Lister
```
Du kan oprette nummerede lister ved at starte en ny linje med et tal efterfulgt med et punktum eller unummerede lister ved at bruge `-`, `+` eller `*`. Desuden kan du starte en liste inde i en anden liste, så længe du putter tre mellemrum før.

1. Første nummerede listeelement.
2. Endnu et listeelement
   * Unummeret underliste.
1. Tallene er faktisk ligegyldige. Det skal bare være et tal.
   1. Nummeret underliste.
4. Og et sidste listeelement.

   Det er også muligt at have flere afsnit under ét listeelement, såfremt hver linje starter med det rigtige antal mellemrum. Her er det 3 mellemrum.

Som sagt kan du bruge tre forskellige tegn til at starte en unummeret liste:

* Unummerede lister kan bruge stjerner
- eller bindestreger
+ eller plusser
```

Du kan oprette nummerede lister ved at starte en ny linje med et tal efterfulgt med et punktum eller unummerede lister ved at bruge `-`, `+` eller `*`. Desuden kan du starte en liste inde i en anden liste, så længe du putter tre mellemrum før.

1. Første nummerede listeelement.
2. Endnu et listeelement
   * Unummeret underliste.
1. Tallene er faktisk ligegyldige. Det skal bare være et tal.
   1. Nummeret underliste.
4. Og et sidste listeelement.

   Det er også muligt at have flere afsnit under ét listeelement, såfremt hver linje starter med det rigtige antal mellemrum. Her er det 3 mellemrum.

Som sagt kan du bruge tre forskellige tegn til at starte en unummeret liste:

* Unummerede lister kan bruge stjerner
- eller bindestreger
+ eller plusser

---

## Links
```
Der findes forskellige måder at lave links på i Markdown. Alle disse links fører til samme sted, men oprettes anderledes:

[Jeg er et inline-link](https://www.google.com).

[Jeg er et inline-link, du kan holde musen over](https://www.google.com "Googles forside").

[Jeg er et henvisningslink][Tilfældig tekst].

[Du kan også bare bruge tal til henvisningslinks][1].

Ellers kan du bare indsætte [henvisningsteksten direkte].

URLer og URLer i vinklede parenteser bliver automatisk til links: https://www.google.com eller <https://www.google.com>.

Henvisningsteksten fra tidligere kan indsættes hvor som helst. For eksempel i bunden:

[Tilfældig tekst]: https://www.google.com
[1]: https://www.google.com
[henvisningsteksten direkte]: https://www.google.com
```

Der findes forskellige måder at lave links på i Markdown. Alle disse links fører til samme sted, men oprettes anderledes:

[Jeg er et inline-link](https://www.google.com).

[Jeg er et inline-link, du kan holde musen over](https://www.google.com "Googles forside").

[Jeg er et henvisningslink][Tilfældig tekst].

[Du kan også bare bruge tal til henvisningslinks][1].

Ellers kan du bare indsætte [henvisningsteksten direkte].

URLer og URLer i vinklede parenteser bliver automatisk til links: https://www.google.com eller <https://www.google.com>.

Henvisningsteksten fra tidligere kan indsættes hvor som helst. For eksempel i bunden:

[Tilfældig tekst]: https://www.google.com
[1]: https://www.google.com
[henvisningsteksten direkte]: https://www.google.com

---

## Billeder
```
Du kan indsætte billeder på næsten samme måde som med links. Når du starter linket med en firkantet parantes `[`, skal der komme et udråbstegn først.

Med inline-stil: 
![Tekst, hvis billedet ikke kan indlæses](http://rollespilsfabrikken.dk/wp-content/uploads/eventpict_imperiet.png "Tekst, når musen svæver over")

Med henvisningsstil: 
![Tekst, hvis billedet ikke kan indlæses][billede]

[billede]: http://rollespilsfabrikken.dk/wp-content/uploads/eventpict_imperiet.png "Tekst, når musen svæver over"
```

Du kan indsætte billeder på næsten samme måde som med links. Når du starter linket med en firkantet parantes `[`, skal der komme et udråbstegn først.

Med inline-stil: 
![Tekst, hvis billedet ikke kan indlæses](http://rollespilsfabrikken.dk/wp-content/uploads/eventpict_imperiet.png "Tekst, når musen svæver over")

Med henvisningsstil: 
![Tekst, hvis billedet ikke kan indlæses][billede]

[billede]: http://rollespilsfabrikken.dk/wp-content/uploads/eventpict_imperiet.png "Tekst, når musen svæver over"

---

## Monospace
```
Det er muligt at skrive `monospace`-tekst, hvis du omslutter teksten med backticks.

Det er også muligt at omslutte en hel tekstblok med tre backticks for at lave den hele om til monospace:
```en monospace-blok,
som fylder
mere end en linje```
```

Det er muligt at skrive `monospace`-tekst, hvis du omslutter teksten med backticks.

Det er også muligt at omslutte en hel tekstblok med tre backticks for at lave den hele om til monospace:
```
en monospace-blok,
som fylder
mere end en linje
```

---

## Tabeller
```
Tabeller kan laves med denne syntaks:

| Tabeller      | Er            | Praktiske |
| ------------- |:-------------:| ---------:|
| Kolonne 3 er  | højre-flugtet |   Tekst 1 |
| Kolonne 2 er  | centreret     |   Tekst 2 |

Kolonner bruges til at bestemme, hvor teksten positioneres. Kolon i begge ender centrerer, og kolon til højre positionerer teksten til højre. Se forrige eksempel.

Tabeller behøver ikke at være pænt opskrevet:

Dette | fungerer | stadig
--- | --- | ---
*selv om* | `det` | **er grimt**
1 | 2 | 3

Og de kan naturligvis også indeholde Markdown.

Tabeller kan dog være irriterende at skrive i hånden, og det kan derfor være praktisk at bruge en service som [Markdown Tables Generator](https://www.tablesgenerator.com/markdown_tables) til at gøre det.
```

Tabeller kan laves med denne syntaks:

| Tabeller      | Er            | Praktiske |
| ------------- |:-------------:| ---------:|
| Kolonne 3 er  | højre-flugtet |   Tekst 1 |
| Kolonne 2 er  | centreret     |   Tekst 2 |

Kolonner bruges til at bestemme, hvor teksten positioneres. Kolon i begge ender centrerer, og kolon til højre positionerer teksten til højre. Se forrige eksempel.

Tabeller behøver ikke at være pænt opskrevet:

Dette | fungerer | stadig
--- | --- | ---
*selv om* | `det` | **er grimt**
1 | 2 | 3

Og de kan naturligvis også indeholde Markdown.

Tabeller kan dog være irriterende at skrive i hånden, og det kan derfor være praktisk at bruge en service som [Markdown Tables Generator](https://www.tablesgenerator.com/markdown_tables) til at gøre det.

---

## Blokcitater
```
> Blokcitater kan være praktiske til flere formål. De starter med `>` og kan
> have flere linjer.
>
> De kan også have flere afsnit.

Citat stop.

> Naturligvis kan citater indeholde Markdown.
```

> Blokcitater kan være praktiske til flere formål. De starter med `>` og kan
> have flere linjer.
>
> De kan også have flere afsnit.

Citat stop.

> Naturligvis kan citater indeholde `Markdown`.

## Vandrette streger

```
Vandrette streger indsættes ved 3 eller flere af `_`, `*` eller `-`. Se:

---

3 bindestreger

***

3 stjerner

___

3 underscores
```

Vandrette streger indsættes ved 3 eller flere af `_`, `*` eller `-`. Se:

---

3 bindestreger

***

3 stjerner

___

3 underscores

---

## Afsnit og nye linjer

```
En linje kan fortsætte i en lang køre.

Et afsnit kan
brydes op i flere
linjer uden mellemrum
mellem, hvis der bare
er ét linjeskift.

Hvis der skal være et nyt afsnit,

skal der være to linjeskift.
```

En linje kan fortsætte i en lang køre.

Et afsnit kan
brydes op i flere
linjer uden mellemrum
mellem, hvis der bare
er ét linjeskift.

Hvis der skal være et nyt afsnit,

skal der være to linjeskift.

---
## Overskrifter
```
Markdown understøtter overskrifter i seks varierende størrelser. Størrelsen defineres af antallet af `#`-symboler, der kommer før overskriften.

# Overskrift 1
## Overskrift 2
### Overskrift 3
#### Overskrift 4
##### Overskrift 5
###### Overskrift 6

Alternativt kan man for overskrift 1 og overskrift 2 benytte `=` og `-`:

Alternativ overskrift 1
=======================

Alternativ overskrift 2
-----------------------
```
Markdown understøtter overskrifter i seks varierende størrelser. Størrelsen defineres af antallet af `#`-symboler, der kommer før overskriften.

# Overskrift 1
## Overskrift 2
### Overskrift 3
#### Overskrift 4
##### Overskrift 5
###### Overskrift 6

Alternativt kan man for overskrift 1 og overskrift 2 benytte `=` og `-`:

Alternativ overskrift 1
=======================

Alternativ overskrift 2
-----------------------

---
