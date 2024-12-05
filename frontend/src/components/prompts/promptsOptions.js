// src/options.js
import { useI18n } from 'vue-i18n'

export const useLangOptions = () => {
  const { t } = useI18n()
  return [
    { id: 0, label: t('prompts.placeholderLang'), value: '' },
    { id: 1, label: t('languages.Chinese'), value: 'zh' },
    { id: 2, label: t('languages.English'), value: 'en' }
  ]
}

export const useTagOptions = () => {
  const { t } = useI18n()
  return [
    { id: 0, value: '', label: t('prompts.placeholderTag') },    
    { id: 1, value: 'Image', label: t('prompts.tag.Image') },
    { id: 2, value: 'Video', label: t('prompts.tag.Video') },
    { id: 3, value: 'Music', label: t('prompts.tag.Music') },
    { id: 4, value: 'Code', label: t('prompts.tag.Code') },
    { id: 5, value: 'DataAnalysis', label: t('prompts.tag.DataAnalysis') },
    { id: 6, value: 'Research', label: t('prompts.tag.Research') },
    { id: 7, value: 'Personalization', label: t('prompts.tag.Personalization') },
    { id: 8, value: 'CreativeWriting', label: t('prompts.tag.CreativeWriting') },
    { id: 9, value: 'TechnicalWriting', label: t('prompts.tag.TechnicalWriting') },
    { id: 10, value: 'Design', label: t('prompts.tag.Design') },
    { id: 11, value: 'Marketing', label: t('prompts.tag.Marketing') },
    { id: 12, value: 'Education', label: t('prompts.tag.Education') }
  ]
}