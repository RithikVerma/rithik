import { FiMail, FiPhone } from 'react-icons/fi'

const email = 'rithikverma.work@gmail.com'

export default function ContactLinks({ children }) {
  return (
    <div className="social">
      <a href={'mailto:' + email} aria-label={'Email Rithik at ' + email} title={email}>
        <FiMail aria-hidden="true" /> Email
      </a>
      <a href="tel:+918770384600" aria-label="Phone Rithik at +91 87703 84600" title="+91 87703 84600">
        <FiPhone aria-hidden="true" /> Phone
      </a>
      {children}
    </div>
  )
}
