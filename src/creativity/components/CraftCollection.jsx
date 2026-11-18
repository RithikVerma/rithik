import React, { useEffect, useState } from 'react'
import { ElasticSlider, HoldToConfirm, MagneticDock, PrecisionDial, SegmentedControl, StackedToasts } from '../craft/Studies'
import '../craft/studies.css'
import './CraftCollection.css'

export const title = 'Interaction studies'
export const description = 'Select a component to open it and explore the interaction.'

const studies = [
  { name: 'Precision dial', slug: 'precision-dial', date: 'Nov 18, 2026', Component: PrecisionDial },
  { name: 'Magnetic dock', slug: 'magnetic-dock', date: 'Nov 18, 2026', Component: MagneticDock },
  { name: 'Stacked toasts', slug: 'stacked-toasts', date: 'Nov 18, 2026', Component: StackedToasts },
  { name: 'Elastic slider', slug: 'elastic-slider', date: 'Nov 18, 2026', Component: ElasticSlider },
  { name: 'Hold to confirm', slug: 'hold-to-confirm', date: 'Nov 18, 2026', Component: HoldToConfirm },
  { name: 'Segmented control', slug: 'segmented-control', date: 'Nov 18, 2026', Component: SegmentedControl },
]

function selectedFromUrl() {
  const slug = new URLSearchParams(window.location.search).get('component')
  return studies.find((study) => study.slug === slug) || null
}

export default function CraftCollection() {
  const [selected, setSelected] = useState(selectedFromUrl)

  useEffect(() => {
    const handleBack = () => setSelected(selectedFromUrl())
    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

  function updateSelection(study) {
    const url = new URL(window.location.href)
    if (study) url.searchParams.set('component', study.slug)
    else url.searchParams.delete('component')
    window.history.pushState({}, '', url)
    setSelected(study)
    window.dispatchEvent(new CustomEvent('creativity-selection', { detail: Boolean(study) }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (selected) {
    return (
      <section className="craft-detail" aria-labelledby="craft-detail-title">
        <button className="craft-back" type="button" onClick={() => updateSelection(null)}><span aria-hidden="true">&larr;</span> Back</button>
        <div className="craft-detail-head">
          <div><h3 id="craft-detail-title">{selected.name}</h3><time dateTime="2026-11-18">{selected.date}</time></div>
          <button className="craft-close" type="button" aria-label="Close component" onClick={() => updateSelection(null)}>&times;</button>
        </div>
        <div className="craft-detail-stage">{React.createElement(selected.Component)}</div>
      </section>
    )
  }

  return (
    <div className="craft-list" role="list">
      {studies.map((study) => (
        <button className="craft-list-item" key={study.slug} type="button" role="listitem" onClick={() => updateSelection(study)}>
          <strong>{study.name}</strong>
          <time dateTime="2026-11-18">{study.date}</time>
        </button>
      ))}
    </div>
  )
}
