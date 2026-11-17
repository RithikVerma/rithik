const modules = import.meta.glob('./components/*.jsx', { eager: true })

export default function Creativity() {
  return (
    <div className="wrap creativity">
      <header className="hero">
        <h1>Creativity</h1>
        <p className="role">A collection of interface components and design experiments.</p>
      </header>
      {Object.entries(modules).map(([path, component]) => {
        const Preview = component.default
        const filename = path.split('/').pop().replace(/\.jsx$/, '')
        const name = component.title || filename.replace(/([a-z])([A-Z])/g, '$1 $2')
        return (
          <article className="component-entry" key={path}>
            <div className="component-preview" role="group" aria-label={name + ' preview'}>
              <Preview />
            </div>
            <h2>{name}</h2>
            {component.description && <p>{component.description}</p>}
          </article>
        )
      })}
      {!Object.keys(modules).length && <p className="component-empty">No components have been added yet.</p>}
    </div>
  )
}
