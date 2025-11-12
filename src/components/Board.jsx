export default function Board({ header, left, right, id }) {
  return (
    <div id={id || undefined} className="container">
      <div className="board">
        <div className="board-inner">
          {header ? <div className="board-header">{header}</div> : null}
          <div className="layout">
            <section className="panel">
              <div className="panel-inner">
                {left}
              </div>
            </section>
            {right ? (
              <aside className="filters" aria-label="Filtros">
                {right}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
