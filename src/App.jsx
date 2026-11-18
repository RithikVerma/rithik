import { useEffect, useState } from 'react'
import { FiArrowUp, FiArrowUpRight, FiDownload, FiGithub, FiLinkedin, FiMapPin, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import { projects, experience, skills } from './portfolio'
import Creativity from './creativity/Creativity'
import ContactLinks from './ContactLinks'
import './App.css'

const home = import.meta.env.BASE_URL
const creativityUrl = home + 'creativity/'
const links = [['Work', home + '#work'], ['Creativity', creativityUrl], ['Experience', home + '#experience'], ['Skills', home + '#skills'], ['Education', home + '#education']]

function ThemeToggle() {
  const [preference, setPreference] = useState(() => document.documentElement.dataset.theme)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const dark = preference ? preference === 'dark' : systemDark

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setSystemDark(media.matches)
    media.addEventListener('change', sync)
    sync()
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]').content =
      getComputedStyle(document.documentElement).backgroundColor
  }, [dark])

  function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setPreference(next)
    try {
      localStorage.setItem('portfolio-theme', next)
    } catch {
      // Keep the selected theme for this page when storage is unavailable.
    }
  }

  return (
    <button type="button" className="theme-toggle" aria-label="Dark mode" aria-pressed={dark}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
      {dark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </button>
  )
}

function App({ page }) {
  const [menu, setMenu] = useState(false)
  const isCreativity = page === 'creativity'
  const navigation = links.map(([label, href]) => (
    <a key={href} href={href} aria-current={isCreativity && href === creativityUrl ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</a>
  ))
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="site-head" id="top"><div className="wrap head-inner">
      <a href={home} className="brand" aria-label="Rithik Verma home"><span className="monogram">rv.</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation}</nav>
      <div className="head-actions"><ThemeToggle /><a className="talk" href={home + '#contact'}>Contact</a>
      <button className="menu-toggle" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <FiX /> : <FiMenu />}</button></div>
      {menu && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{navigation}</nav>}
    </div></header>
    <main id="main">
      {isCreativity ? <Creativity /> : <Portfolio />}
    </main>
    <footer className="wrap"><span>© {new Date().getFullYear()} Rithik Verma</span><a href="#top">Back to top <FiArrowUp /></a></footer>
  </>
}

function Portfolio() {
  return <>
      <section className="wrap hero" aria-labelledby="hero-title">
        <picture className="hero-banner">
          <source media="(prefers-reduced-motion: reduce)" srcSet={import.meta.env.BASE_URL + 'hero-waterfall.png'} />
          <img src={import.meta.env.BASE_URL + 'hero-waterfall.gif'} width="977" height="259" alt="" />
        </picture>
        <h1 id="hero-title">Rithik Verma</h1>
        <p className="role">Software engineer</p>
        <p className="hero-description">I build websites and mobile apps with React and React Native. At Rightfit.so, I work on the product and coordinate hiring with candidates and clients.</p>
        <div className="hero-actions">
          <span className="location"><FiMapPin aria-hidden="true" /> Bengaluru, India</span>
          <a href={import.meta.env.BASE_URL + 'Rithik-Verma-Resume.pdf'} download><FiDownload aria-hidden="true" /> Résumé (PDF)</a>
        </div>
      </section>
      <section id="work" className="wrap content-section work-section" aria-labelledby="work-title">
        <h2 id="work-title">Selected work</h2>
        <div className="project-list">
          {projects.map(project => (
            <article className="project" key={project.name}>
              <div>
                <p className="project-type">{project.type}</p>
                <h3>{project.name}</h3>
              </div>
              <div>
                <p className="project-description">{project.detail}</p>
                <p className="stack">{project.tools.join(' · ')}</p>
                <div className="project-links">
                  <a href={project.live} target="_blank" rel="noreferrer" aria-label={project.name + ' — ' + (project.liveLabel || 'Visit website')}>
                    {project.liveLabel || 'Visit website'} <FiArrowUpRight aria-hidden="true" />
                  </a>
                  {project.source && <a href={project.source} target="_blank" rel="noreferrer" aria-label={project.name + ' source on GitHub'}>Source code <FiGithub aria-hidden="true" /></a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="experience" className="wrap content-section"><h2>Experience</h2>
        <div className="job-list">{experience.map(job => (
          <article className="job" key={job.company + job.period}>
            <div className="job-date">{job.period}<small>{job.place}</small></div>
            <div><h3>{job.title}</h3><strong>{job.company}</strong>
              <ul>{job.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
        ))}</div>
        <article className="job">
          <div className="job-date">Jan 2024 – Mar 2024</div>
          <div><h3>Freelance Web Developer</h3><p>Built and deployed client websites and web applications, optimized their performance, and designed pages with search visibility in mind.</p></div>
        </article>
      </section>
      <section id="skills" className="skills-section content-section" aria-labelledby="skills-heading">
        <div id="about" className="wrap details-layout">
          <h2 id="skills-heading">Technical skills</h2>
          <dl className="skill-list">
            {skills.map(([name, list]) => <div key={name}><dt>{name}</dt><dd>{list}</dd></div>)}
          </dl>
        </div>
      </section>
      <section id="education" className="wrap content-section details-layout education" aria-labelledby="education-heading">
        <h2 id="education-heading">Education</h2>
        <div className="degree-list">
          <article><small>2022 – 2024</small><h3>Master of Computer Applications (MCA)</h3><p>School of Computer Science and IT (DAVV), Indore, Madhya Pradesh, India</p></article>
          <article><small>2019 – 2022</small><h3>Bachelor of Computer Applications (BCA)</h3><p>IPS Academy, Indore, Madhya Pradesh, India</p></article>
        </div>
      </section>
      <section id="contact" className="wrap content-section contact">
        <h2>Contact</h2>
        <ContactLinks>
          <a href="https://github.com/RithikVerma" target="_blank" rel="noreferrer"><FiGithub /> GitHub</a>
          <a href="https://linkedin.com/in/vermarithik" target="_blank" rel="noreferrer"><FiLinkedin /> LinkedIn</a>
          <a href="https://x.com/_rithik_verma_" target="_blank" rel="noreferrer">X <FiArrowUpRight /></a>
        </ContactLinks>
      </section>
  </>
}

export default App
