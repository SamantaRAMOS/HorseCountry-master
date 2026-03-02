import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BarraBusqueda from "./BarraBusqueda";

import img1 from '../assets/caballos/caballo1.jpg';
import img2 from '../assets/caballos/caballo2.jpg';
import img3 from '../assets/caballos/caballo3.jpg';
import img4 from '../assets/caballos/caballo4.jpg';
import img5 from '../assets/caballos/caballo5.jpg';
import img6 from '../assets/caballos/caballo6.jpg';
import img7 from '../assets/caballos/caballo7.jpg';
import img8 from '../assets/caballos/caballo8.jpg';
import img9 from '../assets/caballos/caballo9.jpg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

const HorseGrid = ({ initialSearch = "" }) => {
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({ items: [], totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5233/api/horses?page=${currentPage}&pageSize=8`)
      .then((res) => res.json())
      .then((data) => {
        const listaOriginal = data.items || data; 
        const disponibles = listaOriginal.filter(h => (h.statusId || h.StatusId) === 1);

        const itemsWithImages = disponibles.map(horse => ({
          ...horse,
          randomImage: images[Math.floor(Math.random() * images.length)]
        }));

        setPaginationData({
          ...data,
          items: itemsWithImages
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al buscar caballos:", err);
        setLoading(false);
      });
  }, [currentPage]);
  

  if (loading) return <div className="text-center py-10">Cargando ejemplares...</div>;

  // FILTRO DE BÚSQUEDA
  const filteredItems = paginationData.items.filter(horse => {
  const q = searchQuery.toLowerCase();

  return (
    horse.name?.toLowerCase().includes(q) ||
    horse.breed?.description?.toLowerCase().includes(q) ||
    horse.color?.description?.toLowerCase().includes(q) ||
    horse.category?.toLowerCase().includes(q) ||
    horse.subcategory?.toLowerCase().includes(q) ||
    horse.descriprtion?.toLowerCase().includes(q) ||
    horse.status?.description?.toLowerCase().includes(q)
  );
});


  return (
  <div className="container mx-auto px-4 py-4">

    {/* Título */}
    <h2 className="text-4xl font-semibold text-primary mb-6 text-center drop-shadow-sm">
      Explora nuestros ejemplares de élite
    </h2>

    {/* Barra de búsqueda */}
    <BarraBusqueda onSearch={setSearchQuery} initialValue={initialSearch} />

    {/* Grid */}
    <div className="
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
      gap-8 mt-6
    ">
      {filteredItems.map((horse) => (
        <div
          key={horse.id}
          className="
            bg-white rounded-2xl overflow-hidden 
            border border-cream
            shadow-md hover:shadow-xl 
            transition-all duration-300
            hover:-translate-y-1
          "
        >
          {/* Imagen */}
          <div className="h-52">
            <img
              src={horse.randomImage}
              alt={horse.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Contenido */}
          <div className="p-5">

            {/* Nombre + Estado */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-primary">
                {horse.name}
              </h3>

              <span className="
                bg-green-100 text-green-700 
                text-xs font-bold px-3 py-1 
                rounded-full shadow-sm
              ">
                {horse.status?.description || "Disponible"}
              </span>
            </div>

            {/* Raza + Color */}
            <p className="text-sm text-[#6b5b4a] mb-3">
              {horse.breed?.description} • {horse.color?.description}
            </p>

            {/* Descripción */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {horse.descriprtion}
            </p>

            {/* Precio + Botón */}
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-2xl font-extrabold text-secondary">
                ${horse.price.toLocaleString()}
              </span>

              <Link to={`/caballo/${horse.id}`}>
                <button
                  className="
                    bg-primary text-cream 
                    px-4 py-2 rounded-lg font-medium 
                    hover:bg-secondary hover:text-primary
                    transition-colors shadow-sm
                  "
                >
                  Ver detalles
                </button>
              </Link>
            </div>

          </div>
        </div>
      ))}
    </div>

    {/* Paginación */}
    <div className="flex justify-center items-center space-x-4 mt-12">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => prev - 1)}
        className="
          px-6 py-2 bg-secondary text-cream rounded-lg 
          disabled:opacity-10 
          hover:bg-primary hover:text-secondary
          transition-colors font-bold
        "
      >
        Anterior
      </button>

      <span className="text-secondary font-bold">
        Página {currentPage} de {paginationData.totalPages}
      </span>

      <button
        disabled={currentPage === paginationData.totalPages}
        onClick={() => setCurrentPage(prev => prev + 1)}
        className="
          px-6 py-2 bg-secondary text-cream rounded-lg 
          disabled:opacity-10 
          hover:bg-primary hover:text-secondary
          transition-colors font-bold
        "
      >
        Siguiente
      </button>
    </div>

  </div>
);
};

export default HorseGrid;