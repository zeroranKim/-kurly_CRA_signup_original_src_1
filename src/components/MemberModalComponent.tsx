import React from 'react';

function MemberModalComponent({title, closeModal}: any) {

   const onClickModalClose=()=>{  
      // if(title.indexOf('인증번호')!==-1){ //찾았다면
      if(title.indexOf('인증번호')>=0){ //찾았다면
         closeModal(true); // 모달창 닫기 함수 호출 타이머 동작함
      }  
      else{
         closeModal(false); // 모달창 닫기 함수 호출 타이머 동작 안함
      } 
      
   }

   return (
         <div className="member-modal">
            <div className="wrap">
               <div className="container">
                     <div className="content">
                        <p className='modal-message' style={{fontSize: '17px'}}>{title}</p>
                     </div>
                     <div className="button-box">
                        <button onClick={onClickModalClose} className='member-modal-close-btn'>확인</button>
                     </div>
               </div> 
            </div>    
         </div>
   );
};

export default MemberModalComponent;