import { createFetch } from '@vueuse/core'

const useFetchApi = createFetch({
  updateDataOnError: true,
  baseUrl: `${CSGHUB_SERVER}/api/v1`,
  combination: 'chain',
  options: {
    onFetchError({ data, error, response }) {
      console.log('Fetch Error:', data || error)
      return { error: data || error }
    }
  }
})

export default useFetchApi
