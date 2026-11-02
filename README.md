# Site institucional — FBSJ Tecnologia

Site estático (HTML5, CSS3 e JavaScript puro), sem dependências e sem etapa de build, publicado gratuitamente no GitHub Pages.

## Estrutura

```
index.html                    Página principal (todas as seções)
politica-de-privacidade.html  Política de privacidade (LGPD)
404.html                      Página de erro
sitemap.xml / robots.txt      SEO
site.webmanifest              Ícones e cores para celulares
favicon.ico
assets/
  css/style.css               Estilos (variáveis de cor no topo do arquivo)
  js/main.js                  Menu, animações, partículas e formulário
  img/                        Logotipo, imagens do portfólio e imagem de compartilhamento
```

## Como atualizar

- **Textos:** edite `index.html`. Cada seção está marcada com um comentário (`<!-- SERVIÇOS -->`, `<!-- CONTATO -->` etc.).
- **Cores:** altere as variáveis em `:root` no início de `assets/css/style.css`.
- **WhatsApp:** os links usam `https://wa.me/5561986183317?text=...`. Para trocar o número, substitua `5561986183317` em todos os arquivos.
- **Portfólio:** troque as imagens `assets/img/demo-*.webp` / `.jpg` (1200×760) e os textos dos cards. Quando houver projetos reais autorizados pelos clientes, remova o selo "Demonstração".
- **Publicar alterações:** no GitHub, abra o arquivo, clique no lápis (Edit), salve com *Commit changes*. O GitHub Pages atualiza o site em 1 a 2 minutos.

## Formulário de contato

O formulário usa o [FormSubmit](https://formsubmit.co) (gratuito, sem cadastro), que envia as mensagens para `fbsj.tecnologia@outlook.com`.
Na **primeira** mensagem enviada pelo site, o FormSubmit manda um e-mail de ativação para esse endereço — é preciso clicar em **Activate Form** uma única vez.
O botão "Enviar pelo WhatsApp" funciona sempre, sem depender de serviço externo.

## SEO

- Título, descrição, Open Graph e Twitter Card em `index.html`.
- Dados estruturados Schema.org (`ProfessionalService` + `WebSite`).
- `sitemap.xml` e `robots.txt`. Após publicar, cadastre o site no Google Search Console e envie o sitemap.
