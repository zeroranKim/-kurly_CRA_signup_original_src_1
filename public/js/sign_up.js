(($, window)=>{ //화살표 함수

   const SignUp = {
        회원 : {
         가입회원: [], // array
         아이디: '', // string
         아이디중복확인: false, // bool
         비밀번호:'', // string
         비밀번호확인: '', // string
         이름: '', // string
         이메일: '', // string
         이메일중복확인: false, // bool
         휴대폰: '', // string
         휴대폰인증확인: false, // bool
         휴대폰인증번호: '', // string
         setId: 0, // number
         주소1: '',  // string
         주소2: '',  // string
         성별: '',  // string
         생년: '',  // string
         생월: '',  // string
         생일: '',  // string
         추가입력사항1: '',   //속성  // string
         추가입력사항2: '',   //속성  // string
         이용약관:[],   //서비스 7개 선택 필수 3가지 배열 객체  // array
         가입완료: false  // bool
      },
      init(){
         this.dataBaseFn();  //데이터베이스 데이터 가져오기
         this.idFn();
         this.pwFn();
         this.nameFn();
         this.emailFn();
         this.hpFn();
         this.addrFn();
         this.genderFn();
         this.birthFn();
         this.addInput();
         this.serviceFn();
         this.submitFn();
      },
      dataBaseFn(){
         let that = this;

         // 데이터베이스 가져오기        
         // 1. 데이터베이스 서버에서 회원 데이터 가져오기 
         // 2. 아이디 중복 검사
         // moonjong.dothome.co.kr/kurly_1109/
         // moonjong.dothome.co.kr/myadmin/
         $.ajax({
            url:'./select.php',
            type:'GET',
            success: function(res){
               console.log( JSON.parse( res ) );
               that.회원.가입회원 = JSON.parse( res ); // 데이터베이스 데이터 저장
            },
            error: function(err){
               console.log( `AJAX 회원 정보가져오기 실패!  ${err}` );
            }
         });
      
      },
      idFn(){ //아이디
         // 1. 특사문자는 입력과 동시에 삭제 replace(정규식,'')
         // 2. 6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합 역슬래쉬 문자로 출력시 역슬래쉬 두번
         // 키보드 키가 눌러지고(keydown) 올라오면(keyup) 입력값 받아서 처리
         let regExp1 = '';
         let regExp2 = '';
         let regExp3 = '';
         let regExp4 = '';
         let idVal = '';
         let result = '';
         const that = this;
         

         $('#id').on({
            keyup: function(){
             
               regExp1 = /[`~!@#$%^&*()\-_=+|\\\]\}\[\{'";:/?.>,<]/g;  // 특수문자
               regExp2 = /.{6,16}/g;  // 글자수는 6 ~ 16
               regExp3 = /(?=.*[A-Za-z])+(?=.*[0-9])*/g;  // 영문(대소문자) 필수 포함, 숫자 선택 포함 : 영문(?=.*[A-Za-z])+ 또는(혹은) 숫자(?=.*[0-9])*  
               regExp4 = /\s/g;  // 공백문자
                    
               //1. 특수문자는 삭제
               idVal = $('#id').val();
               result = idVal.replace(regExp1, '');              
               $('#id').val( result );

               //2. 입력제한 조건문(2,3,4조건문)
               if(idVal===''){ // 공백이면
                  $('.id .guid-text').removeClass('on');
               }
               else { // 공백이 아니면
                  // 특수문자는 삭제
                  if( regExp2.test(idVal) === false  ||  regExp3.test(idVal) === false || regExp4.test(idVal) === true ){
                     $('.id .guid-text').addClass('on');
                  }
                  else{
                     $('.id .guid-text').removeClass('on');
                     that.회원.아이디 =  $(this).val();                  
                  }
               }



            }

         });



         // 아이디 중복확인 버튼 이벤트
         $('.id-ok-btn').on({
            click: function(){

               regExp1 = /[`~!@#$%^&*()\-_=+|\\\]\}\[\{'";:/?.>,<]/g;  // 특수문자
               regExp2 = /.{6,16}/g;  // 글자수는 6 ~ 16
               regExp3 = /(?=.*[A-Za-z])+(?=.*[0-9])*/g;  // 영문(대소문자) 필수 포함, 숫자 선택 포함 : 영문(?=.*[A-Za-z])+ 또는(혹은) 숫자(?=.*[0-9])*  
               regExp4 = /\s/g;  // 공백문자
                    
               //2. 입력제한 조건문(2,3,4조건문)
               if( $('#id').val()===''){ // 공백이면
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`아이디를 입력하세요.`);
               }
               else { // 공백이 아니면
                  // 특수문자는 삭제
                  if( regExp1.test($('#id').val()) === true || regExp2.test($('#id').val()) === false  ||  regExp3.test($('#id').val()) === false || regExp4.test($('#id').val()) === true ){
                     $('.member-modal').fadeIn(300);
                     $('.modal-message').html(`6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합`);
                  }
                  else{
                     $('.id .guid-text').removeClass('on');
                     that.회원.아이디 =  $('#id').val();

                     // 아이디 중복 체크 메서드 호출
                     that.idCheckOk();
                  }
               }




            }
         })

      },
      pwFn(){ //비밀번호

         const that = this;

         // | or
         // & and
         //1. 최소 10자이상 {10,}
         //2. 영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합 
         //   조합1: 영문,숫자,  조합2: 영문, 특수문자  조합3: 숫자, 특수문자
         //3. 글자 사이 공백 허용 안함.        
         //4. 동일한 글자 3개 이상 연속 사용 불가   134123aabbccc
         $('#pw').on({
            keyup: function(){
               const regExp1 = /.{10,}/g;

               const regExp2 = /((?=.*[A-Z])+(?=.*[0-9])+)+|((?=.*[A-Z])+(?=.*[`~!@#$%^&*()\-_=+|\\\]\}\[\{'";:/?.>,<])+)+|((?=.*[0-9])+(?=.*[`~!@#$%^&*()\-_=+|\\\]\}\[\{'";:/?.>,<])+)+/gi;
               const regExp3 = /\s/g;
               const regExp4 = /(.)\1\1/g;  //동일한 글자 연속3번 사용 불가

               let pwVal = $('#pw').val();
               if( pwVal==='' ){
                  $('.pw .guid-text').removeClass('on');
               }
               else{
                  
                  if( regExp1.test(pwVal)===false ){ //10자이상 체크
                     $('.pw .guid-text').removeClass('on');
                     $('.pw .guid-text1').addClass('on');
                  }
                  else if( regExp2.test(pwVal)===false || regExp3.test(pwVal)===true ){  // 조합, 공백문자 조건
                     $('.pw .guid-text').removeClass('on');
                     $('.pw .guid-text2').addClass('on');
                  }                                         
                  else if( regExp4.test(pwVal)===true ){  //연속3자이상조건
                     $('.pw .guid-text').removeClass('on');
                     $('.pw .guid-text3').addClass('on');
                  }
                  else {
                     $('.pw .guid-text').removeClass('on');
                     that.회원.비밀번호 =  $(this).val();
                  }
                 
               }
            }
         });


         // 비밀번호 확인 : 비밀번호 입력과 현재 비밀번호 확인 내용과 비교 
         // 1. 빈값이면 :  비밀번호를 한번 더 입력해 주세요 메시지 오류
         // 2. 두값을 동일여부 비교 : 동일한 비밀번호를 입력해 주세요.

         $('#pw2').on({
            keyup: function(){
               let pw2Val = $('#pw2').val();
               let pw1Val = $('#pw').val();

               if( pw2Val==='' ){ // 입력값이 공백이면
                  $('.pw2 .guid-text').removeClass('on');
                  $('.pw2 .guid-text1').addClass('on');
               }
               else{ // 입력값이 공백이 아니면
                  $('.pw2 .guid-text').removeClass('on');
                  if( pw2Val !== pw1Val ){ // 동일한 비밀번호가 아니면                    
                     $('.pw2 .guid-text2').addClass('on');
                  }
                  else {
                     $('.pw2 .guid-text2').removeClass('on');  
                     that.회원.비밀번호확인 =  $(this).val();                         
                  }
               }
            }
         })

      },
      nameFn(){ //이름
         const that = this;
        
         $('#name').on({
            keyup: function(){
               const regExp = /[`~!@#$%^&*()\-_=+|\\\]\}\[\{'";:/?.>,<]/g;
               let nameVal = $('#name').val();

               $('#name').val( nameVal.replace(regExp, '') );
               
               if( nameVal==='' ){
                  $('.name .guid-text').removeClass('on');
                  $('.name .guid-text1').addClass('on');
               }
               else{
                  $('.name .guid-text').removeClass('on');
                  that.회원.이름 =  $(this).val();                                         
               }

            }
         });

      },
      emailFn(){ //이메일 
         const that = this;

         $('#email').on({
            keyup: function(){
               const regExp = /^([A-Z0-9]+[^\s]*)+([._\-]?[A-Z0-9]*)@([A-Z0-9]+[^\s]*)+([._\-]?[A-Z0-9]*).[A-Z]{2,3}$/gi;
               let emailVal = $('#email').val();

               // 매치함수를 이용 테스트 접검
               // console.log( emailVal.match(regExp) );

               if( emailVal==='' ){
                  $('.email .guid-text').removeClass('on');
                  $('.email .guid-text1').addClass('on');

               }
               else{
                  $('.email .guid-text').removeClass('on');      
                  if( regExp.test(emailVal)===false ){
                     $('.email .guid-text').removeClass('on');
                     $('.email .guid-text2').addClass('on');
                  }
                  else{
                     $('.email .guid-text').removeClass('on');   
                     that.회원.이메일 =  $(this).val();                        
                  }            
               }




            }
         })

         // 이메일 중복확인 버튼 이벤트
         $('.email-ok-btn').on({
            click: function(){

               const regExp = /^([A-Z0-9]+[^\s]*)+([._\-]?[A-Z0-9]*)@([A-Z0-9]+[^\s]*)+([._\-]?[A-Z0-9]*).[A-Z]{2,3}$/gi;
               let emailVal = $('#email').val();

               // 매치함수를 이용 테스트 접검
               // console.log( emailVal.match(regExp) );

               if( emailVal==='' ){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`이메일을 입력하세요.`);

               }
               else{
   
                  if( regExp.test(emailVal)===false ){
                     $('.member-modal').fadeIn(300);
                     $('.modal-message').html(`이메일 형식으로 입력하세요.`);
                  }
                  else{
                     $('.member-modal').fadeOut(300);                     
                     that.회원.이메일 =  $('#email').val();                      
                     // 이메일 중복 체크 메서드 호출
                     that.emailCheckOk();

                  }            
               }



            }
         })



      },
      hpFn(){ // 휴대폰

         let num = null;
         let m = 2;     //분 2
         let s = 59;    //초(0~59 => 60초)
         const that = this;
        
         $('#hp').on({
            keyup: function(){

               const regExp = /[`~!@#$%^&*()\-_=+|\\\]\}\[\{'";:/?.>,<]/g;
               let hpVal = $('#hp').val();

               // 특수문자는 삭제
               $('#hp').val( hpVal.replace(regExp,'') );
               hpVal = $('#hp').val();

               //10자 이상이면 우측번튼 보이기
               if( hpVal.length>=10 ){
                  $('.hp-btn').show()
                              .addClass('on')
                              .attr('disabled', false); //버튼사용가능 disabled', false
                  $('.hp2-btn').hide();
                  
                  $('#hpOk').val('')
                            .focus();
               }
               else{
                  $('.hp-btn').removeClass('on');
               }

               if( hpVal==='' ){
                  $('.hp .guid-text').removeClass('on');
                  $('.hp .guid-text1').addClass('on');
               }
               else{
                  $('.hp .guid-text').removeClass('on');
                  that.회원.휴대폰 =  $(this).val();
               }

            }
         })


         // 휴대폰 입증번호 받기 버튼 클릭 이벤트 disabled', true  버튼사용불가
         // 클릭 정규표현식 검증
               
         $('.hp-btn').on({
            click: function(e){
               e.preventDefault();  
               const regExp = /^01[0|1|6|7|8|9]+[0-9]{3,4}[0-9]{4}$/g;  // 휴대폰 010, 011, 016, 017, 018, 019
               let hpVal = $('#hp').val(); //입력값

               if( regExp.test(hpVal)===false ){  // !==true  true가 아니면 결국 false 이면
                  $('.hp .guid-text').removeClass('on');
                  $('.hp .guid-text2').addClass('on');
               }
               else{ // 정상
                  $('.hp .guid-text').removeClass('on');
                  // 인증번호 발송 : 6자리 랜덤번호(임의의 번호)  10만단위 : 999999
                  // 자리내림
                  num = Math.floor( Math.random()*900000+100000 ); // 수학객체 0 ~ 1 랜덤함수 0.6863693958147086
                  
                  that.회원.휴대폰인증번호 = num; //인증번호 잠시 보관 할 변수에 저장

                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`인증번호가 발송되었습니다.<br>${num}`);

                  // 인증번호확인 박스 보이기
                  $('.hp-ok-box').css({display:'flex'});
                  
                  // 3분 카운트 함수 호출 실행
                  timerCount();

               }
            }
         })

         // 3분 카운트 프로그래밍 함수
         function timerCount(){
            m = 2; //분 2
            s = 59; //초(0~59 => 60초)
            that.회원.setId = setInterval(function(){
               s--;
               // console.log( that.회원.setId );               
               if(s<0){ //60초 경고 그러면 1분 감소
                  s=59;
                  m--;
                  if(m<0){
                     s=0;
                     m=0;
                     clearInterval(that.회원.setId);
                     // console.log( that.회원.setId );
                     $('.member-modal').fadeIn(300);
                     $('.modal-message').html("유효 시간이 만료되었습니다.<br>다시 시도해 주세요.");
                     return;
                  }
               }
               $('.minutes').text( `${ m < 10 ? '0'+m : m }` );
               $('.seconds').text( `${ s < 10 ? '0'+s : s }` );
            }, 1000);

            // console.log('휴대폰 타이머 ', that.회원.setId );

         }

         

         // 멤버 모달 닫기
         $('.member-modal-close-btn').on({
            click: function(){              
               $('.member-modal').fadeOut(300);
               //모달창 닫고 인트로 페이지로 이동
               if( that.회원.가입완료 === true ){
                  location.href = path;  //php 전달해준 루트 위치의 변수 
               }
            }
         })
         

         // 인증번호 입력 이벤트
         // 숫자가 1글자 이상  입력되면(빈값이 아니면) 우측버튼 활성화
         // 입력상자는 숫자를 제외한 모든건 삭제 /[^\d]/g  /[^0-9]/g
         $('#hpOk').on({
            keyup: function(){
               const regExp = /[^0-9]/;
               let hpOkVal = $('#hpOk').val();
               
               $('#hpOk').val( hpOkVal.replace(regExp, '') );

               if( hpOkVal.length > 1 ){
                  $('.hp-ok-btn').addClass('on');
                  $('.hp-ok-btn').attr('disabled', false);
               }
               else{
                  $('.hp-ok-btn').removeClass('on');
                  $('.hp-ok-btn').attr('disabled', true);
               }
            }
         });

         // 인증번호 확인 버튼 클릭 이벤트
         $('.hp-ok-btn').on({
            click: function(e){
               e.preventDefault();

                  // 휴대폰 인증 체크 메서드 호출 실행
                  that.hpCheckOk();

            }
         })

         // 다른번호 인증
         $('.hp2-btn').on({
            click: function(e){
               e.preventDefault();
               $('#hp').attr('disabled', false)
                       .val('')                 //입력상자 내용 삭제
                       .focus();                //입력대기 상태
               $('.hp .guid-text1').addClass('on');  // 안내 테스트 출력
            }
         });


      },
      addrFn(){ // 카카오 주소검색 버튼 클릭 이벤트
         let   $child = ''; 
         const that   = this;

         function popupFn(){
            const popW     = 530;
            const popH     = 615;
            const popName  = '_popup_postcode_20221024';
            const popFile  = './popup.html';
            let   winW     = $(window).innerWidth();
            let   winH     = $(window).innerHeight();
            let   top      = (winH-popH)/2; // top  = (창높이-팝업창의높이)/2
            let   left     = (winW-popW)/2; // left = (창너비-팝업창의너비)/2

            $child = window.open( popFile , popName ,`width=${popW}, height=${popH}, top=${top}, left=${left}`);
         }

         // 부모창에서 자식창의 입력상자 값을 가져오기
         // let childAddress1Value = $child.$('#address1').val();

         // 팝업창에서(자식창) 부모창의 입력상자 값을 가져오기
         // let parentAddr1Value = opener.$('addr1').val();


         //카카오 주소검색 버튼 클릭 이벤트
         $('.addr-search-btn').on({
            click: function(e){
               e.preventDefault();
               popupFn();               
            }
         });

         //카카오 주소 재검색 버튼 클릭 이벤트
         $('.addr-research-btn').on({
            click: function(e){
               e.preventDefault();
               popupFn();
            }
         });
      
         

         // 팝업창에서 저장한 로컬스토레이지 데이터를 가져와서 
         // 비교하고 만약 주소 키 'kurly Address' 가 있다면 유지
         function addressFn(){
            let addressKey = 'kurly Address';
            let key = '';
            let obj = '';
            for(let i=0; i<sessionStorage.length; i++){
               if( sessionStorage.key(i) === addressKey ){
                  $('#addr1, #addr2, .addr-research-btn').show(); //주소1,주소2,재검색버튼
                  $('.addr-search-btn').hide();                   //주소검색버튼

                  key = sessionStorage.getItem(addressKey);   //키 가져오기  주소2값 1408동 205호
                  obj = JSON.parse(sessionStorage.getItem(key));  //주소1, 주소2
                  $('#addr1').val( obj.주소1 );
                  $('#addr2').val( obj.주소2 );
                  that.회원.주소1 =  obj.주소1;                             
                  that.회원.주소2 =  obj.주소2;

               }               
            }            
         }
         addressFn();
      
      },
      genderFn(){  // 성별
         const that = this; //객체(Object) SignUp 
         // 성별 이벤트 구현
         $('.gender-btn').each(function(idx,item){
            // console.log( idx, item.id, item.type, item.name, item.value );
            $(this).on({ // 개체 태그 요소 $('.gender-btn') 
               change: function(){
                  that.회원.성별 = $(this).val();
               }
            });
         });
      },
      birthFn(){  //생년월일              
         const that = this;
         const regExpUnNum   = /[^0-9]/g; // 숫자가 아닌것
         const regExpYear  = /^(?:19(?:2[2-9]|[3-9][0-9])|2[0-9][0-9][0-9])$/g; //1. 생년 (1900~1999) ~ (2000~2999)
         const regExpMonth = /^(?:0?[1-9]|1[0-2])$/g;  //2. 생월 01 .. 09  ~ 10  11  12 const regExpMonth = /^(?:0?[1-9]|10|11|12)$/g;         
         const regExpDate  = /(?:0?[1-9]|1[0-9]|2[0-9]|3[0-1])/g;                   //3. 생일 1-9 10-19 20-29 30-31  / 01-09  10-19 20-29  30-31
         
         // 생년월일 체크 알고리즘
         function checkBirth(){

         }

         //0. 숫자가 아니면 삭제
         //1. 생년 이벤트 2022 100년기준 192[2-9]2[2-9] 이상  1922 ~ 2999 
         const nowYear = new Date().getFullYear();  //2022     
         $('#year').on({
            keyup: function(){
                  $(this).val( $(this).val().replace(regExpUnNum,'') );
                  
                  if($(this).val()===''){
                     $('.birth-day p').removeClass('on');
                  }                    
                  else if( Number($(this).val()) > nowYear ){ //미래년도 2023 ~
                     $('.birth-day p').addClass('on')
                                      .text('생년월일이 미래로 입력 되었습니다.');
                  } 
                  else if( Number($(this).val()) >= nowYear-14 ){ //14미만   20022 ~ 2008
                     $('.birth-day p').addClass('on')
                                      .text('만 14세 미만은 가입이 불가합니다.');
                  }                    
                  else{
                     if( regExpYear.test( $(this).val().toString() ) === false ){
                           $('.birth-day p').addClass('on')
                                            .text('생년월일을 다시 확인해주세요.');
                     }               
                     else{
                           $('.birth-day p').text('태어난 월을 정확하게 입력해주세요.');
                     }  
                  } 

            }
         })

         //2. 생월 이벤트
         $('#month').on({
            keyup: function(){
               $('#month').val( $('#month').val().replace(regExpUnNum,'') );

               if( $('#year').val() ==='' ){ //년도가 비어있으면 
                  $('.birth-day p').addClass('on')
                                   .text('태어난 년도 4자리를 정확하게 입력해주세요.');
               }
               else{
                  if( $('#month').val()==='' ){
                     $('.birth-day p').addClass('on')
                                      .text('태어난 월을 정확하게 입력해주세요.');
                  }
                  else{
                     if( regExpMonth.test($('#month').val().toString()) === false ){
                        $('.birth-day p').addClass('on')
                                         .text('태어난 월을 정확하게 입력해주세요.');
                     }
                     else{
                        $('.birth-day p').addClass('on')
                                         .text('태어난 일을 정확하게 입력해주세요.');
                     }
                  }
               }

            }
         })

         //3. 생일 이벤트
         $('#date').on({
            keyup: function(){
               $('#date').val( $('#date').val().replace(regExpUnNum,'') );

               if($('#year').val()===''){ //윌이 비어있으면 
                  $('.birth-day p').addClass('on')
                                   .text('태어난 년도 4자리를 정확하게 입력해주세요.');
               }
               else if($('#month').val()===''){ //윌이 비어있으면 
                  $('.birth-day p').addClass('on')
                                   .text('태어난 월을 정확하게 입력해주세요.');
               }
               else{
                  if( $('#date').val()==='' ){
                     $('.birth-day p').addClass('on')
                                      .text('태어난 일을 정확하게 입력해주세요.');
                  }
                  else{
                    
                     if( regExpDate.test( $('#date').val().toString() ) === false ){
                        $('.birth-day p').addClass('on')
                                         .text('태어난 일을 정확하게 입력해주세요.');
                     }
                     else{
                        if( Number($('#date').val()) > 31 ){
                           $('.birth-day p').addClass('on')
                                            .text('태어난 일을 정확하게 입력해주세요.');
                        }  
                        else{
                           $('.birth-day p').removeClass('on');
                           that.회원.생년 = $('#year').val();
                           that.회원.생월 = $('#month').val();
                           that.회원.생일 = $('#date').val();                        
                        } 
                     }

                  }
               }

            }
         })
      },
      addInput(){
         const that = this;
         //추가입력사항
         $('.add-input-btn').each(function(idx,item){
            $(this).on({
               change: function(){                         
                  $('#choocheon').prop('placeholder',  item.value );
                  that.회원.추가입력사항1 = $(this).val();                  
               }
            })
         });

         // 키보드 입력하면서 저장
         $('#choocheon').on({
            keyup: function(){
               that.회원.추가입력사항2 = $('#choocheon').val();
            }
         })

      },
      serviceFn(){ //이용약관동의

         const that = this;
         let cnt = 0;
         let arr = [];

         // 모든 체크박스 체크드 확인 카운트 함수
         function checkedFn(){
            cnt = 0;
            $('.check-service').each(function(idx, item){
               if( $(this).is(':checked')===true ){
                  cnt++;
               }
            });

            // 체크항목이 7개이면 : 전체 동의 합니다. 자동 체크한다.
            if(cnt===7){
               $('#chkAll').prop('checked', true);
            }
            else{
               $('#chkAll').prop('checked', false);
            }
         }




            ////////////////////////////////////////////////////////
            // 한개 한개의 항목 체크
            $('.check-service').each(function(idx, item){
               $(this).on({
                  change: function(){
                     checkStateFn();
                     checkedFn(); //체크된 갯수를 카운트 7개이면 전체크박스 체크한다.
                  }
               });
            });


            // 체크된 항목의 갯수를 카운트하는 함수 : 집계(피봇)
            function checkStateFn(){

               $('.check-service').each(function(idx, item){
                  if( $(this).is(':checked')===true ){
                     //체크 한 항목 값 value 배열에 추가하기 ...전개연산자
                     arr = [...that.회원.이용약관, item.value];
                  }
                  else{
                     //체크 해제 한 항목 값 배열에서 삭제하기
                     //필터 arr = arr.filter( 반드시 화살표함수 사용할 것 필드 !=='사과');  해당하는 데이터만 제외하고 배열을 재배열하는 메서드
                     //arr = arr.filter((배열값)=> 배열값 !== 선택취소된항목값);
                     arr = arr.filter((val)=> val !== item.value);  // 취소된 항목 값은 배열에서 제외되고 재배열 저장
                  }
               });
               
               // 제거하면서 이전에 들어있는 데이터에 현재 체크된 데이터가 추가되기에 중복된 배열값이 누적된다
               // 그래서 중복된 데이터 제거한다. [...new Set(배열)]
               arr = [...new Set(arr)];
               that.회원.이용약관 = arr;  //최종 정리된 배열 데이터 저장

            }


            let 이용약관전체동의 = [
               '이용약관 동의(필수)',
               '개인정보 수집∙이용 동의(필수)',
               '개인정보 수집∙이용 동의(선택)',
               '무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)',
               'SNS',
               '이메일',
               '본인은 만 14세 이상입니다'
            ]
            // 전체 동의 합니다. 체크박스 이벤트
            $('#chkAll').on({
               change: function(){
                 // 모두 7개 항목을 체크해준다.
                 // 전체 동의가 체크되면 모두 체크한다.
                 // 전체 동의가 체크해제되면 모두 체크해제한다.
                 
                 //비구조화 = 구조 분할 할당 => 이 아래에서는 반드시 구조분할할당 한 변수만 사용해야한다.
                 let {이용약관} = that.회원;  

                 if( $(this).is(':checked')===true ){
                     $('.check-service').prop('checked', true);  
                     // that.회원.이용약관 = [...that.회원.이용약관, 이용약관전체동의]; 
                     이용약관 = [...이용약관, 이용약관전체동의]; 
                 }
                 else{
                     $('.check-service').prop('checked', false);
                     // that.회원.이용약관 = [];   //빈배열을 넣으면 배열이 삭제된다.
                     이용약관 = [];   //빈배열을 넣으면 배열이 삭제된다.
                 }
                 
               }
            });
        


            // 정보수신동의 sns 체크박스 이벤트
            // 1. 2개를 체크하는 함수
            // 2. sns-check 체크박스 체인지 이벤트 : 2개를 체크하는 함수 호출 실행
            // 3. sns-check-all 체인지 이벤트 : 체크하면 2개 모두 체크 아닌 2개 모두 해제
            function snsCheckStateFn(){
               let scnt = 0;
               $('.sns-check').each(function(){
                  if( $(this).is(':checked')===true ){
                     scnt++;
                  }
               });
               if(scnt===2){
                  $('.sns-check-all').prop('checked', true);
               }
               else{
                  $('.sns-check-all').prop('checked', false);
               }
            }

            $('.sns-check').each(function(){
               $(this).on({
                  change: function(){
                     snsCheckStateFn();
                     checkedFn(); //체크된 갯수를 카운트 7개이면 전체크박스 체크한다.
                  }
               })
            });

            $('.sns-check-all').on({
               change: function(){
                  if( $(this).is(':checked')===true ){
                     $('.sns-check').prop('checked', true);
                  }
                  else{
                     $('.sns-check').prop('checked', false);
                  }
                  checkedFn(); //체크된 갯수를 카운트 7개이면 전체크박스 체크한다.
               }
            })
      },

      // 아이디 중복 체크 메서드
      idCheckOk(){

            let that = this;
            let imsi = [];
            let result = [];
            let 아이디중복확인 = '';


            imsi = that.회원.가입회원;


            // 데이터베이스 조회하면 더이상 로컬스토레이지는 사용 안함.
            // 로컬스토레이지 회원 데이터 가져오기 테스트 점검용 데이터베이스 사용전까지
            // for(let i=0; i<localStorage.length; i++){
            //    imsi = [...imsi, JSON.parse( localStorage.getItem(localStorage.key(i)) )]; // 키값을 데이터
            // }
            // console.log('입력상자 아이디 '+  $('#id').val());
            // console.log( imsi );

            result = imsi.map((item) => item.아이디 === $('#id').val() );

            if( $('#id').val() === '' ){
               $('.member-modal').fadeIn(300);
               $('.modal-message').html(`아이디를  입력해 주세요`);
               $('#id').focus();
            }
            else {
               if( result.includes(true) ){  // 배열안에 true 논리값이 포함되어 있는지 검증
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`중복된 아이디 입니다.`);
                  아이디중복확인 = false;
               }
               else {
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`사용 가능한 아이디 입니다.`);
                  아이디중복확인 = true;  // 인증  중복검사 완료
               }
            }            


            return 아이디중복확인;

      },

       // 이메일 중복 체크 메서드
      emailCheckOk(){

            let that = this;
            let imsi = [];
            let result = [];
            let 이메일중복확인 = '';
            
            imsi = that.회원.가입회원;

            // 데이터베이스 사용시 로컬스토레이지 사용 안함.
            // for(let i=0; i<localStorage.length; i++){               
            //    imsi = [...imsi,  JSON.parse(localStorage.getItem(localStorage.key(i))) ];
            // }

            result = imsi.map((data)=>data.이메일 === $('#email').val() );

            if( $('#email').val() === '' ){
               $('.member-modal').fadeIn(300);
               $('.modal-message').html(`이메일  입력해 주세요`);
               $('#email').focus();
            }
            else {
               if( result.includes(true) ){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`중복된 이메일 입니다.`);
                  이메일중복확인 = false;
               }
               else {
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`사용 가능한 이메일 입니다.`);
                  이메일중복확인 = true;  // 이메일 중복확인 완료
               }
            }

            return 이메일중복확인;


      },

      // 휴대폰 인증 메서드
      hpCheckOk(){
         let that = this;
         let 휴대폰인증확인 = '';

         // num 변수값은  인증번호 발송하면서 
         // 루트 변수 that.회원.인증번호 에 저장해두고 
         // 가져와서 비교한다.

            if( that.회원.휴대폰인증번호 === Number($('#hpOk').val()) ){
               $('.member-modal').fadeIn(300);
               $('.modal-message').html("인증에 성공 하였습니다.");
               $('.hp-ok-box').hide();
               $('.hp-btn').hide();
               $('.hp2-btn').show();
               $('#hp').attr('disabled', true);
               휴대폰인증확인 = true;  // 휴대폰 인증완료
               clearInterval(that.회원.setId);
               // console.log('휴대폰 타이머 ', that.회원.setId );
            }
            else{
               $('.member-modal').fadeIn(300);
               $('.modal-message').html("잘못된 인증 코드입니다.");
               휴대폰인증확인 = false;  // 휴대폰 미인증
            }

            return 휴대폰인증확인;


      },
      // 전송 메서드
      submitFn(){
         const that = this;
         let cnt = 0;

         // 전송(submit) 이벤트
         // 전송버튼 클릭 이벤트
         $('.submit-btn').on({
            click: function(e){
               e.preventDefault();
               // 유효성 검사 : 아이디 ~ 이용약관까지 필수요소(반드시입력)와 선택요소
               
               that.회원.주소1 = $('#addr1').val();
               that.회원.주소2 = $('#addr2').val();
               that.회원.아이디중복확인  = that.idCheckOk(), // 메서드 만들어서 리턴값을 받아서 변수에 저장  
               that.회원.이메일중복확인  = that.emailCheckOk() // 메서드 만들어서 리턴값을 받아서 변수에 저장   
               that.회원.휴대폰인증확인  = that.hpCheckOk() // 메서드 만들어서 리턴값을 받아서 변수에 저장  
           

               // 화면에 그려진 즉 체크된 값들을 배열에 저장한다.
               // 이용약관 필수 선택 3개 이상 선택해야한다.
               $('.check-service').each(function(idx, item){
                  if( $(this).is(':checked') ){ //선택자 객체
                     that.회원.이용약관 = [...that.회원.이용약관, item.value];
                     // item.value 값 안에 필수 항목만 갯수를 카운트 
                     // 특정 문자열 검색 search(), 
                     // indexOf(문자열) 찾으면(0, 1 ,2) 글자의 위치 못찾으면 -1
                     if( item.value.indexOf('필수') >= 0  ){
                        cnt++;
                     }
                  }                  
               })
               

               
               if(that.회원.아이디===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`아이디를 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.비밀번호===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`비밀번호를 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.비밀번호확인===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`비밀번호를 한번더 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.이름===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`이름을 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.이메일===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`이메일을 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.휴대폰===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`휴대폰을 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }
               

               if(that.회원.주소1===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`주소1을 검색하여 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.주소2===''){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`나머지 주소를 입력해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(cnt<3){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`이용약관동의의 필수항목을 선택해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }



               // 중복확인 & 휴대폰인증
               // 비교값이 TRUE 이면 전송            
               if(that.회원.아이디중복확인===false){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`아이디 중복 확인해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.이메일중복확인===false){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`이메일 중복 확인해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }

               if(that.회원.휴대폰인증확인===false){
                  $('.member-modal').fadeIn(300);
                  $('.modal-message').html(`휴대폰 인증 확인해주세요`);
                  return;
               }
               else{
                  $('.member-modal').fadeOut(0);
                  $('.modal-message').html(``);
               }




               // 회원가입 데이터 정리 마무리 그리고 로컬스토레이지에 저장
               // 회원가입 데이터 정리 마무리 그리고 데이터베이스(닷홈) 저장(닷홈 웹서버) 배포 저장
               const regExpHp = /^(\d{3})(\d{3,4})(\d{4})$/g;

               
               // moonjong.dothome.co.kr/kurly_1109/
               // moonjong.dothome.co.kr/myadmin/
               
               let 마켓컬리회원  =  {  //테이블이름 market_kurly_member   (필드1, 필드2, FIELD(ITEM == ATTRIBUTE )) 
                  //idx: AUTO INCREMENT(자동증가인덱스번호),  AI  유일성
                  아이디: that.회원.아이디,  //16  id
                  비밀번호: that.회원.비밀번호, //16 pw
                  이름: that.회원.이름, // 250 irum
                  이메일: that.회원.이메일, // 250 email
                  휴대폰: that.회원.휴대폰.replace(regExpHp, '$1-$2-$3'),  //hp 13 01079425305 => 치환(replace)  010-7942-5305
                  주소: `${that.회원.주소1} ${that.회원.주소2}`, // 250 addr 
                  성별: that.회원.성별, //10 gender  선택사항 null 허용
                  생년월일: that.회원.생년 !== '' ? (`${that.회원.생년}-${that.회원.생월}-${that.회원.생일}`) : '', // 날짜 birth 선택사항 null 허용
                  추가입력사항: that.회원.추가입력사항1 !=='' ? (`${that.회원.추가입력사항1}  ${that.회원.추가입력사항2}`) : '',  // 250  add_input  선택사항  null 허용
                  이용약관: that.회원.이용약관,  // 1000 service_
                  가입일자: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`  //날짜 gaib_date
               }

               // localStorage.setItem(마켓컬리회원.아이디, JSON.stringify(마켓컬리회원) );

               //AJAX 전송
               $.ajax({
                  url:'./response.php',
                  type:'POST',
                  data: {//php에게 보낼 데이터
                     id: 마켓컬리회원.아이디,
                     pw: 마켓컬리회원.비밀번호,
                     irum: 마켓컬리회원.이름,
                     email: 마켓컬리회원.이메일,
                     hp: 마켓컬리회원.휴대폰,
                     addr: 마켓컬리회원.주소,
                     gender: 마켓컬리회원.성별,
                     birth: 마켓컬리회원.생년월일,
                     addInput: 마켓컬리회원.추가입력사항,
                     service: JSON.stringify(마켓컬리회원.이용약관),
                     gaibDate: 마켓컬리회원.가입일자
                  },
                  success: function(res){
                     that.회원.가입완료 = true;
                     $('.member-modal').fadeIn(300);
                     $('.modal-message').html(`감사합니다. ${마켓컬리회원.이름}회원가입을 축하드립니다.`);      
                     // 모달창 닫고 인트로 페이지로 이동
                  },
                  error: function(err){
                     console.log('AJAX 실패!', err);
                  }
               });



            }
         })
      }

   }
   SignUp.init();

})(jQuery, window);