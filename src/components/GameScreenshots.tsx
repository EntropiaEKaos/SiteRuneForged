import styles from "./GameScreenshots.module.css";

const instagramHref = "https://www.instagram.com/runeforgeproject/";

const screenshots = [
  {
    src: "/gameplay/05-battlefield.webp",
    alt: "RuneForge Alpha em uma partida PvE no campo de batalha",
    eyebrow: "BATALHA PVE",
    title: "O campo em ação",
    description: "Campo de batalha real do Alpha com mão, Nexus, permanentes e barra de ações.",
  },
  {
    src: "/gameplay/06-collection.webp",
    alt: "Tela de coleção de cartas do RuneForge Alpha",
    eyebrow: "COLEÇÃO",
    title: "Seu arsenal",
    description: "A coleção dentro do cliente real, conectada ao catálogo e à construção de decks.",
  },
  {
    src: "/gameplay/07-forge.webp",
    alt: "Tela Forge do RuneForge Alpha",
    eyebrow: "FORGE",
    title: "A Forja",
    description: "Progressão e construção da experiência dentro do cliente jogável de RuneForge.",
  },
];

export default function GameScreenshots() {
  return (
    <section className={styles.section} id="gameplay" data-gameplay-gallery>
      <div className={styles.heading}>
        <div>
          <span>ALPHA · CAPTURAS CERTIFICADAS</span>
          <h2>Veja RuneForge<br/><em>em jogo.</em></h2>
        </div>
        <div className={styles.headingCopy}>
          <p>Imagens capturadas em navegador real pela jornada automatizada do Alpha. Nada aqui é mockup de marketing.</p>
          <small>BACKEND 854efa1e7984 · CI #922</small>
        </div>
      </div>

      <div className={styles.grid}>
        {screenshots.map((shot) => (
          <figure className={styles.shot} key={shot.src}>
            <div className={styles.imageWrap}>
              <img src={shot.src} alt={shot.alt} loading="lazy" />
              <span>{shot.eyebrow}</span>
            </div>
            <figcaption>
              <strong>{shot.title}</strong>
              <p>{shot.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.social}>
        <div>
          <span>BASTIDORES DA FORJA</span>
          <strong>@runeforgeproject</strong>
          <p>Acompanhe novos builds, artes, cartas e cenas do desenvolvimento no Instagram oficial.</p>
        </div>
        <a href={instagramHref} target="_blank" rel="noreferrer" data-analytics="instagram-gameplay">
          Seguir no Instagram <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
