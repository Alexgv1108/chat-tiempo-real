export const constantes = () => {
const CANTIDAD_MENSAJES = 20;
const STATES_SESSION = {
  LOGOUT: 'LOGOUT',
  PENDING: 'PENDING',
  LOGIN: 'LOGIN'
}
const DICCIONARIO_EMOJIS = {
  ':)': '🙂',
  'c:': '🙂',
  'C:': '🙂',
  ':D': '😁',
  ":'D": '😂',
  ':"D': '😂',
  ":''D": '🤣',
  ':(': '😕',
  ':c': '😕',
  ':C': '😕',
  ':o': '😮',
  ':0': '😮',
  ':O': '😮',
  ":'(": '😢',
  ":''(": '😢',
  ':"(': '😢',
}
  return {
    CANTIDAD_MENSAJES,
    DICCIONARIO_EMOJIS,
    STATES_SESSION
  }
}
