import React from 'react';

function HeaderComponent() {
   return (
      <header id="header">
         <div className="row1">
            <div className="row1-1">
               <a href="<?=$path3?>member_gaib/" title="회원가입">회원가입</a>
               <i>|</i>
               <a href="<?=$path3?>member_login/" title="로그인">로그인</a>            
               <i>|</i>
               <a href="<?=$path3?>member_center/" title="고객센터">고객센터</a>
            </div>
            <div className="row1-1 login">
               <a href="!#" title="일반" className="login-member login-sub-down-btn">일반</a>
               <a href="!#" title="회원" className='header-login-btn  login-sub-down-btn'>이순신님<img src="./img/ico_down_16x10.png" alt=""/></a>
               <div className="login-sub">
                  <ul>
                     <li><a href="!#">주문 내역</a></li>
                     <li><a href="!#">선물 내역</a></li>
                     <li><a href="!#">찜한 상품</a></li>
                     <li><a href="!#">배송지 관리</a></li>
                     <li><a href="!#">상품 후기</a></li>
                     <li><a href="!#">상품 문의</a></li>
                     <li><a href="!#">적립금</a></li>
                     <li><a href="!#">쿠폰</a></li>
                     <li><a href="<?=$path3?>member_info/">개인 정보 수정</a></li>
                     <li><a href="!#">나의 컬리 스타일</a></li>
                     <li><a href="!#" className='logout-btn'>로그아웃</a></li>
                  </ul>
               </div>
               <i>|</i>
               <a href="<?=$path3?>member_center/" title="고객센터">고객센터<img src="./img/ico_down_16x10.png" alt=""/></a>
            </div>
            <div className="row1-2">
               <div className="left">
               
                  {/* <!-- 홈(루트)으로  --> */}
                  <a href="./" title="마켓컬리 홈" className="logo1">
                     <img src="./img/logo_kurly.svg" alt=""/>
                     <span>마켓컬리</span>
                  </a> 
                  <i>|</i>
                  <a href="!#" title="뷰티컬리" className="logo2">
                     뷰티컬리
                     <img src="./img/n.svg" alt=""/>
                  </a>
               
               </div>
               <div className="center">
                  <input type="text" id="search" name="search" placeholder="검색어를 입력해주세요" />
                  <a href="!#" title="search" className="search-btn"><img src="./img/search.svg" alt=""/></a>
               </div>
               <div className="right">
                  <a href="!#" className="icon-btn" title="map"><img src="./img/map.svg" alt=""/></a>
                  <a href="!#" className="icon-btn" title="heart"><img src="./img/heart.svg" alt=""/></a>
                  <a href="!#" className="icon-btn" title="cart"><img src="./img/cart.svg" alt=""/></a>
               </div>
            </div>
         </div>
         <div className="row2">
            <div className="row2-container">
               <div className="left">
                  <a href="!#" className="ham-btn">
                     <img src="./img/ham_var.svg" alt=""/>
                     카테고리
                  </a>
               </div>    
               
               {/* <!-- 네비게이션 - 메인메뉴 -->
               <!-- 1. 루트에서의 링크 주소 ./sub_page/ -->
               <!-- 2. 서브에서 형제요소 링크 주소 ../ --> */}
               <div className="center">
                  <a href="<?=$path2?>main1/" className='main-btn'>신상품</a>
                  <a href="<?=$path2?>main2/" className='main-btn'>베스트</a>
                  <a href="<?=$path2?>main3/" className='main-btn'>알뜰쇼핑</a>
                  <a href="<?=$path2?>main4/" className='main-btn'>특가/혜택</a>
               </div>         
               <div className="right">
                  <a href="!#" title="샛별·낮배송안내">
                     <em>샛별·낮</em>
                     <span>배송안내</span>
                  </a>
               </div> 
            </div>        
         </div>
      </header>
   );
};

export default HeaderComponent;