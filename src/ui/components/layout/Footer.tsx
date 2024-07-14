import { useTranslation } from 'next-i18next'

export default function Footer() {
  const { t } = useTranslation('footer')

  return (
    <div className='flex h-[10vh] bg-blue-500'>
      <div className='text-3xl font-light flex w-[100%] items-center justify-center p-5 text-white'>
        @ Main App {new Date().getFullYear()}
        <p>{t('description')}</p>
      </div>
    </div>
  );
}
