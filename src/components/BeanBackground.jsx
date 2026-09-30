import { useEffect, useRef } from 'react'


let beanIdSeed = 0

function beanSVG(near) {
  const id = 'beanGrad' + beanIdSeed++
  const shineId = 'shine' + beanIdSeed
  const stops = near
    ? ['#FCE7BC', '#D9A85E', '#4A2C15']
    : ['#EFCE96', '#B98444', '#2E1A0C']
  return `<svg viewBox="0 0 200 260"><defs>
    <radialGradient id="${id}" cx="32%" cy="26%" r="85%">
      <stop offset="0%" stop-color="${stops[0]}"/><stop offset="40%" stop-color="${stops[1]}"/><stop offset="100%" stop-color="${stops[2]}"/>
    </radialGradient>
    <radialGradient id="${shineId}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF6E4" stop-opacity=".95"/><stop offset="100%" stop-color="#FFF6E4" stop-opacity="0"/>
    </radialGradient></defs>
    <path d="M100,8 C48,8 12,66 12,130 C12,194 48,252 100,252 C88,196 82,132 88,70 C91,42 95,20 100,8 Z" fill="url(#${id})"/>
    <path d="M100,8 C152,8 188,66 188,130 C188,194 152,252 100,252 C112,196 118,132 112,70 C109,42 105,20 100,8 Z" fill="url(#${id})" opacity=".82"/>
    <ellipse cx="62" cy="55" rx="20" ry="14" fill="url(#${shineId})"/>
    </svg>`
}

export function spawnBeans(container, count, farRatio)  {
  for (let i = 0; i < count; i++) {
    const isFar = Math.random() < farRatio
    const el = document.createElement('div')
    el.className = 'falling-bean' + (isFar ? ' far' : '')
    const size = isFar ? 10 + Math.random() * 12 : 18 + Math.random() * 26
    el.style.left = Math.random() * 100 + '%'
    el.style.width = size + 'px'
    el.style.height = size + 'px'
    const dur = isFar ? 14 + Math.random() * 12 : 7 + Math.random() * 8
    el.style.animationDuration = dur + 's'
    el.style.animationDelay = -Math.random() * dur + 's'
    el.innerHTML = beanSVG(!isFar)
    container.appendChild(el)
  }
}

export default function BeanBackground() {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && ref.current.childElementCount === 0) {
      spawnBeans(ref.current, 34, 0.45)
    }
  }, [])

  return <div id="bean-bg" ref={ref} />
}