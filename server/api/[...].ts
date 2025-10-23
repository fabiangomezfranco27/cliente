import { proxyRequest, defineEventHandler } from 'h3'

const backendApiUrl = 'http://localhost:3000'

export default defineEventHandler(async (event) => {
  try {
    return await proxyRequest(event, `${backendApiUrl}${event.path.replace('/api', '')}`)
  } catch (error) {
    console.error('Error al hacer proxy de la petición:', error)
    return {
      error: 'Error de comunicación con el servidor API',
      statusCode: 503,
    }
  }
})
