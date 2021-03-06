
const SVG = ({svg, classprop}) => {

  const selectSVG = (svg) => {
    switch(svg){
      case 'account-circle':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Checkmark</title>
          <path d="M12 19.219q1.594 0 3.352-0.938t2.648-2.297q-0.047-1.313-2.109-2.203t-3.891-0.891-3.891 0.867-2.109 2.227q0.891 1.359 2.648 2.297t3.352 0.938zM12 5.016q-1.219 0-2.109 0.891t-0.891 2.109 0.891 2.109 2.109 0.891 2.109-0.891 0.891-2.109-0.891-2.109-2.109-0.891zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>
        </svg>  
        break;
      case 'profile-card':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 28">
          <title>Card</title>
          <path d="M16 17.672c0 1.359-0.891 2.328-2 2.328h-8c-1.109 0-2-0.969-2-2.328 0-2.422 0.594-5.109 3.062-5.109 0.766 0.438 1.797 1.188 2.938 1.188s2.172-0.75 2.938-1.188c2.469 0 3.062 2.688 3.062 5.109zM13.547 9.547c0 1.969-1.594 3.547-3.547 3.547s-3.547-1.578-3.547-3.547c0-1.953 1.594-3.547 3.547-3.547s3.547 1.594 3.547 3.547zM28 16.5v1c0 0.281-0.219 0.5-0.5 0.5h-9c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h9c0.281 0 0.5 0.219 0.5 0.5zM28 12.563v0.875c0 0.313-0.25 0.562-0.562 0.562h-8.875c-0.313 0-0.562-0.25-0.562-0.562v-0.875c0-0.313 0.25-0.562 0.562-0.562h8.875c0.313 0 0.562 0.25 0.562 0.562zM28 8.5v1c0 0.281-0.219 0.5-0.5 0.5h-9c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h9c0.281 0 0.5 0.219 0.5 0.5zM30 23.5v-19c0-0.266-0.234-0.5-0.5-0.5h-27c-0.266 0-0.5 0.234-0.5 0.5v19c0 0.266 0.234 0.5 0.5 0.5h5.5v-1.5c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5v1.5h12v-1.5c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5v1.5h5.5c0.266 0 0.5-0.234 0.5-0.5zM32 4.5v19c0 1.375-1.125 2.5-2.5 2.5h-27c-1.375 0-2.5-1.125-2.5-2.5v-19c0-1.375 1.125-2.5 2.5-2.5h27c1.375 0 2.5 1.125 2.5 2.5z"></path>
        </svg>  
        break;
      
      case 'plus':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Plus</title>
          <path d="M18 10h-4v-4c0-1.104-0.896-2-2-2s-2 0.896-2 2l0.071 4h-4.071c-1.104 0-2 0.896-2 2s0.896 2 2 2l4.071-0.071-0.071 4.071c0 1.104 0.896 2 2 2s2-0.896 2-2v-4.071l4 0.071c1.104 0 2-0.896 2-2s-0.896-2-2-2z"></path>
        </svg>  
        break;
      
      case 'dropdown-arrow':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Dropdown Arrow</title>
          <path d="M6.984 9.984h10.031l-5.016 5.016z"></path>
        </svg>  
        break;

      case 'checkmark':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Checkmark</title>
          <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
        </svg>  
        break;

      case 'file-image':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Checkmark</title>
          <path d="M22.937 5.938c0.578 0.578 1.062 1.734 1.062 2.562v18c0 0.828-0.672 1.5-1.5 1.5h-21c-0.828 0-1.5-0.672-1.5-1.5v-25c0-0.828 0.672-1.5 1.5-1.5h14c0.828 0 1.984 0.484 2.562 1.062zM16 2.125v5.875h5.875c-0.094-0.266-0.234-0.531-0.344-0.641l-4.891-4.891c-0.109-0.109-0.375-0.25-0.641-0.344zM22 26v-16h-6.5c-0.828 0-1.5-0.672-1.5-1.5v-6.5h-12v24h20zM20 19v5h-16v-3l3-3 2 2 6-6zM7 16c-1.656 0-3-1.344-3-3s1.344-3 3-3 3 1.344 3 3-1.344 3-3 3z"></path>
        </svg>  
        break;

      case 'message':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Message</title>
          <path d="M18 8.016v-2.016h-12v2.016h12zM18 11.016v-2.016h-12v2.016h12zM18 14.016v-2.016h-12v2.016h12zM20.016 2.016q0.797 0 1.383 0.586t0.586 1.383v12q0 0.797-0.586 1.406t-1.383 0.609h-14.016l-3.984 3.984v-18q0-0.797 0.586-1.383t1.383-0.586h16.031z"></path>
        </svg>  
        break;

      case 'close':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Close</title>
          <path d="M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z"></path>
        </svg>  
        break;

      case 'inbox':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Close</title>
          <path d="M18 8.016v-2.016h-12v2.016h12zM18 11.016v-2.016h-12v2.016h12zM18 14.016v-2.016h-12v2.016h12zM20.016 2.016q0.797 0 1.383 0.586t0.586 1.383v12q0 0.797-0.586 1.406t-1.383 0.609h-14.016l-3.984 3.984v-18q0-0.797 0.586-1.383t1.383-0.586h16.031z"></path>
        </svg>  
        break;

      case 'send-message':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Close</title>
          <path d="M0 0l20 10-20 10v-20zM0 8v4l10-2-10-2z"></path>
        </svg>  
        break;

      default:
        break
    }
  }
  
  return (
    <>
      {selectSVG(svg)}
    </>
  )
}

export default SVG
