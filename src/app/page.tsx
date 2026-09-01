const regions = [
  ["Emberhold", "Chamas, aço e ambição moldam cada confronto.", "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/emberhold.svg"],
  ["Florestia", "Vida ancestral, crescimento e força que nunca cessa.", "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/florestia.svg"],
  ["Ironwood", "Disciplina, máquinas e resistência acima de tudo.", "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/ironwood.svg"],
  ["Tempestade", "Velocidade, relâmpagos e domínio do ritmo da batalha.", "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/tempestade.svg"],
  ["Tidecall", "Marés, controle e poder que cresce como o oceano.", "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/tidecall.svg"],
  ["Voidborn", "O vazio responde a quem ousa pagar o preço.", "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/voidborn.svg"],
];

const cardTypes = ["Unidade", "Sentinela", "Estrutura", "Artefato", "Encantamento", "Ritual", "Armadilha"];

export default function HomePage() {
  return (
    <main id="top">
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="RuneForge início">
          <span className="brand-mark"><span>RF</span></span>
          <span className="brand-copy"><strong>RuneForge</strong><small>Tactical Card Game</small></span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#cards">Cartas</a><a href="#regions">Regiões</a><a href="#rules">Como jogar</a><a href="#alpha">Alpha</a>
        </nav>
        <a className="nav-cta" href="#alpha">Entrar na forja</a>
      </header>

      <section className="hero">
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> O CAMPO RESPONDE À SUA VONTADE <span /></div>
          <h1>Forje sua lenda.<br/><em>Quebre o destino.</em></h1>
          <p>RuneForge é um card game tático onde timing, construção de deck e leitura do adversário importam tanto quanto poder bruto.</p>
          <div className="actions"><a className="primary" href="#cards">Descobrir RuneForge</a><a className="secondary" href="#rules">Aprender a jogar</a></div>
          <div className="hero-stats"><span><strong>6</strong> regiões</span><span><strong>7</strong> tipos de carta</span><span><strong>1</strong> campo para dominar</span></div>
        </div>
        <div className="sigil-stage" aria-hidden="true">
          <div className="sigil-orbit orbit-one" /><div className="sigil-orbit orbit-two" />
          <div className="sigil-core"><span>ᚱ</span></div>
          <i className="spark spark-a"/><i className="spark spark-b"/><i className="spark spark-c"/>
        </div>
        <div className="scroll-mark">EXPLORE <span>↓</span></div>
      </section>

      <section className="section intro" id="cards">
        <div className="section-kicker">ARSENAL DA FORJA</div>
        <div className="section-heading"><h2>Cada carta é uma decisão.<br/>Cada decisão, uma ameaça.</h2><p>Construa estratégias que combinam permanentes, respostas, pressão de campo e janelas de reação. O seu deck não é só uma coleção: é a sua doutrina.</p></div>
        <div className="card-showcase">
          <article className="featured-card card-a"><div className="card-frame"><span className="mana">4</span><div className="card-art"><span>EMBERHOLD</span></div><div className="card-info"><small>UNIDADE • GUERREIRO</small><h3>Campeão da Forja</h3><p>Quando entra em combate, transforme pressão em vantagem.</p><div className="stats"><b>5</b><b>4</b></div></div></div></article>
          <article className="featured-card card-b"><div className="card-frame"><span className="mana">3</span><div className="card-art"><span>VOIDBORN</span></div><div className="card-info"><small>ARMADILHA • REAÇÃO</small><h3>Eclipse do Vazio</h3><p>Espere o instante perfeito. Então mude o resultado inteiro.</p><div className="stats"><b>✦</b><b>∞</b></div></div></div></article>
          <div className="types-panel"><span>TIPOS CERTIFICADOS</span><div>{cardTypes.map((type, i) => <p key={type}><b>0{i+1}</b>{type}</p>)}</div></div>
        </div>
      </section>

      <section className="section regions" id="regions">
        <div className="section-kicker">ESCOLHA SUA ORIGEM</div>
        <div className="section-heading"><h2>Seis regiões.<br/>Seis formas de vencer.</h2><p>Cada região carrega uma filosofia própria de combate, identidade visual e linguagem estratégica.</p></div>
        <div className="region-grid">
          {regions.map(([name, text, icon], i) => <article className="region-card" key={name}><div className="region-number">0{i+1}</div><div className="region-icon"><img src={icon} alt="" /></div><h3>{name}</h3><p>{text}</p><a href="#rules">Conhecer doutrina <span>↗</span></a></article>)}
        </div>
      </section>

      <section className="battle-section" id="rules">
        <div className="battle-overlay" />
        <div className="battle-copy"><span className="section-kicker">NÃO É SÓ BAIXAR CARTAS</span><h2>Leia o campo.<br/>Controle o tempo.<br/><em>Force o erro.</em></h2><p>Mana, spell mana, permanentes, stack, reação, negação e timing criam partidas onde cada janela pode definir o duelo.</p><div className="battle-points"><span><b>01</b> Planeje sua curva</span><span><b>02</b> Ameace respostas</span><span><b>03</b> Domine a prioridade</span></div><a className="primary" href="#alpha">Preparar-se para o Alpha</a></div>
        <div className="battle-rune" aria-hidden="true">ᛉ</div>
      </section>

      <section className="section alpha" id="alpha">
        <div className="alpha-panel"><div><span className="live-dot"/> ALPHA EM CONSTRUÇÃO</div><h2>A forja já está acesa.</h2><p>O portal público acompanhará o jogo com cartas, regras, coleções, novidades e acesso à experiência RuneForge.</p><a className="primary" href="#top">Voltar ao topo</a></div>
      </section>

      <footer><div className="footer-brand"><span className="brand-mark small"><span>RF</span></span><div><strong>RuneForge</strong><small>Forge your legend.</small></div></div><span>Portal oficial • Visual v0.2</span><span>© 2026 RuneForge</span></footer>
    </main>
  );
}
