import { createFetch } from '@vueuse/core'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

const useFetchApi = createFetch({
  baseUrl: `${CSGHUB_SERVER}/api/v1`,
  combination: 'chain',
  options: {
    async beforeFetch({ options }) {
      const jwtToken = await cookies.get('user_token')

      if (jwtToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${jwtToken}`
        }
      }

      return { options }
    },
    onFetchError({ data, error }) {
      console.log('Fetch Error:', data || error)
      return { error: data || error }
    }
  }
})

export default useFetchApi
