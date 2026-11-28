import Link from "next/link";

type StoryCard = { eyebrow: string; title: string; body: string };
type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  sceneLabel: string;
  sceneNote: string;
  cards: StoryCard[];
  closingTitle: string;
  closingText: string;
};

export default function CinematicEditorialPage(props: Props) {
  return (
    <main className="lado-editorial-page">
      <section className="lado-editorial-hero">
        <div className="lado-editorial-copy">
          <p className="lado-editorial-eyebrow">{props.eyebrow}</p>
          <h1>{props.title}</h1>
          <p className="lado-editorial-intro">{props.intro}</p>
          <div className="lado-editorial-actions">
            <Link href="/store" className="lado-editorial-primary">Explore the collection <span>↗</span></Link>
            <Link href="/contact" className="lado-editorial-secondary">Speak with Lado</Link>
          </div>
        </div>
        <div className="lado-editorial-scene" role="img" aria-label={props.sceneLabel}>
          <div className="lado-scene-sun" />
          <div className="lado-scene-ridge ridge-one" />
          <div className="lado-scene-ridge ridge-two" />
          <div className="lado-scene-house"><i /><b /></div>
          <div className="lado-scene-tree tree-one"><i /><b /></div>
          <div className="lado-scene-tree tree-two"><i /><b /></div>
          <div className="lado-scene-cow"><i /><b /><span /></div>
          <div className="lado-scene-ground" />
          <div className="lado-scene-caption"><span>{props.sceneLabel}</span><strong>{props.sceneNote}</strong></div>
        </div>
      </section>
      <section className="lado-editorial-introduction">
        <span className="lado-editorial-kicker">LADO LOVE PURE · PILANI, RAJASTHAN</span>
        <p>{props.intro}</p>
      </section>
      <section className="lado-editorial-grid">
        {props.cards.map((card, index) => (
          <article className="lado-editorial-card" key={card.title}>
            <span className="lado-editorial-card-number">0{index + 1}</span>
            <p>{card.eyebrow}</p>
            <h2>{card.title}</h2>
            <div>{card.body}</div>
          </article>
        ))}
      </section>
      <section className="lado-editorial-closing">
        <p className="lado-editorial-eyebrow">DISCOVER LADO ORGANICS</p>
        <h2>{props.closingTitle}</h2>
        <p>{props.closingText}</p>
        <div className="lado-editorial-actions">
          <Link href="/store" className="lado-editorial-primary">Shop the collection <span>↗</span></Link>
          <Link href="/trace" className="lado-editorial-secondary">Explore batch traceability</Link>
        </div>
      </section>
    </main>
  );
}
