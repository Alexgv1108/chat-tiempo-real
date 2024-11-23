import './loader.css'

export const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ 
        height: "100vh",
        zIndex: '9999'
      }}>
      <div>
        <div className="spinner"></div>
        <p className="text-secondary">Cargando...</p>
      </div>
    </div >
  )
}