"use client"

import { useState } from 'react';
import TransferList from '@/components/TransferList'
import UploadFile from '@/components/UploadFile';
import { parse } from 'node-html-parser';
import { v4 as uuidv4 } from 'uuid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Divider } from '@mui/material';

const parseHTMLToJSON = (html: string) => {
  const doc = parse(html);
  const rows = doc.querySelectorAll('.mod-list tr[data-type="ModContainer"]');

  return Array.from(rows).map(row => {

    let source = 'Local'
    let link = '';
    let addonId = row.querySelector('[data-type="DisplayName"]')!.textContent!.trim();

    if (row.querySelector('.from-steam')) {
      source = row.querySelector('.from-steam')!.textContent!.trim();
      link = row.querySelector('[data-type="Link"]')!.getAttribute('href')!.trim()
      addonId = new URL(link).searchParams.get("id")!
    }

    const addonObject = {
      id: uuidv4(),
      isDuplicate: false,
      displayName: row.querySelector('[data-type="DisplayName"]')!.textContent!.trim(),
      addonId: addonId,
      source: source,
      link: link === '' ? undefined : link
    }

    return addonObject
  });
};

export default function Home() {

  const [primaryHtmlContent, setPrimaryHtmlContent] = useState('');
  const [secondaryHtmlContent, setSecondaryHtmlContent] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-3">
      <div>
        <h1 className='text-4xl'>Arma 3 HTML preset merger</h1>
      </div>
      <div className='flex flex-col p-5 space-y-3 justify-center bg-slate-900 upload-card'>
        <div className='flex flex-col'>
          <div className="flex flex-row content-center mb-2">
            <InfoOutlinedIcon className="mr-2"/>
            <p className="block text-gray-200 text-sm font-thin">Upload your main preset</p>
          </div>
          <UploadFile onFileUpload={setPrimaryHtmlContent}/>
        </div>
        <Divider className='!bg-neutral-600'/>
        <div className='flex flex-col'>
          <div className='flex flex-row content-center mb-2'>
            <InfoOutlinedIcon className="mr-2"/>
            <p className="block text-gray-200 text-sm font-thin">Upload your additional preset</p>
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
