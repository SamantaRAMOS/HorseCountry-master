import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react' // Importar useState para el carrito
import './App.css'
import Home from './pages/Home'
import NavBar from './componentes/NavBar'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import AltaCaballo from './pages/AltaCaballo'
// Importa tus nuevos componentes (asegúrate de haber creado los archivos en /pages)
import DetalleCaballo from './pages/DetalleCaballo'
import Carrito from './pages/Carrito'
import Ticket from './pages/Ticket'
import About from './pages/About'
import Footer from './componentes/Footer'
import ScrollToTop from './componentes/ScrollToTop'

function App() {

  const [cart, setCart] = useState([]); 
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  useEffect(() => {
    const updateRole = () => {
      setUserRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("userRoleChanged", updateRole);
    return () => window.removeEventListener("userRoleChanged", updateRole);
  }, []);

  // 1. Estado para almacenar los caballos en el carrito
  const eliminarDelCarrito = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };


  // 2. Estado para almacenar la información de la última compra realizada
  const [ultimaCompra, setUltimaCompra] = useState(null);

  // 3. Función para agregar un caballo al carrito
  /*const agregarAlCarrito = (horse) => {
    setCart((prevCart) => {
      const existe = prevCart.some(item => item.id === horse.id);
      if (existe) {
        alert("Este ejemplar ya está en tu selección.");
        return prevCart;
      }
      return [...prevCart, horse];
    });
  };*/
  const agregarAlCarrito = (horse) => {
    setCart((prev) => [...prev, horse]);
    console.log("Contenido del carrito:", cart); // Mira si aumenta en la consola
  };

  // 4. Función para procesar la compra (se usa en el componente Carrito)
 const finalizarCompra = async (navegarA) => {
    if (cart.length === 0) return;

    try {
      // 1. Por cada caballo en el carrito, actualizamos su estado en el servidor
      // Usamos el puerto 5233 que es el que te está funcionando
      const promesasDeActualizacion = cart.map(horse =>
        fetch(`http://localhost:5233/api/horses/${horse.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            Price: horse.price || horse.Price,
            statusId: 3
          })
        })
      );

      // Esperamos a que todas las peticiones terminen correctamente
      const respuestas = await Promise.all(promesasDeActualizacion);

      // Verificamos si alguna petición falló
      if (respuestas.some(res => !res.ok)) {
        throw new Error("Error al actualizar algunos estados");
      }

      // 2. Preparamos los datos para el componente Ticket
      const total = cart.reduce((acc, item) => acc + item.price, 0);
      setUltimaCompra({
        items: cart,
        total: total,
        fecha: new Date().toLocaleDateString(),
        nroTransaccion: Math.floor(Math.random() * 1000000)
      });

      // 3. Limpiamos el carrito local y navegamos al ticket
      setCart([]);
      navegarA('/ticket');

    } catch (error) {
      console.error("Fallo en la reserva:", error);
      alert("No se pudo completar la reserva. Intenta nuevamente.");
    }
  }
  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar carritoCount={cart.length} userRole={userRole} />
        <ScrollToTop />
        <main>
          <Routes className="pt-20">
            <Route path="/" element={<Home userRole={userRole} />} />

            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route
              path="/alta"
              element={
                userRole === "Vendedor"
                  ? <AltaCaballo />
                  : <Navigate to="/login" />
              }
            />

            <Route path="/about" element={<About />} />

            {/* Rutas con las funciones y estados pasados por props */}
            <Route
              path="/caballo/:id"
              element={<DetalleCaballo
                agregarAlCarrito={agregarAlCarrito}
                cart={cart}
                userRole={userRole}
                
              />}
            />
            <Route
              path="/carrito"
              element={<Carrito 
                items={cart}
                finalizarCompra={finalizarCompra}
                eliminarDelCarrito={eliminarDelCarrito}
                userRole={userRole}

              />}
            />
            <Route
              path="/ticket"
              element={<Ticket compraData={ultimaCompra} />}
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App