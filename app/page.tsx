'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Gem, Image as ImageIcon, Menu, Minus, Plus, ShoppingBag, Sparkles, Star, Trash2, X } from 'lucide-react'

// ─── Tipos ──────────────────────────────────────────────────────────────────

type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  image: string
  /** Caminhos das fotos locais em public/imagens/produtos/{id}/  */
  images?: string[]
}

// ─── Dados dos produtos ──────────────────────────────────────────────────────
// Para adicionar fotos próprias:
//   1. Coloque as imagens em: public/imagens/produtos/{id}/foto1.jpg, foto2.jpg ...
//   2. Adicione os caminhos no campo "images" do produto correspondente.
//      Ex: images: ['/imagens/produtos/1/foto1.jpg', '/imagens/produtos/1/foto2.jpg']
// ────────────────────────────────────────────────────────────────────────────

const products: Product[] = [
  {
    id: 1,
    name: 'Anel Aurora',
    category: 'Anéis',
    price: 89.9,
    description: 'Prata 925 • acabamento polido',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
    images: [
      // Adicione aqui os caminhos das fotos do Anel Aurora
      // '/imagens/produtos/1/foto1.jpg',
      // '/imagens/produtos/1/foto2.jpg',
    ],
  },
  {
    id: 2,
    name: 'Corrente Atlas',
    category: 'Correntes',
    price: 149.9,
    description: 'Prata 925 • elo italiano',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85',
    images: [
      // '/imagens/produtos/2/foto1.jpg',
    ],
  },
  {
    id: 3,
    name: 'Bracelete Lume',
    category: 'Pulseiras',
    price: 119.9,
    description: 'Prata 925 • design orgânico',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85',
    images: [
      // '/imagens/produtos/3/foto1.jpg',
    ],
  },
  {
    id: 4,
    name: 'Argola Íris',
    category: 'Brincos',
    price: 69.9,
    description: 'Prata 925 • leveza para todos os dias',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85',
    images: [
      // '/imagens/produtos/4/foto1.jpg',
    ],
  },
  {
    id: 5,
    name: 'Pingente Lua',
    category: 'Pingentes',
    price: 79.9,
    description: 'Prata 925 • brilho sutil',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
    images: [
      // '/imagens/produtos/5/foto1.jpg',
    ],
  },
  {
    id: 6,
    name: 'Conjunto Essenza',
    category: 'Conjuntos',
    price: 179.9,
    description: 'Prata 925 • colar e brincos',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
    images: [
      // '/imagens/produtos/6/foto1.jpg',
    ],
  },
]

const categories = ['Todos', 'Anéis', 'Correntes', 'Pulseiras', 'Brincos', 'Pingentes', 'Conjuntos']
const formatPrice = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Retorna todas as imagens de um produto (locais + fallback para URL externa) */
function getProductImages(product: Product): string[] {
  const local = (product.images ?? []).filter(Boolean)
  if (local.length > 0) return local
  return [product.image]
}

// ─── Componente: Galeria/Lightbox ────────────────────────────────────────────

function ProductGallery({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const allImages = getProductImages(product)
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : allImages.length - 1)), [allImages.length])
  const next = useCallback(() => setCurrent((c) => (c < allImages.length - 1 ? c + 1 : 0)), [allImages.length])

  // Navegação por teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  // Bloqueia scroll do body enquanto lightbox está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="gallery-overlay" onClick={onClose}>
      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
        {/* Botão fechar */}
        <button className="gallery-close" onClick={onClose}>
          <X size={16} /> Fechar
        </button>

        {/* Imagem principal */}
        <div className="gallery-main">
          <img key={current} src={allImages[current]} alt={`${product.name} — foto ${current + 1}`} />

          {allImages.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={prev} aria-label="Foto anterior">
                <ChevronLeft size={20} />
              </button>
              <button className="gallery-nav next" onClick={next} aria-label="Próxima foto">
                <ChevronRight size={20} />
              </button>
              <span className="gallery-counter">{current + 1} / {allImages.length}</span>
            </>
          )}
        </div>

        {/* Informações do produto */}
        <div className="gallery-info">
          <strong>{product.name}</strong>
          {product.category} · {product.description}
        </div>

        {/* Miniaturas */}
        {allImages.length > 1 && (
          <div className="gallery-thumbs">
            {allImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Miniatura ${i + 1}`}
                className={`gallery-thumb${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function Page() {
  const [category, setCategory] = useState('Todos')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [gallery, setGallery] = useState<Product | null>(null)

  const filtered = category === 'Todos' ? products : products.filter((p) => p.category === category)
  const cartItems = useMemo(() => products.filter((p) => cart[p.id]), [cart])
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  const total = cartItems.reduce((sum, p) => sum + p.price * cart[p.id], 0)

  const addToCart = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const changeQuantity = (id: number, change: number) =>
    setCart((c) => {
      const next = (c[id] || 0) + change
      if (next <= 0) { const copy = { ...c }; delete copy[id]; return copy }
      return { ...c, [id]: next }
    })
  const checkout = () => {
    const lines = cartItems.map((p) => `• ${p.name} — ${cart[p.id]}x — ${formatPrice(p.price)}`).join('%0A')
    window.open(`https://wa.me/5511999999999?text=Olá! Gostaria de fazer um pedido:%0A%0A${lines}%0A%0ATotal: ${formatPrice(total)}%0A%0AGostaria de confirmar a disponibilidade dos produtos.`, '_blank')
  }

  return (
    <main>
      {/* ─── Header ─── */}
      <header className="site-header">
        <a href="#inicio" className="brand">
          <span className="brand-mark"><Gem size={17} /></span>
          <span>ANA<span className="brand-muted"> PRATAS</span></span>
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
          <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a>
          <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
        </nav>
        <div className="header-actions">
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Abrir carrinho">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span>{totalItems}</span>}
          </button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
            <Menu size={23} />
          </button>
        </div>
      </header>

      {/* ─── Capa com Vídeo ─── */}
      <section id="inicio" className="video-hero">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div className="video-hero-overlay" />

        <div className="video-hero-content">
          <p className="video-hero-eyebrow">
            <Sparkles size={13} /> joias em prata 925
          </p>

          <h1 className="video-hero-title">
            Ana Pratas
            <span>— Prata que combina com você —</span>
          </h1>

          <div className="video-hero-cta">
            <a href="#catalogo">
              Explorar coleção <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <div className="video-hero-scroll" aria-hidden="true">scroll</div>
      </section>

      {/* ─── Marquee ─── */}
      <section className="marquee">
        <span>PRATA 925</span>
        <span>DESIGN ATEMPORAL</span>
        <span>FEITO PARA VOCÊ</span>
        <span>PRATA 925</span>
        <span>DESIGN ATEMPORAL</span>
      </section>

      {/* ─── Catálogo ─── */}
      <section id="catalogo" className="catalog-section section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">coleção atual</p>
            <h2>Nosso catálogo<span className="dot">.</span></h2>
          </div>
          <p className="section-intro">
            Peças escolhidas para acompanhar<br />cada versão de você.
          </p>
        </div>

        <div className="category-tabs">
          {categories.map((item) => (
            <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filtered.map((product, index) => {
            const hasMultiplePhotos = getProductImages(product).length > 1
            return (
              <article
                className="product-card"
                key={product.id}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-number">0{index + 1}</span>

                  {/* Botão "ver fotos" — aparece se houver múltiplas fotos */}
                  {hasMultiplePhotos && (
                    <button
                      className="view-photos-btn"
                      onClick={() => setGallery(product)}
                      aria-label={`Ver fotos de ${product.name}`}
                    >
                      <ImageIcon size={11} />
                      {getProductImages(product).length} fotos
                    </button>
                  )}

                  <button
                    className="quick-add"
                    onClick={() => { addToCart(product.id); setCartOpen(true) }}
                    aria-label={`Adicionar ${product.name}`}
                  >
                    <Plus size={19} />
                  </button>
                </div>

                <div className="product-info">
                  <div>
                    <p className="product-category">{product.category}</p>
                    <h3
                      onClick={() => setGallery(product)}
                      style={{ cursor: 'pointer' }}
                      title="Ver fotos"
                    >
                      {product.name}
                    </h3>
                    <p className="product-description">{product.description}</p>
                  </div>
                  <strong>{formatPrice(product.price)}</strong>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ─── Seção feature ─── */}
      <section className="feature-section section">
        <div className="feature-image">
          <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85" alt="Detalhe de joias de prata" />
        </div>
        <div className="feature-copy">
          <p className="eyebrow">o detalhe importa</p>
          <h2>Detalhes que fazem<br /><em>a diferença.</em></h2>
          <p>Cada peça é pensada para iluminar o cotidiano. Materiais honestos, formas que permanecem e um brilho que é só seu.</p>
          <div className="detail-list">
            <span><Gem size={16} /> Prata 925</span>
            <span><Star size={16} /> Qualidade selecionada</span>
            <span><Sparkles size={16} /> Design exclusivo</span>
          </div>
          <a href="#sobre" className="text-link">Conheça nossa essência <ArrowRight size={16} /></a>
        </div>
      </section>

      {/* ─── Editorial ─── */}
      <section className="editorial">
        <div className="editorial-copy">
          <p className="eyebrow">uma pausa para você</p>
          <h2>Seu brilho<br /><em>não pede licença.</em></h2>
          <a href="#catalogo" className="button light">Ver peças <ArrowRight size={17} /></a>
        </div>
        <div className="editorial-image">
          <img src="https://images.unsplash.com/photo-1599459183200-59c768f642c0?auto=format&fit=crop&w=1200&q=85" alt="Colar de prata em composição editorial" />
          <span>02 / 02</span>
        </div>
      </section>

      {/* ─── Sobre ─── */}
      <section id="sobre" className="about section">
        <div>
          <p className="eyebrow">sobre a alma</p>
          <h2>Mais que uma joia,<br /><em>um detalhe que<br />representa você.</em></h2>
        </div>
        <div className="about-copy">
          <p>A Alma Prata nasceu para aproximar joias especiais da vida real. Acreditamos no poder dos pequenos gestos, nas escolhas que contam histórias e em peças que acompanham você, sem definir quem você é.</p>
          <p>Descubra uma curadoria de prata feita para durar — e para fazer sentido.</p>
          <a href="#contato" className="text-link">Fale com a gente <ArrowRight size={16} /></a>
        </div>
      </section>

      {/* ─── Benefícios ─── */}
      <section className="benefits section">
        <div className="benefit"><span>01</span><Gem size={22} /><h3>Prata 925</h3><p>Materiais escolhidos para acompanhar seu ritmo.</p></div>
        <div className="benefit"><span>02</span><Sparkles size={22} /><h3>Peças selecionadas</h3><p>Uma curadoria com intenção em cada detalhe.</p></div>
        <div className="benefit"><span>03</span><Star size={22} /><h3>Atendimento próximo</h3><p>Estamos aqui para ajudar você a escolher.</p></div>
        <div className="benefit"><span>04</span><ShoppingBag size={22} /><h3>Compra fácil</h3><p>Seu pedido resolvido de forma simples pelo WhatsApp.</p></div>
      </section>

      {/* ─── Footer ─── */}
      <footer id="contato">
        <div className="footer-top">
          <div>
            <a href="#inicio" className="brand footer-brand">
              <span className="brand-mark"><Gem size={17} /></span>
              ANA<span className="brand-muted"> PRATAS</span>
            </a>
            <p>Prata que combina<br />com você.</p>
          </div>
          <div className="footer-links">
            <div>
              <span>explore</span>
              <a href="#catalogo">Catálogo</a>
              <a href="#sobre">Sobre nós</a>
              <a href="#contato">Contato</a>
            </div>
            <div>
              <span>encontre</span>
              <a href="https://instagram.com" target="_blank">Instagram</a>
              <a href="https://wa.me/5511999999999" target="_blank">WhatsApp</a>
              <a href="mailto:oi@almaprata.com">oi@almaprata.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 Ana Pratas</span>
          <span>feito com intenção <Sparkles size={15} /></span>
        </div>
      </footer>

      {/* ─── Carrinho ─── */}
      {cartOpen && (
        <>
          <div className="overlay" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer">
            <div className="drawer-header">
              <div>
                <p className="eyebrow">sua seleção</p>
                <h2>Seu carrinho <span>({totalItems})</span></h2>
              </div>
              <button onClick={() => setCartOpen(false)} aria-label="Fechar carrinho"><X size={22} /></button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={35} />
                <p>Seu carrinho está esperando<br />por algo especial.</p>
                <button className="button primary" onClick={() => setCartOpen(false)}>Explorar catálogo</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((product) => (
                    <div className="cart-item" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div className="cart-item-detail">
                        <div>
                          <p>{product.category}</p>
                          <h3>{product.name}</h3>
                        </div>
                        <strong>{formatPrice(product.price * cart[product.id])}</strong>
                        <div className="quantity">
                          <button onClick={() => changeQuantity(product.id, -1)}><Minus size={13} /></button>
                          <span>{cart[product.id]}</span>
                          <button onClick={() => changeQuantity(product.id, 1)}><Plus size={13} /></button>
                          <button className="remove" onClick={() => changeQuantity(product.id, -cart[product.id])}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div>
                    <span>Total</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  <button className="button whatsapp" onClick={checkout}>Finalizar pelo WhatsApp <ArrowRight size={17} /></button>
                  <small>Você será direcionado para o WhatsApp para confirmar seu pedido.</small>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      {/* ─── Galeria de fotos ─── */}
      {gallery && (
        <ProductGallery product={gallery} onClose={() => setGallery(null)} />
      )}
    </main>
  )
}
