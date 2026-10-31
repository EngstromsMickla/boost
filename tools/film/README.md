# Introduktionsfilmen

Produktionen av `video/intro.mp4`. Se avsnittet Introduktionsfilm i `CLAUDE.md` för hur den körs.

- `sense.py`, `see.py`, `shift.py`: kör modulerna med exempeldata och tar skärmbilder till `shots/`.
- `common.py`: tar bara arbetsytan, utan klistrat sidhuvud och nästa-rad.
- `film.html`: manuset (`MANUS`) och scenerna, ritade som funktioner av tiden.
- `render.py`: en bild per ruta, 25 per sekund.
- `encode.py`: övertoningar och kodning till MP4, WebM och affischbild.
