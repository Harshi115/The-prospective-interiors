
export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="logo">
  <img
  src="/logo.png"
  alt="The Prospective Interiors"
/>
</a>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>

        <a href="/contact" className="consult-btn">
          Book Consultation
        </a>
      </div>
    </nav>
  )
}