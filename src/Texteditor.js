
import Quill from "quill"
import 'quill/dist/quill.snow.css'
import {  useCallback, useEffect, useState } from "react"
import './App.css'
import io from 'socket.io-client'
import {useParams} from 'react-router-dom'
export const Texteditor=()=>{
    const {id}=useParams()
    const [socket,setSocket]=useState()
    const [quill,setQuill]=useState()

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
      ];

      useEffect(()=>{
        const s=  io('http://localhost:6789/')
        setSocket(s)
  
        return ()=>{
            s.disconnect()
        }
      },[])

      useEffect(()=>{

        if(socket==null || quill==null) return

        socket.once('load-document',document=>{
            console.log(typeof document);
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-document',id)
       // console.log(id);

      },[socket,quill,id])

      useEffect(()=>{
        if(socket==null ||quill==null) return

        const interval=setInterval(()=>{

            socket.emit('save-document',quill.getContents())
        },1000)

        return ()=>{
            clearInterval(interval)
        }
      },[socket,quill])

      useEffect(()=>{
        if(socket==null ||quill==null) return

       const handeler= (delta)=> {
           quill.updateContents(delta)
          }
          socket.on('receive-changes',handeler)

          return ()=>{
              socket.off('receive-changes',handeler)
          }
      },[socket,quill])

      useEffect(()=>{
        if(socket==null ||quill==null) return

       const handeler= (delta, oldDelta, source)=> {
            if (source !== 'user') return
            socket.emit('send-changes',delta)  
          }
          quill.on('text-change',handeler)

          return ()=>{
              quill.off('text-change',handeler)
          }
      },[socket,quill])


  const wrapperRef= useCallback((wrapper)=>{

      if(wrapper==null) return
     wrapper.innerHTML=''             // cleanupc
     const editor=document.createElement('div')
     wrapper.append(editor)
  const q=  new Quill(editor,{theme:'snow', modules: {
        toolbar: toolbarOptions
      },})
      q.disable()
      q.setText('Loading')
setQuill(q)
   },[])

    return <div className="container"  ref={wrapperRef}></div>
        
}