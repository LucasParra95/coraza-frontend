"use client"
          
import Layout from "../layouts/Main";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setUserLogged } from '../store/reducers/user';
import { useSelector } from "react-redux";
import { RootState } from 'store';
import ProductItem from "components/product-item";


const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
)

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

export default function Account() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const { favProducts } = useSelector((state: RootState) => state.user);
  const  allProducts  = useSelector((state: RootState) => state.products.products);

  const favsData = allProducts.filter((prod) => 
    favProducts.includes(prod.id)
  )

  const [activeTab, setActiveTab] = useState("personal")
  const [showAddressDialog, setShowAddressDialog] = useState(false); // Estado para manejar el cuadro de diálogo
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Argentina"
  });

  const tabs = [
    { id: "personal", label: "Personal", icon: UserIcon },
    { id: "favorites", label: "Favoritos", icon: HeartIcon },
    { id: "orders", label: "Compras", icon: ShoppingBagIcon },
    { id: "addresses", label: "Direcciones", icon: MapPinIcon },
  ]
  useEffect(() => {
    if (status === "loading") {
      // Mientras la sesión se está verificando, no hacer nada.
      return;
    }
    if (status === "unauthenticated") {
      router.replace("/login"); // Redirigir al inicio de sesión si no está autenticado
    }
    if (status === "authenticated") {     
      dispatch(setUserLogged(session.user));
    }  
  }, [status, session]);

  const handleAddAddress = async () => {

    try {
      // Realizar la solicitud PUT para actualizar las direcciones en la base de datos
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id, // ID del usuario para identificarlo en la base de datos
          addresses: [...session!.user.addresses!,newAddress], // Las direcciones actualizadas
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Actualizar la sesión localmente
        const updatedAddresses = [...(session?.user?.addresses || []), newAddress];
        session!.user.addresses = updatedAddresses; // Actualizar la sesión con la nueva dirección
        setShowAddressDialog(false); // Cerrar el cuadro de diálogo
        setNewAddress({ street: "", city: "", postalCode: "", country: "Argentina" }); // Reiniciar el formulario
      } else {
        console.error("Error actualizando la dirección:", data);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <Layout>
    <div className="account-page">
      <div className="buttons">
        <h1>Mi Cuenta</h1>
        <button onClick={() => signOut()}>Cerrar sesión</button>
      </div>

      <div className="tabs">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon />
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="tab-content">
        {activeTab === "personal" && (
          <div>
            <h2>Información Personal</h2>
            {/* <div className="avatar-section">
              {session?.user?.image &&
                <img src={session.user.image} alt="Sin imagen"  className="avatar"></img>
                <button>Cambiar Avatar</button>
              }
            </div> */}
            <form>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" placeholder="Tu nombre" defaultValue={session?.user?.name || ""}></input>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="tu@email.com" defaultValue={session?.user?.email || ""}></input>
              </div>
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <h2>Productos Favoritos</h2>
            <p>Aquí puedes ver y gestionar tus productos favoritos.</p>
            <ul className="favorites-list">
              {/* {favsData.map((prod) =>{
                return (
                  <li><ProductItem/></ProductItem></li>
                )
              })} */}

{favsData &&
        <section className="products-list">
          {favsData.map((item)  => {
            console.log(item);
            
            return(
            <ProductItem 
              id={item!.id} 
              name={item!.name}
              price={item!.price}
              color={item!.color}
              currentPrice={item!.currentPrice}
              key={item!.id}
              images={item!.images} 
            />
          )})}
        </section>
      }

            </ul>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2>Historial de Compras</h2>
            <p>Revisa tus compras anteriores y su estado.</p>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Orden #</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>01/05/2023</td>
                  <td>$100.00</td>
                  <td>Entregado</td>
                </tr>
                <tr>
                  <td>002</td>
                  <td>15/05/2023</td>
                  <td>$75.50</td>
                  <td>En proceso</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "addresses" && (
          <div>
            <h2>Direcciones de Envío</h2>
            <p>Gestiona tus direcciones de envío.</p>
              
            {session?.user?.addresses && session.user.addresses.length > 0 ? (
              <ul className="address-list">
                {session.user.addresses.map((address, index) => (
                  <li key={index}>
                    <strong>Dirección {index+1}:</strong> {address.street}, {address.city}, {address.country}
                    <button className="edit-button">Editar</button>
                  </li>
                ))}
              </ul>
            ):(
              <p>No tiene direcciones guardadas</p>
            )}

            {!showAddressDialog && (<button className="add-address" onClick={() => setShowAddressDialog(true)}>Agregar Nueva Dirección</button>)}

            {showAddressDialog && (
                <div className="dialog">
                  <h3>Agregar Dirección</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddAddress();
                    }}
                  >
                    <div className="form-group">
                      <label>Calle</label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Codigo Postal</label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      />
                    </div>
                    <button type="submit">Guardar Dirección</button>
                    <button type="button" onClick={() => setShowAddressDialog(false)}>Cancelar</button>
                  </form>
                </div>
              )}

          </div>
        )}
      </div>
    </div>
    </Layout>
  )
}
