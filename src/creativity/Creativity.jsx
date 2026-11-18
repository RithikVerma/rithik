import { useEffect, useState } from 'react'

const modules = import.meta.glob('./components/*.jsx', { eager: true })

export default function Creativity() {
  const [hasSelection, setHasSelection] = useState(() => new URLSearchParams(window.location.search).has('component'))

  useEffect(() => {
    const syncSelection = (event) => setHasSelection(event.detail ?? new URLSearchParams(window.location.search).has('component'))
    window.addEventListener('creativity-selection', syncSelection)
    window.addEventListener('popstate', syncSelection)
    return () => {
      window.removeEventListener('creativity-selection', syncSelection)
      window.removeEventListener('popstate', syncSelection)
    }
  }, [])

  return (
    <div className={'wrap creativity' + (hasSelection ? ' creativity-detail' : '')}>
      {!hasSelection && <header className="hero">
        <h1>Creativity</h1>
        <p className="role">A collection of interface components and design experiments.</p>
      </header>}
      <div className="component-gallery">
        {Object.entries(modules).map(([path, component]) => {
        const Preview = component.default
        const filename = path.split('/').pop().replace(/\.jsx$/, '')
        const name = component.title || filename.replace(/([a-z])([A-Z])/g, '$1 $2')
        return (
          <article className="component-entry" key={path}>
            {!hasSelection && <div className="component-heading">
              <h2>{name}</h2>
              {component.description && <p>{component.description}</p>}
            </div>}
            <div className="component-preview" role="group" aria-label={name + ' preview'}>
              <Preview />
            </div>
          </article>
        )
        })}
      </div>
      {!Object.keys(modules).length && <p className="component-empty">No components have been added yet.</p>}
    </div>
  )
}
