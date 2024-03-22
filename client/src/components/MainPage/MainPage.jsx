import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css'

function MainPage() {
  const navigate = useNavigate();
  const [data, setData] = useState('');
  const [file, setFile] = useState(null);
  const [roomId, setRoomId] = useState(''); 
  const [accessCode, setAccessCode] = useState(''); 
  const [response, setResponse] = useState('');
  const [findRoom, setFindRoom] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [fileName, setFileName] = useState('');
  const [passwordConnect, setPasswordConnect] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if(!(data.trim()) && !file){
        setResponse("Add file or text")
        return
      }

      if(!(roomId.trim())){
        setResponse("Add room name")
        return
      }

      const formData = new FormData();
      formData.append('type', 'file');
      formData.append('text', data);
      formData.append('file', file);
      formData.append('roomId', roomId);
      formData.append('accessCode', accessCode);

      const response = await axios.post('http://localhost:3001/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/${response.data.id}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Server offline");
      }
    }
  };

  const handleFindRoom = async () => {
    try {
      const response = await axios.post('http://localhost:3001/getRoom', 
      { 
        roomId: findRoom,
        accessCode: roomPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        navigate(`/${response.data.id}`);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Server offline");
      }
    }
  };

  
  return (
    <div>
      <div className='response' style={{ display: response ? 'block' : 'none' }}>
        {response}
      </div>
      <div className='header'>Tempory Data</div>
      <div className='main'>
      <div className='createRoom'>
      <div className='block_headers'>Send File</div>
      <form onSubmit={handleSubmit}>
      <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room name"
        />
        <br/>
        <input
          id="enter_text"
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter text"
        />
        <br/>
        <input
          type="file"
          id="fileInput"
          onChange={(e) => {
            setFile(e.target.files[0])
            setFileName(e.target.files[0].name)
          }}
          style={{ display: 'none' }}
        />
        <label htmlFor="fileInput" className="fileInputLabel">
          Choose File
        </label>
        <span className='filename'>
          {fileName.length > 30 ?
          fileName.substring(0,30) + '...'
          :
          fileName
          }
          </span>
        <br/>
        {passwordEnabled ?
        <>
        <br/>
        <input
        id="pass_input"
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Enter password"
        />
        </>
        :
        <>
        <br/>
        <div className='protect_text'>
          Want protect your data? Сlick here! &gt;&gt;
        </div>
        </>
      }
        <br/>
        <input
          type="checkbox"
          id="switch"
          value={passwordEnabled}
          onChange={(e) => setPasswordEnabled(prevState => !prevState)}
        />
        <label htmlFor="switch" className='toggle'>Toggle</label>
        <br/>
        <button type="submit" className='send_button'>Send</button>
      </form>
      </div>
      <div className='connectRoom'>
        <div className='block_headers'>Get File</div>
      <input
          type="text"
          value={findRoom}
          onChange={(e) => setFindRoom(e.target.value)}
          placeholder="Enter room name"
        />
        <br/>
      {passwordConnect ?
        <>
        <br/>
        <input
          id="pass_input_connect"
          type="text"
          value={roomPassword}
          onChange={(e) => setRoomPassword(e.target.value)}
          placeholder="Enter password"
        />  
        </>
        :
        <>
        <br/>
        <div className='protect_text connect_text'>
          Connect with password &gt;&gt;
        </div>
        </>
      }
        <br/>
        <input
          type="checkbox"
          id="switch_connect"
          value={passwordConnect}
          onChange={(e) => setPasswordConnect(prevState => !prevState)}
        />
        <label htmlFor="switch_connect" id="toggle2" className='toggle'>Toggle</label>
        <br/>
        <button onClick={handleFindRoom}>Connect</button>
      </div>
      </div>

      <div className='guide_text'>
      Our service will help you temporarily store your data for access from other devices or transfer it to someone without any authorization. 
      You can access the data by the link or the name of the room. 
      You can also protect your data using password protection. <strong>All data is stored for 7 DAYS!</strong>
      </div>
    </div>
  );
}

export default MainPage;
