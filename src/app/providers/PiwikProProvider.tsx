'use client'

import PiwikProProvider from '@piwikpro/next-piwik-pro'

const PiwikProWrapper = ({ children }: { children: React.ReactNode }) => {
    return  (
    <PiwikProProvider
        containerId='b7af6b0b-8d30-437f-bb25-dc59d9e5820f'
        containerUrl='https://abartczak.piwik.pro'
    >{children}
    </PiwikProProvider>
)}

export default PiwikProWrapper