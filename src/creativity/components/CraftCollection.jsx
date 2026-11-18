import React, { useEffect, useState } from 'react'
import { studies } from '@creativity/catalog.js'
import './CraftCollection.css'

export const title = 'Interaction studies'
export const description = 'Select a component to open it and explore the interaction.'

function StudyDate({ date }) {
  if (!date) return null
  const label = new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
  return <time dateTime={date}>{label}</time>
}

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
          <div><h3 id="craft-detail-title">{selected.title}</h3><StudyDate date={selected.date} /></div>
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
          <strong>{study.title}</strong>
          <StudyDate date={study.date} />
        </button>
      ))}
    </div>
  )
}
