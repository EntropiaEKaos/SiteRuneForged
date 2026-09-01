const pillars = [
  ["Cartas", "Explore o acervo oficial e descubra novas sinergias."],
  ["Regras", "Aprenda timing, tipos de carta, combate e mecânicas."],
  ["Universo", "Conheça as regiões, facções e histórias de RuneForge."],
];

export default function HomePage() {
  return (
    <main>
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="RuneForge início">
          <span className="brand-mark">RF</span>
          <span>RuneForge</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#cards">Cartas</a><a href="#rules">Regras</a><a href="#world">Universo</a>
        </nav>
        <a className="nav-cta" href="#alpha">Alpha</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow" />
        <div className="eyebrow">TACTICAL CARD GAME</div>
        <h1>Forje seu destino.<br/><span>Domine o campo.</span></h1>
        <p>Entre em RuneForge, construa seu arsenal e transforme cada decisão em uma história digna de lenda.</p>
        <div className="actions"><a className="primary" href="#cards">Explorar cartas</a><a className="secondary" href="#rules">Como jogar</a></div>
        <div className="rune" aria-hidden="true"><div className="rune-inner">ᚱ</div></div>
      </section>

      <section className="pillars" aria-label="Descubra RuneForge">
        {pillars.map(([title, text], i) => <article id={i === 0 ? "cards" : i === 1 ? "rules" : "world"} key={title}><span>0{i+1}</span><h2>{title}</h2><p>{text}</p><a href="#top">Descobrir →</a></article>)}
      </section>

      <section className="manifesto" id="alpha"><div><span>EM DESENVOLVIMENTO</span><h2>Uma nova forja está despertando.</h2></div><p>O portal oficial acompanhará RuneForge rumo ao Alpha, reunindo cartas, regras, coleções e atualizações em uma única fonte pública.</p></section>
      <footer><span>© RuneForge</span><span>Portal público — Foundation v0.1</span></footer>
    </main>
  );
}
