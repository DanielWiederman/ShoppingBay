import React from 'react'
import { Icon, Button } from 'antd'
import { withRouter } from 'react-router-dom'        
const cartEmpty=(props)=> {

   function redirectHome(){
        const {history} = props
        history.push('/')
    }

    return (
        <div class="mt-5 mb-5">
           <span className="font-weight-bold">Oh uh, Your cart is empty!</span>
           <div style={{fontSize: "40px"}}><Icon type="frown" /></div>
           <div className="mt-3 mb-3"><Button type="link" onClick={()=>{redirectHome()}}>Lets go home</Button></div>
        </div>
    )
}

export default withRouter(cartEmpty)
