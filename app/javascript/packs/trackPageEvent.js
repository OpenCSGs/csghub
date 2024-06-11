import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

const trackPageEvent = async (params) => {
  const jwtToken = cookies.get('user_token')
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([
      {
        v: '1',
        ext: navigator.userAgent
          ? JSON.stringify({
              userAgent: navigator.userAgent
            })
          : '{}',
        ...params
      }
    ])
  }
  if (jwtToken) {
    options.headers = {
      Authorization: `Bearer ${jwtToken}`,
      ...options.headers
    }
  }
  try {
    const res = await fetch(`${CSGHUB_SERVER}/api/v1/events`, options)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    } else {
      const body = await res.json()
      console.log('PageEventTrackingSuccess:', body)
    }
  } catch (error) {
    console.error(
      'PageEventTrackingError:',
      `${params.m}-${params.id}-1`,
      error
    )
  }
}

export default trackPageEvent
