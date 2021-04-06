import React, {useState, useEffect} from "react";
import io from "socket.io-client";

import "./App.css";

const socket = io.connect("http://localhost:3000", {
  rejectUnauthorized: false
})

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

function App() {
  const [state, setState] = useState({msg: "", name: ""})
  const [chat, setChat] = useState([])


useEffect(() => {
  socket.on("msg", ({name, msg}) => {
    setChat([...chat, {name, msg}])
  })
})


const onTextChange = (e) => {
  setState({...state, [e.target.name]:e.target.value})
}


const clear = (e) => {
  setChat([])
}


const onMsgSubmit = (e) => {
  e.preventDefault()
  const {name, msg} = state
  socket.emit("msg", {name, msg})
  setState({msg:"", name:name})
}


const renderChat = () => {
  return chat.map(({name, msg}, index) => (
    <div key={index}>
    <h4>
    {name}: <span>{msg}</span>
    </h4>
    </div>
  ))
}


  return (
    <div className = "flex items-center justify-around pa4 mt3">

    <form className = "ba br4 pa2 " >

    <h2 className = "tc underline">Send a message</h2>

    <br/>

    <div className="flex items-center ma1">
    <label className="ma2">Name </label>
    <input id="name" type="text" name="name" className="center ba br2 pa2 w-70" onChange = {e => onTextChange(e)} value = {state.name} />
    </div>

    <br/>

    <div className="flex items-center ma1">
    <label className="ma2">Message </label>
    <input id="msg" type="text" className="center ba br2 pa2 w-70" name="msg" onChange = {e => onTextChange(e)} value = {state.msg} /> 
    </div>

    <div className="flex items-center ma1">
    <input type="submit" value="Send" className="bg-transparent grow dim pointer center mt3 pa1 ph4 br2" onClick = {onMsgSubmit} />
    </div>

    <div className="ma1">
    <button className="center" onClick={e => clear(e)}>delete</button>
    </div>

    </form>

    <div className="ba br4 shadow-3 w-50 ">
    <h1 className="tc">Chats</h1>
    {renderChat()}
    </div>

    </div>
  );
}

export default App;
