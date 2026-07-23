# RUJUMENTO — Rudimentos para jumentos

App de estudo de bateria que funciona **100% offline** no celular: os 40 rudimentos oficiais
da PAS, 15 ritmos (brasileiros e estrangeiros), metrônomo de precisão e o professor "Jumestre".

- HTML/CSS/JavaScript puro, sem frameworks.
- Todos os sons sintetizados na hora (Web Audio API) — nenhum arquivo de áudio.
- PWA: depois de aberto uma vez, funciona sem internet (service worker).
- Nenhum backend, login ou coleta de dados. Tudo fica no aparelho (localStorage).

## Rodar localmente

Abra `index.html` num navegador, ou sirva a pasta:

```
python3 -m http.server 8000
```

e acesse `http://localhost:8000`.

## Publicado em

GitHub Pages (veja a aba **Settings → Pages** do repositório).
