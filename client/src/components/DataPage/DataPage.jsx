import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './DataPage.css'

function DataPage() {
  const [responseFileName, setResponseFileName] = useState('');
  const [responseText, setResponseText] = useState('');
  const [fileSize, setFileSize] = useState('')
  const [roomId, setRoomId] = useState('')
  const [accessCode, setAccessCode] = useState('')


  const location = useLocation();
  const pathname = location.pathname;
  const requestData = pathname.slice(1, pathname.length);

  useEffect(() => {
    axios.get(`http://localhost:3001/files/${requestData}`)
      .then(response => {
        setResponseFileName(response.data.fileName);
        setResponseText(response.data.text)
        setFileSize(response.data.fileSize)
        setRoomId(response.data.roomId)
        setAccessCode(response.data.accessCode)

      })
      .catch(error => {
        console.error('Ошибка при загрузке файла:', error);
      });
  }, [requestData]);

  const handleDownload = () => {
    axios.get(`http://localhost:3001/download/${requestData}`, { responseType: 'blob' })
      .then(response => {
        const fileBlob = new Blob([response.data]);
  
        // Имя файла для скачивания
        const filename = responseFileName ? responseFileName : 'file.txt';
  
        // Кодируем имя файла в URL-совместимую кодировку
        const encodedFilename = encodeURIComponent(filename);
  
        // Создаем ссылку на файловый объект и "кликаем" по ней
        const url = window.URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', encodedFilename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Освобождаем ресурсы после скачивания
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Ошибка при загрузке файла:', error);
      });
  };
  

  return (
    <div className='fullPage'>
      <div>
        <div className='header'>Tempory Data</div>
        <div className='authData'>
          <div>Room name: {roomId}</div>
          {accessCode &&
          <div>Password: {accessCode}
            <button className='view_button'>o</button>
          </div>
          }
        </div>
        {responseText &&
        <div className='text'>
          <button className='copy_button'>Copy</button>
          <div>{responseText}</div>
        </div>}
        {responseFileName &&
        <>
        <div className='file'>
          <div className='folder'>
          </div>
          <div>
            <div className='fileName'>{responseFileName}</div>
            <div className='fileSize'>{fileSize}</div>
          </div>
        </div>
        <br/>
        <button className='download_button' onClick={handleDownload}>Download</button>
        </>}
        <div>
        </div>
      </div>
    </div>
  );
}

export default DataPage;
