# Como adicionar fotos aos produtos

As pastas já foram criadas em `public/imagens/produtos/`.

Cada pasta corresponde a um produto pelo seu ID:

| Pasta | Produto |
|-------|---------|
| `public/imagens/produtos/1/` | Anel Aurora |
| `public/imagens/produtos/2/` | Corrente Atlas |
| `public/imagens/produtos/3/` | Bracelete Lume |
| `public/imagens/produtos/4/` | Argola Íris |
| `public/imagens/produtos/5/` | Pingente Lua |
| `public/imagens/produtos/6/` | Conjunto Essenza |

## Passos

1. **Copie suas fotos** para a pasta do produto. Ex:
   ```
   public/imagens/produtos/1/foto1.jpg
   public/imagens/produtos/1/foto2.jpg
   public/imagens/produtos/1/foto3.jpg
   ```

2. **Abra `app/page.tsx`** e encontre o produto. Descomente e edite o campo `images`:
   ```ts
   {
     id: 1,
     name: 'Anel Aurora',
     // ...
     images: [
       '/imagens/produtos/1/foto1.jpg',
       '/imagens/produtos/1/foto2.jpg',
       '/imagens/produtos/1/foto3.jpg',
     ],
   }
   ```

3. **Pronto!** Ao clicar no nome ou nas fotos do produto no catálogo, o visualizador de fotos abrirá com navegação por setas e miniaturas.

## Formatos suportados

`.jpg`, `.jpeg`, `.png`, `.webp`

## Dica de nomenclatura

Use nomes simples sem acentos ou espaços:
- ✅ `foto1.jpg`, `detalhe.jpg`, `vista-lateral.jpg`
- ❌ `foto 1.jpg`, `ângulo.jpg`

