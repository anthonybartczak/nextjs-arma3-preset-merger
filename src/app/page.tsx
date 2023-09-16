"use client"

import { useState } from 'react';
import TransferList from '@/components/TransferList'
import UploadFile from '@/components/UploadFile';
import { parse } from 'node-html-parser';
import { v4 as uuidv4 } from 'uuid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const parseHTMLToJSON = (html: string) => {
  const doc = parse(html);
  const rows = doc.querySelectorAll('.mod-list tr[data-type="ModContainer"]');

  return Array.from(rows).map(row => {
    return {
      id: uuidv4(),
      displayName: row.querySelector('[data-type="DisplayName"]')!.textContent!.trim(),
      addonId: row.querySelector('[data-type="Link"]')!.textContent!.trim().split("https://steamcommunity.com/sharedfiles/filedetails/?id=")[1],
      source: row.querySelector('.from-steam')!.textContent!.trim(),
      link: row.querySelector('[data-type="Link"]')!.getAttribute('href')!.trim()
    };
  });
};

export default function Home() {

  const [primaryHtmlContent, setPrimaryHtmlContent] = useState('');
  const [secondaryHtmlContent, setSecondaryHtmlContent] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-12">
      <div>
        <h1 className='text-4xl'>Arma 3 HTML preset merger</h1>
      </div>
      <div className='flex space-x-24'>
        <div>
          <div className="flex flex-row content-center mb-2">
            <InfoOutlinedIcon className="mr-2"/>
            <p className="block text-gray-200 text-sm font-thin">Upload your primary preset</p>
          </div>
          <UploadFile onFileUpload={setPrimaryHtmlContent}/>
        </div>
        <div>
          <div className='flex flex-row content-center mb-2'>
            <InfoOutlinedIcon className="mr-2"/>
            <p className="block text-gray-200 text-sm font-thin">Upload your secondary preset</p>
          </div>
          <UploadFile onFileUpload={setSecondaryHtmlContent}/>
        </div>
      </div>
      <TransferList
        primaryContent={parseHTMLToJSON(primaryHtmlContent)}
        secondaryContent={parseHTMLToJSON(secondaryHtmlContent)}
      />
    </main>
  )
}
