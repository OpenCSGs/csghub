import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PartnerCard from '../PartnerCard.vue'

describe('WeatherBanner.vue Implementation Test', () => {
  let wrapper = null

  it('initializes with correct elements', () => {
    wrapper = shallowMount(PartnerCard, {
      propsData: {
        name: 'test',
        site: 'test_link',
        tags: 'name,age,weight',
        desc: 'some desc',
        logo: '/images/cover.png'
      }
    })

    expect(wrapper.vm.theTags).toEqual(expect.arrayContaining(['name', 'age', 'weight']))
    const tags = wrapper.findAll('span')
    expect(tags.length).toEqual(3)
    expect(tags[0].text()).toMatch('name')
    expect(tags[1].text()).toMatch('age')
    expect(tags[2].text()).toMatch('weight')
    const partnerNameLink = wrapper.find('[href="test_link"]')
    expect(partnerNameLink.text()).toMatch('test')
    expect(partnerNameLink.attributes().target).toMatch('_blank')
  })
})