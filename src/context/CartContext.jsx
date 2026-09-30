import { createContext, useContext, useState,useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart')
    
    if (storedCart) {
      return JSON.parse(storedCart)
    }else{
        return []
    }
})    
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])
   function addToCart(item) {
    

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, qty: 1 }]
      }
    })
  }
  function removeFromCart(id) {
  setCart((prevCart) => prevCart.filter((item) => item.id !== id))
}

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  return (
    <CartContext.Provider value={{ cart, setCart, addToCart,total, removeFromCart}}>
      {children}
    </CartContext.Provider>
  )}
export function useCart() {
  return useContext(CartContext)
}